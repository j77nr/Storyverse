import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { storySubmissionSchema } from '@/lib/validations/story';
import { moderateContent } from '@/data/contentPolicy';
import { ZodError } from 'zod';
import { sendEmail } from '@/lib/email';
import { emailTemplates } from '@/lib/email-templates';
import { rateLimit, rateLimits, getIdentifier } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Vous devez être connecté' },
        { status: 401 }
      );
    }

    // Rate limiting - 10 soumissions par heure
    const { success, remaining } = rateLimit(
      getIdentifier(req, session.user.id),
      rateLimits.submission
    );
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de soumissions. Réessayez dans 1 heure.' },
        { status: 429 }
      );
    }

    if (session.user.role !== 'AUTHOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Vous devez être auteur pour soumettre une histoire' },
        { status: 403 }
      );
    }

    // Parser et valider les données
    const body = await req.json();
    const data = storySubmissionSchema.parse(body);

    // Modération du contenu
    const fullContent = `${data.title} ${data.description} ${data.chapters.map(c => `${c.title} ${c.content}`).join(' ')}`;
    const moderationResult = moderateContent(fullContent);

    // Déterminer le statut basé sur la modération
    let status: 'PUBLISHED' | 'PENDING' | 'REJECTED' = 'REJECTED';
    let rejectionReason: string | undefined;

    if (moderationResult.approved) {
      status = 'PUBLISHED';
    } else if (moderationResult.requiresManualReview) {
      status = 'PENDING';
    } else {
      status = 'REJECTED';
      rejectionReason = moderationResult.rejectionReasons?.join('. ');
    }

    // Créer l'histoire avec tous ses éléments
    const story = await prisma.story.create({
      data: {
        authorId: session.user.id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        genre: JSON.stringify(data.genre), // Convert array to JSON string
        accentColor: data.accentColor,
        status,
        moderationScore: moderationResult.score,
        moderationFlags: JSON.stringify(moderationResult.flags), // Convert array to JSON string
        rejectionReason,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        chapters: {
          create: data.chapters.map((chapter, index) => ({
            number: index + 1,
            title: chapter.title,
            content: chapter.content,
            readTime: `${Math.ceil(chapter.content.split(' ').length / 200)} min`,
          })),
        },
        contentWarnings: {
          create: data.contentWarnings.map(warning => ({ warning })),
        },
        stats: {
          create: {},
        },
      },
      include: {
        chapters: true,
        contentWarnings: true,
        stats: true,
      },
    });

    // Envoyer email de notification selon le statut
    const userName = session.user.name || 'Utilisateur';
    const userEmail = session.user.email!;
    
    if (status === 'PUBLISHED') {
      const emailTemplate = emailTemplates.storyPublished(
        userName,
        story.title,
        story.id
      );
      await sendEmail({
        to: userEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    } else if (status === 'PENDING') {
      const emailTemplate = emailTemplates.storyPending(
        userName,
        story.title
      );
      await sendEmail({
        to: userEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    } else {
      const emailTemplate = emailTemplates.storyRejected(
        userName,
        story.title,
        rejectionReason || 'Contenu non conforme aux guidelines'
      );
      await sendEmail({
        to: userEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }

    return NextResponse.json({
      success: true,
      story: {
        id: story.id,
        title: story.title,
        status: story.status,
        publishedAt: story.publishedAt,
      },
      moderationResult: {
        approved: moderationResult.approved,
        score: moderationResult.score,
        flags: moderationResult.flags,
        requiresManualReview: moderationResult.requiresManualReview,
        rejectionReasons: moderationResult.rejectionReasons,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la soumission d\'histoire:', error);

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
