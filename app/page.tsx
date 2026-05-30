import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import HomePageClient from './HomePageClient';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  // Récupérer les histoires featured depuis la base de données
  const featuredStories = await prisma.story.findMany({
    where: {
      status: 'PUBLISHED',
      featured: true,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      chapters: {
        select: {
          id: true,
        },
      },
      stats: true,
    },
    take: 3,
    orderBy: {
      publishedAt: 'desc',
    },
  });

  // Formater les données pour le composant client
  const formattedStories = featuredStories.map((story) => ({
    id: story.id,
    title: story.title,
    author: {
      name: story.author.name || 'Anonyme',
      avatar: story.author.image || '',
    },
    coverImage: story.coverImage || '/images/default-cover.jpg',
    accentColor: story.accentColor,
    genre: JSON.parse(story.genre),
    readTime: `${story.chapters.length * 5} min`,
    totalChapters: story.chapters.length,
    description: story.description,
  }));

  return <HomePageClient session={session} featuredStories={formattedStories} />;
}
