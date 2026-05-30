import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ChapterReaderClient from './ChapterReaderClient';

// Server Component - Charge les données depuis la base
export default async function ChapterPage({
  params,
}: {
  params: { id: string; number: string };
}) {
  const chapterNumber = parseInt(params.number);

  if (isNaN(chapterNumber) || chapterNumber < 1) {
    notFound();
  }

  // Charger le chapitre avec les informations de l'histoire
  const chapter = await prisma.chapter.findFirst({
    where: {
      storyId: params.id,
      number: chapterNumber,
      story: {
        status: 'PUBLISHED', // Seulement les histoires publiées
      },
    },
    include: {
      story: {
        select: {
          id: true,
          title: true,
          author: {
            select: {
              name: true,
            },
          },
          chapters: {
            select: {
              number: true,
              title: true,
            },
            orderBy: {
              number: 'asc',
            },
          },
        },
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  // Déterminer s'il y a un chapitre suivant/précédent
  const totalChapters = chapter.story.chapters.length;
  const hasNext = chapterNumber < totalChapters;
  const hasPrevious = chapterNumber > 1;

  // Préparer les données pour le client
  const chapterData = {
    storyId: chapter.storyId,
    chapterNumber: chapter.number,
    chapterTitle: chapter.title,
    content: chapter.content,
    totalChapters,
    hasNext,
    hasPrevious,
    storyTitle: chapter.story.title,
    authorName: chapter.story.author.name || 'Auteur Anonyme',
  };

  return <ChapterReaderClient chapter={chapterData} />;
}

// Générer les métadonnées pour le SEO
export async function generateMetadata({
  params,
}: {
  params: { id: string; number: string };
}) {
  const chapterNumber = parseInt(params.number);

  const chapter = await prisma.chapter.findFirst({
    where: {
      storyId: params.id,
      number: chapterNumber,
    },
    include: {
      story: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!chapter) {
    return {
      title: 'Chapitre non trouvé',
    };
  }

  return {
    title: `${chapter.story.title} - Chapitre ${chapter.number}: ${chapter.title}`,
    description: `Lisez le chapitre ${chapter.number} de ${chapter.story.title}`,
  };
}
