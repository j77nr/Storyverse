import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'PUBLISHED';
    const query = searchParams.get('q') || '';
    const genre = searchParams.get('genre') || '';
    const sort = searchParams.get('sort') || 'recent';

    // Construire les conditions de recherche
    const where: any = {
      status: status as any,
    };

    // Recherche par titre ou description
    if (query.trim()) {
      where.OR = [
        { title: { contains: query.trim() } },
        { description: { contains: query.trim() } },
      ];
    }

    // Filtre par genre
    if (genre.trim()) {
      where.genre = { contains: genre.trim() };
    }

    // Déterminer l'ordre de tri
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sort === 'title') {
      orderBy = { title: 'asc' };
    } else if (sort === 'popular') {
      orderBy = { createdAt: 'desc' }; // On triera côté client par vues
    }

    // Récupérer les histoires
    const stories = await prisma.story.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        chapters: {
          select: {
            id: true,
            number: true,
            title: true,
            readTime: true,
          },
          orderBy: {
            number: 'asc',
          },
        },
        stats: {
          select: {
            views: true,
            likes: true,
            bookmarks: true,
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
      orderBy,
    });

    // Transformer les données pour le frontend
    const transformedStories = stories.map((story) => {
      // Calculer le temps de lecture total
      const totalReadMinutes = story.chapters.reduce((acc, ch) => {
        const mins = parseInt(ch.readTime) || 0;
        return acc + mins;
      }, 0);

      return {
        id: story.id,
        title: story.title,
        description: story.description,
        author: {
          name: story.author.name || 'Auteur Anonyme',
          avatar: story.author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.author.id}`,
        },
        coverImage: story.coverImage || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
        accentColor: story.accentColor,
        genre: JSON.parse(story.genre as string),
        totalChapters: story._count.chapters,
        readTime: totalReadMinutes > 0 ? `${totalReadMinutes} min` : `${story._count.chapters * 5} min`,
        featured: story.featured,
        status: story.status,
        views: story.stats?.views || 0,
        likes: story.stats?.likes || 0,
        bookmarks: story.stats?.bookmarks || 0,
        createdAt: story.createdAt,
      };
    });

    // Tri par popularité côté serveur
    if (sort === 'popular') {
      transformedStories.sort((a, b) => b.views - a.views);
    }

    return NextResponse.json({ stories: transformedStories });
  } catch (error) {
    console.error('Erreur lors de la récupération des histoires:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
