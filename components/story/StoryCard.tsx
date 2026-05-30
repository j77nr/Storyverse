'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StoryCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  accentColor: string;
  genre: string[];
  readTime: string;
  totalChapters: number;
  description: string;
  className?: string;
}

export const StoryCard = ({
  id,
  title,
  author,
  coverImage,
  accentColor,
  genre,
  readTime,
  totalChapters,
  description,
  className,
}: StoryCardProps) => {
  return (
    <Link href={`/stories/${id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'group relative overflow-hidden rounded-2xl bg-card shadow-lg transition-shadow hover:shadow-2xl',
          className
        )}
      >
        {/* Image Container */}
        <div className="relative h-64 w-full overflow-hidden">
          <div className={cn('absolute inset-0 opacity-20', accentColor)} />
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/400x600/8b5cf6/ffffff?text=${encodeURIComponent(title)}`;
            }}
          />
          
          {/* Genre Tags */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="mb-2 text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors">
            {title}
          </h3>
          
          <p className="mb-4 text-sm text-foreground/60">Par {author}</p>
          
          <p className="mb-4 line-clamp-2 text-sm text-foreground/70">
            {description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-foreground/60">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{totalChapters} chapitres</span>
            </div>
          </div>
        </div>

        {/* Hover Accent */}
        <div className={cn('absolute bottom-0 left-0 h-1 w-full transition-all duration-300 group-hover:h-2', accentColor)} />
      </motion.div>
    </Link>
  );
};
