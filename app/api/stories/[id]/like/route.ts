import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { rateLimit, rateLimits, getIdentifier } from '@/lib/rate-limit';

/**
 * POST /api/stories/[id]/like
 * Ajoute un like à une histoire
 * Note: Utilise localStorage côté client pour éviter les doublons
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id;

    // Rate limiting - 30 interactions par minute
    const { success } = rateLimit(
      getIdentifier(req),
      rateLimits.interaction
    );
    if (!success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans une minute.' },
        { status: 429 }
      );
    }

    // Vérifier que l'histoire existe
    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    // Créer ou mettre à jour les statistiques
    const stats = await prisma.storyStats.upsert({
      where: { storyId },
      update: {
        likes: { increment: 1 },
      },
      create: {
        storyId,
        views: 0,
        likes: 1,
        bookmarks: 0,
      },
    });

    return NextResponse.json({
      success: true,
      likes: stats.likes,
    });
  } catch (error) {
    console.error('Erreur lors du like:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/stories/[id]/like
 * Retire un like d'une histoire
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id;

    // Vérifier que les stats existent
    const stats = await prisma.storyStats.findUnique({
      where: { storyId },
    });

    if (!stats) {
      return NextResponse.json(
        { error: 'Statistiques non trouvées' },
        { status: 404 }
      );
    }

    // Décrémenter (minimum 0)
    const updatedStats = await prisma.storyStats.update({
      where: { storyId },
      data: {
        likes: Math.max(0, stats.likes - 1),
      },
    });

    return NextResponse.json({
      success: true,
      likes: updatedStats.likes,
    });
  } catch (error) {
    console.error('Erreur lors du unlike:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stories/[id]/like
 * Récupère le nombre de likes d'une histoire
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id;

    const stats = await prisma.storyStats.findUnique({
      where: { storyId },
      select: { likes: true },
    });

    return NextResponse.json({
      likes: stats?.likes || 0,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des likes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
