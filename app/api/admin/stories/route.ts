import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier l'authentification et le rôle admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer toutes les histoires avec les informations de l'auteur
    const stories = await prisma.story.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        chapters: {
          select: {
            id: true,
          },
        },
        stats: {
          select: {
            views: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Formater les données
    const formattedStories = stories.map((story) => ({
      id: story.id,
      title: story.title,
      subtitle: story.subtitle,
      author: {
        name: story.author.name || 'Anonyme',
        email: story.author.email,
      },
      status: story.status,
      views: story.stats?.views || 0,
      likes: story.stats?.likes || 0,
      chapters: story.chapters.length,
      moderationScore: story.moderationScore,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
    }));

    return NextResponse.json({
      stories: formattedStories,
      total: formattedStories.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des histoires:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
