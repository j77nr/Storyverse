'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoryHero } from '@/components/hero/StoryHero';
import { motion } from 'framer-motion';
import { BookOpen, User, Heart, Bookmark, Eye } from 'lucide-react';

interface StoryDetailsClientProps {
  story: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    coverImage: string;
    accentColor: string;
    genres: string[];
    readTime: string;
    totalChapters: number;
    author: {
      name: string;
      avatar: string;
      bio: string;
    };
    chapters: Array<{
      id: string;
      number: number;
      title: string;
      readTime: string;
    }>;
    initialStats: {
      views: number;
      likes: number;
      bookmarks: number;
    };
  };
}

export default function StoryDetailsClient({ story }: StoryDetailsClientProps) {
  const router = useRouter();
  const [stats, setStats] = useState(story.initialStats);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger les statistiques en temps réel et l'état local
  useEffect(() => {
    // Charger les stats depuis l'API
    const fetchStats = async () => {
      try {
        const [viewsRes, likesRes, bookmarksRes] = await Promise.all([
          fetch(`/api/stories/${story.id}/view`),
          fetch(`/api/stories/${story.id}/like`),
          fetch(`/api/stories/${story.id}/bookmark`),
        ]);

        const [viewsData, likesData, bookmarksData] = await Promise.all([
          viewsRes.json(),
          likesRes.json(),
          bookmarksRes.json(),
        ]);

        setStats({
          views: viewsData.views || 0,
          likes: likesData.likes || 0,
          bookmarks: bookmarksData.bookmarks || 0,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      }
    };

    fetchStats();

    // Charger l'état depuis localStorage
    const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
    const bookmarkedStories = JSON.parse(localStorage.getItem('bookmarkedStories') || '[]');
    
    setLiked(likedStories.includes(story.id));
    setBookmarked(bookmarkedStories.includes(story.id));
  }, [story.id]);

  const handleStartReading = () => {
    router.push(`/stories/${story.id}/chapter/1`);
  };

  // Gérer le like
  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const method = liked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/stories/${story.id}/like`, { method });

      if (res.ok) {
        const data = await res.json();
        setStats((prev) => ({ ...prev, likes: data.likes }));
        setLiked(!liked);

        // Mettre à jour localStorage
        const likedStories = JSON.parse(localStorage.getItem('likedStories') || '[]');
        if (liked) {
          const updated = likedStories.filter((id: string) => id !== story.id);
          localStorage.setItem('likedStories', JSON.stringify(updated));
        } else {
          localStorage.setItem('likedStories', JSON.stringify([...likedStories, story.id]));
        }
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gérer le bookmark
  const handleBookmark = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const method = bookmarked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/stories/${story.id}/bookmark`, { method });

      if (res.ok) {
        const data = await res.json();
        setStats((prev) => ({ ...prev, bookmarks: data.bookmarks }));
        setBookmarked(!bookmarked);

        // Mettre à jour localStorage
        const bookmarkedStories = JSON.parse(localStorage.getItem('bookmarkedStories') || '[]');
        if (bookmarked) {
          const updated = bookmarkedStories.filter((id: string) => id !== story.id);
          localStorage.setItem('bookmarkedStories', JSON.stringify(updated));
        } else {
          localStorage.setItem('bookmarkedStories', JSON.stringify([...bookmarkedStories, story.id]));
        }
      }
    } catch (error) {
      console.error('Erreur lors du bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StoryHero
        title={story.title}
        subtitle={story.subtitle}
        author={story.author.name}
        readTime={story.readTime}
        totalChapters={story.totalChapters}
        imageSrc={story.coverImage}
        imageAlt={story.title}
        accentColor={story.accentColor}
        onStartReading={handleStartReading}
      />

      {/* Story Details */}
      <section className="border-t py-16">
        <div className="mx-auto max-w-4xl px-6">
          {/* Statistiques et Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-6"
          >
            {/* Statistiques */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-foreground/70">
                <Eye className="h-5 w-5" />
                <span className="font-medium">{stats.views.toLocaleString()} vues</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Heart className={`h-5 w-5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="font-medium">{stats.likes.toLocaleString()} likes</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
                <span className="font-medium">{stats.bookmarks.toLocaleString()} sauvegardes</span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                  liked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'border bg-background hover:bg-foreground/5'
                } disabled:opacity-50`}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Aimé' : 'Aimer'}
              </button>
              <button
                onClick={handleBookmark}
                disabled={loading}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                  bookmarked
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'border bg-background hover:bg-foreground/5'
                } disabled:opacity-50`}
              >
                <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Sauvegardé' : 'Sauvegarder'}
              </button>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="mb-4 text-3xl font-bold">Synopsis</h2>
            <p className="text-lg leading-relaxed text-foreground/80">{story.description}</p>
          </motion.div>

          {/* Genres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="mb-4 text-xl font-semibold">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {story.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-foreground/10 px-4 py-2 text-sm font-medium"
                >
                  {g}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Author Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 rounded-2xl border bg-card p-6"
          >
            <div className="flex items-start gap-4">
              <img
                src={story.author.avatar}
                alt={story.author.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <User className="h-4 w-4 text-foreground/60" />
                  <h3 className="text-xl font-semibold">{story.author.name}</h3>
                </div>
                <p className="text-foreground/70">{story.author.bio}</p>
              </div>
            </div>
          </motion.div>

          {/* Chapters List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="mb-6 text-3xl font-bold">Chapitres</h2>
            <div className="space-y-4">
              {story.chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => router.push(`/stories/${story.id}/chapter/${chapter.number}`)}
                  className="group w-full rounded-xl border bg-card p-6 text-left transition-all hover:border-foreground/20 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-sm font-bold">
                          {chapter.number}
                        </span>
                        <h3 className="text-xl font-semibold group-hover:text-foreground/80">
                          {chapter.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{chapter.readTime} de lecture</span>
                      </div>
                    </div>
                    <div className="text-foreground/40 transition-transform group-hover:translate-x-1">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
