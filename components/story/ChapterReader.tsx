'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ChapterReaderProps {
  storyId: string;
  chapterNumber: number;
  chapterTitle: string;
  content: string;
  totalChapters: number;
  onNextChapter?: () => void;
  onPreviousChapter?: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const ChapterReader = ({
  storyId,
  chapterNumber,
  chapterTitle,
  content,
  totalChapters,
  onNextChapter,
  onPreviousChapter,
  hasNext,
  hasPrevious,
}: ChapterReaderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const fontSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl',
  };

  return (
    <div className={cn('min-h-screen transition-colors duration-300', isDarkMode ? 'bg-gray-900' : 'bg-background')}>
      {/* Reading Controls */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <Link href={`/stories/${storyId}`}>
            <button className="flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
          </Link>

          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <BookOpen className="h-4 w-4" />
            <span>
              Chapitre {chapterNumber} / {totalChapters}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Font Size */}
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as any)}
              className="rounded-lg border bg-background px-2 py-1 text-sm"
            >
              <option value="small">Petit</option>
              <option value="medium">Moyen</option>
              <option value="large">Grand</option>
            </select>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="rounded-lg p-2 transition-colors hover:bg-foreground/10"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <AnimatePresence mode="wait">
        <motion.article
          key={chapterNumber}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl px-6 py-12"
        >
          <h1 className="mb-8 text-4xl font-bold text-foreground md:text-5xl">{chapterTitle}</h1>

          <div className={cn('prose prose-lg max-w-none leading-relaxed text-foreground/80', fontSizeClasses[fontSize])}>
            {content.split('\n\n').map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="mb-6"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.article>
      </AnimatePresence>

      {/* Navigation */}
      <div className="border-t bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-6">
          {hasPrevious ? (
            <button
              onClick={onPreviousChapter}
              className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Chapitre précédent
            </button>
          ) : (
            <div />
          )}

          {hasNext ? (
            <button
              onClick={onNextChapter}
              className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Chapitre suivant
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link href={`/stories/${storyId}`}>
              <button className="rounded-lg bg-foreground/10 px-6 py-3 font-medium text-foreground transition-colors hover:bg-foreground/20">
                Retour à l'histoire
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
