import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StoryDetailsClient from './StoryDetailsClient';

// Server Component - Charge les données depuis la base
export default async function StoryPage({ params }: { params: { id: string } }) {
  const story = await prisma.story.findUnique({
    where: { 
      id: params.id,
      status: 'PUBLISHED', // Seulement les histoires publiées
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      chapters: {
        orderBy: { number: 'asc' },
        select: {
          id: true,
          number: true,
          title: true,
          readTime: true,
        },
      },
      stats: {
        select: {
          views: true,
          likes: true,
          bookmarks: true,
        },
      },
    },
  });

  if (!story) {
    notFound();
  }

  // Parser le genre (stocké en JSON)
  const genres = JSON.parse(story.genre);

  // Calculer le temps de lecture total
  const totalReadTime = story.chapters.reduce((total, chapter) => {
    const minutes = parseInt(chapter.readTime);
    return total + (isNaN(minutes) ? 0 : minutes);
  }, 0);

  // Préparer les données pour le client
  const storyData = {
    id: story.id,
    title: story.title,
    subtitle: story.subtitle || '',
    description: story.description,
    coverImage: story.coverImage || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80',
    accentColor: story.accentColor,
    genres,
    readTime: `${totalReadTime} min`,
    totalChapters: story.chapters.length,
    author: {
      name: story.author.name || 'Auteur Anonyme',
      avatar: story.author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${story.author.id}`,
      bio: 'Auteur sur StoryVerse', // TODO: Ajouter bio dans le modèle User
    },
    chapters: story.chapters,
    initialStats: {
      views: story.stats?.views || 0,
      likes: story.stats?.likes || 0,
      bookmarks: story.stats?.bookmarks || 0,
    },
  };

  return <StoryDetailsClient story={storyData} />;
}

// Générer les métadonnées pour le SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const story = await prisma.story.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      subtitle: true,
      description: true,
    },
  });

  if (!story) {
    return {
      title: 'Histoire non trouvée',
    };
  }

  return {
    title: `${story.title} - StoryVerse`,
    description: story.description,
  };
}
