'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChapterReader } from '@/components/story/ChapterReader';

interface ChapterReaderClientProps {
  chapter: {
    storyId: string;
    chapterNumber: number;
    chapterTitle: string;
    content: string;
    totalChapters: number;
    hasNext: boolean;
    hasPrevious: boolean;
    storyTitle: string;
    authorName: string;
  };
}

export default function ChapterReaderClient({ chapter }: ChapterReaderClientProps) {
  const router = useRouter();

  // Tracker automatiquement la vue après 5 secondes de lecture
  useEffect(() => {
    // Vérifier si cette vue a déjà été comptée dans cette session
    const viewedKey = `viewed_${chapter.storyId}`;
    const alreadyViewed = sessionStorage.getItem(viewedKey);

    if (!alreadyViewed) {
      const timer = setTimeout(async () => {
        try {
          await fetch(`/api/stories/${chapter.storyId}/view`, { method: 'POST' });
          // Marquer comme vu dans cette session
          sessionStorage.setItem(viewedKey, 'true');
        } catch (error) {
          console.error('Erreur lors du tracking de vue:', error);
        }
      }, 5000); // 5 secondes

      return () => clearTimeout(timer);
    }
  }, [chapter.storyId]);

  const handleNextChapter = () => {
    if (chapter.hasNext) {
      router.push(`/stories/${chapter.storyId}/chapter/${chapter.chapterNumber + 1}`);
    }
  };

  const handlePreviousChapter = () => {
    if (chapter.hasPrevious) {
      router.push(`/stories/${chapter.storyId}/chapter/${chapter.chapterNumber - 1}`);
    }
  };

  return (
    <ChapterReader
      storyId={chapter.storyId}
      chapterNumber={chapter.chapterNumber}
      chapterTitle={chapter.chapterTitle}
      content={chapter.content}
      totalChapters={chapter.totalChapters}
      onNextChapter={handleNextChapter}
      onPreviousChapter={handlePreviousChapter}
      hasNext={chapter.hasNext}
      hasPrevious={chapter.hasPrevious}
    />
  );
}
