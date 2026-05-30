'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { StoryCard } from '@/components/story/StoryCard';
import { BookOpen, Search, Filter, X, Loader2, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  coverImage: string;
  accentColor: string;
  genre: string[];
  totalChapters: number;
  readTime: string;
  featured: boolean;
  views: number;
  likes: number;
}

const GENRES = [
  'Fantasy',
  'Science-Fiction',
  'Thriller',
  'Mystère',
  'Romance',
  'Horreur',
  'Aventure',
  'Philosophique',
  'Gothique',
  'Écologique',
  'Espoir',
  'Action',
  'Drame',
  'Comédie',
  'Historique',
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'oldest', label: 'Plus ancien' },
  { value: 'popular', label: 'Plus populaire' },
  { value: 'title', label: 'Alphabétique' },
];

const STORIES_PER_PAGE = 9;

export default function LibraryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Charger les histoires
  const fetchStories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('q', debouncedQuery);
      if (selectedGenre) params.set('genre', selectedGenre);
      if (sortBy) params.set('sort', sortBy);

      const response = await fetch(`/api/stories?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setStories(data.stories);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedGenre, sortBy]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSortBy('recent');
    setCurrentPage(1);
  };

  // Reset page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedGenre, sortBy]);

  const hasActiveFilters = searchQuery || selectedGenre || sortBy !== 'recent';

  // Pagination
  const totalPages = Math.ceil(stories.length / STORIES_PER_PAGE);
  const paginatedStories = stories.slice(
    (currentPage - 1) * STORIES_PER_PAGE,
    currentPage * STORIES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold"
              >
                StoryVerse
              </motion.h1>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="text-foreground/60 transition-colors hover:text-foreground">
                Accueil
              </Link>
              <Link href="/library" className="text-foreground">
                Bibliothèque
              </Link>
              <Link href="/authors" className="text-foreground/60 transition-colors hover:text-foreground">
                Auteurs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero + Search */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Bibliothèque
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-foreground/70">
              Explorez notre collection d'histoires captivantes
            </p>

            {/* Barre de recherche */}
            <div className="mx-auto max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une histoire, un auteur..."
                  className="w-full rounded-xl border bg-card py-4 pl-12 pr-12 text-lg shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-foreground/10"
                  >
                    <X className="h-4 w-4 text-foreground/60" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filtres */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Bouton filtres (mobile) + Tri */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  showFilters ? 'border-blue-500 bg-blue-500/5 text-blue-600' : 'hover:bg-foreground/5'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
                {selectedGenre && (
                  <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">1</span>
                )}
              </button>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border bg-background px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Résultats + Clear */}
            <div className="flex items-center gap-3">
              {!loading && (
                <span className="text-sm text-foreground/60">
                  {stories.length} histoire{stories.length !== 1 ? 's' : ''} trouvée{stories.length !== 1 ? 's' : ''}
                </span>
              )}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10"
                >
                  <X className="h-3.5 w-3.5" />
                  Effacer les filtres
                </button>
              )}
            </div>
          </div>

          {/* Panneau de filtres par genre */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 border-t pt-4"
            >
              <p className="mb-3 text-sm font-medium text-foreground/70">Filtrer par genre</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedGenre('')}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                    !selectedGenre
                      ? 'bg-foreground text-background'
                      : 'border hover:bg-foreground/5'
                  }`}
                >
                  Tous
                </button>
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre === selectedGenre ? '' : genre)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedGenre === genre
                        ? 'bg-foreground text-background'
                        : 'border hover:bg-foreground/5'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contenu */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Loading */}
          {loading && (
            <div className="py-20 text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-foreground/40" />
              <p className="mt-4 text-foreground/60">Chargement...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-20 text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchStories}
                className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-foreground/5"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && stories.length === 0 && (
            <div className="py-20 text-center">
              <BookOpen className="mx-auto h-16 w-16 text-foreground/20" />
              <h2 className="mt-4 text-2xl font-bold">Aucune histoire trouvée</h2>
              <p className="mt-2 text-foreground/60">
                {hasActiveFilters
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Soyez le premier à publier une histoire !'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-foreground/5"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          )}

          {/* Grille d'histoires */}
          {!loading && !error && stories.length > 0 && (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(0.05 * index, 0.5) }}
                  >
                    <StoryCard
                      id={story.id}
                      title={story.title}
                      author={story.author.name}
                      coverImage={story.coverImage}
                      accentColor={story.accentColor}
                      genre={story.genre}
                      readTime={story.readTime}
                      totalChapters={story.totalChapters}
                      description={story.description}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:opacity-40"
                  >
                    ← Précédent
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-foreground text-background'
                          : 'border hover:bg-foreground/5'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/5 disabled:opacity-40"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
