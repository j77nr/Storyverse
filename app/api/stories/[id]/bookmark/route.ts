import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/stories/[id]/bookmark
 * Ajoute un bookmark à une histoire
 * Note: Utilise localStorage côté client pour éviter les doublons
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
        bookmarks: { increment: 1 },
      },
      create: {
        storyId,
        views: 0,
        likes: 0,
        bookmarks: 1,
      },
    });

    return NextResponse.json({
      success: true,
      bookmarks: stats.bookmarks,
    });
  } catch (error) {
    console.error('Erreur lors du bookmark:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/stories/[id]/bookmark
 * Retire un bookmark d'une histoire
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
        bookmarks: Math.max(0, stats.bookmarks - 1),
      },
    });

    return NextResponse.json({
      success: true,
      bookmarks: updatedStats.bookmarks,
    });
  } catch (error) {
    console.error('Erreur lors du unbookmark:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stories/[id]/bookmark
 * Récupère le nombre de bookmarks d'une histoire
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyId = params.id;

    const stats = await prisma.storyStats.findUnique({
      where: { storyId },
      select: { bookmarks: true },
    });

    return NextResponse.json({
      bookmarks: stats?.bookmarks || 0,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des bookmarks:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
