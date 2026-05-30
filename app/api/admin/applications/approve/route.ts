import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { emailTemplates } from '@/lib/email-templates';

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle ADMIN
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès refusé. Rôle ADMIN requis.' },
        { status: 403 }
      );
    }

    const { applicationId, userId, reviewNote } = await req.json();

    if (!applicationId || !userId) {
      return NextResponse.json(
        { error: 'applicationId et userId sont requis' },
        { status: 400 }
      );
    }

    // Approuver la candidature
    const application = await prisma.authorApplication.update({
      where: { id: applicationId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewNote: reviewNote || 'Candidature approuvée',
      },
    });

    // Changer le rôle de l'utilisateur en AUTHOR
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: 'AUTHOR' },
    });

    // Envoyer email d'approbation
    const emailTemplate = emailTemplates.applicationApproved(
      user.name || 'Utilisateur'
    );
    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({
      success: true,
      application,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'approbation' },
      { status: 500 }
    );
  }
}
