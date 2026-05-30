import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Récupérer toutes les histoires de l'auteur
    const stories = await prisma.story.findMany({
      where: { authorId: session.user.id },
      include: {
        chapters: {
          select: {
            id: true,
            number: true,
            title: true,
            readTime: true,
          },
          orderBy: { number: 'asc' },
        },
        stats: true,
        contentWarnings: true,
        _count: {
          select: { chapters: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Formater les données pour le frontend
    const formattedStories = stories.map(story => ({
      id: story.id,
      title: story.title,
      subtitle: story.subtitle,
      description: story.description,
      genre: JSON.parse(story.genre || '[]'), // Parse JSON string to array
      accentColor: story.accentColor,
      status: story.status,
      moderationScore: story.moderationScore,
      moderationFlags: JSON.parse(story.moderationFlags || '[]'), // Parse JSON string to array
      rejectionReason: story.rejectionReason,
      views: story.stats?.views || 0,
      likes: story.stats?.likes || 0,
      bookmarks: story.stats?.bookmarks || 0,
      chapters: story._count.chapters,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      publishedAt: story.publishedAt,
      contentWarnings: story.contentWarnings.map(w => w.warning),
    }));

    return NextResponse.json({ stories: formattedStories });
  } catch (error) {
    console.error('Erreur lors de la récupération des histoires:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
