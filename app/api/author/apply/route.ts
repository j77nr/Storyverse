import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authorApplicationSchema } from '@/lib/validations/author';
import { ZodError } from 'zod';
import { sendEmail } from '@/lib/email';
import { emailTemplates } from '@/lib/email-templates';
import { rateLimit, rateLimits, getIdentifier } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Vous devez être connecté pour soumettre une candidature' },
        { status: 401 }
      );
    }

    // Rate limiting - 5 candidatures par jour
    const { success } = rateLimit(
      getIdentifier(req, session.user.id),
      rateLimits.application
    );
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessayez demain.' },
        { status: 429 }
      );
    }

    // Parser et valider les données
    const body = await req.json();
    const data = authorApplicationSchema.parse(body);

    // Vérifier si l'utilisateur a déjà une candidature
    const existingApplication = await prisma.authorApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (existingApplication) {
      return NextResponse.json(
        { 
          error: 'Vous avez déjà soumis une candidature',
          status: existingApplication.status 
        },
        { status: 400 }
      );
    }

    // Créer la candidature
    const application = await prisma.authorApplication.create({
      data: {
        userId: session.user.id,
        bio: data.bio,
        motivation: data.motivation,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Envoyer email de confirmation
    const emailTemplate = emailTemplates.applicationReceived(
      application.user.name || 'Utilisateur'
    );
    await sendEmail({
      to: application.user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
        submittedAt: application.submittedAt,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la soumission de candidature:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la soumission' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Récupérer la candidature de l'utilisateur
    const application = await prisma.authorApplication.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        submittedAt: true,
        reviewedAt: true,
        reviewNote: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { application: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Erreur lors de la récupération de candidature:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
