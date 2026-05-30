import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Récupérer tous les auteurs avec leurs histoires publiées
    const authors = await prisma.user.findMany({
      where: {
        role: 'AUTHOR',
        stories: {
          some: {
            status: 'PUBLISHED',
          },
        },
      },
      include: {
        stories: {
          where: {
            status: 'PUBLISHED',
          },
          select: {
            id: true,
            title: true,
            description: true,
            genre: true,
            accentColor: true,
            _count: {
              select: {
                chapters: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        authorApplication: {
          select: {
            bio: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transformer les données pour le frontend
    const transformedAuthors = authors.map((author) => ({
      id: author.id,
      name: author.name || 'Auteur Anonyme',
      email: author.email,
      avatar: author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.name}`,
      bio: author.authorApplication?.bio || 'Auteur passionné de StoryVerse',
      storiesCount: author.stories.length,
      stories: author.stories.map((story) => ({
        id: story.id,
        title: story.title,
        description: story.description,
        genre: JSON.parse(story.genre as string),
        accentColor: story.accentColor,
        totalChapters: story._count.chapters,
      })),
    }));

    return NextResponse.json({ authors: transformedAuthors });
  } catch (error) {
    console.error('Erreur lors de la récupération des auteurs:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
