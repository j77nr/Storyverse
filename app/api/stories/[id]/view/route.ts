import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/stories/[id]/view
 * Incrémente le compteur de vues d'une histoire
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id;

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
        views: { increment: 1 },
      },
      create: {
        storyId,
        views: 1,
        likes: 0,
        bookmarks: 0,
      },
    });

    return NextResponse.json({
      success: true,
      views: stats.views,
    });
  } catch (error) {
    console.error('Erreur lors du tracking de vue:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stories/[id]/view
 * Récupère le nombre de vues d'une histoire
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id;

    const stats = await prisma.storyStats.findUnique({
      where: { storyId },
      select: { views: true },
    });

    return NextResponse.json({
      views: stats?.views || 0,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des vues:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
