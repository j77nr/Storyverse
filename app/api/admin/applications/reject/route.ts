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

    const { applicationId, reviewNote } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'applicationId est requis' },
        { status: 400 }
      );
    }

    // Rejeter la candidature
    const application = await prisma.authorApplication.update({
      where: { id: applicationId },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewNote: reviewNote || 'Candidature rejetée',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // Envoyer email de rejet
    const emailTemplate = emailTemplates.applicationRejected(
      application.user.name || 'Utilisateur',
      reviewNote
    );
    await sendEmail({
      to: application.user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Erreur lors du rejet:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du rejet' },
      { status: 500 }
    );
  }
}
