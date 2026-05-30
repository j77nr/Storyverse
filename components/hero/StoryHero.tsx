'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StoryHeroProps {
  title: string;
  subtitle?: string;
  author: string;
  readTime: string;
  chapterNumber?: number;
  totalChapters?: number;
  imageSrc: string;
  imageAlt: string;
  accentColor?: string;
  onStartReading?: () => void;
  className?: string;
}

export const StoryHero = ({
  title,
  subtitle,
  author,
  readTime,
  chapterNumber,
  totalChapters,
  imageSrc,
  imageAlt,
  accentColor = 'bg-purple-500',
  onStartReading,
  className,
}: StoryHeroProps) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-background p-6 md:p-12',
        className
      )}
    >
      {/* Back Button */}
      <div className="z-30 w-full max-w-7xl">
        <Link href="/library">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la bibliothèque
          </motion.button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-8 md:grid-cols-2">
        {/* Left: Story Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="z-20 flex flex-col justify-center space-y-6"
        >
          {chapterNumber && totalChapters && (
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/60">
              <BookOpen className="h-4 w-4" />
              <span>Chapitre {chapterNumber} sur {totalChapters}</span>
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold leading-tight text-foreground md:text-6xl lg:text-7xl">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl text-foreground/70 md:text-2xl">{subtitle}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readTime} de lecture</span>
            </div>
          </div>

          {onStartReading && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartReading}
              className="mt-4 w-fit rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              Commencer la lecture
            </motion.button>
          )}
        </motion.div>

        {/* Right: Image with Circle */}
        <div className="relative flex h-full items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className={cn(
              'absolute z-0 h-[300px] w-[300px] rounded-full md:h-[450px] md:w-[450px] lg:h-[550px] lg:w-[550px]',
              accentColor
            )}
          />
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-auto w-64 rounded-2xl object-cover shadow-2xl md:w-80 lg:w-96"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/400x600/8b5cf6/ffffff?text=${encodeURIComponent(title)}`;
            }}
          />
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="z-30 w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="h-1 w-32 rounded-full bg-foreground/20"
        />
      </div>
    </div>
  );
};
