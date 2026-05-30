'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Pen, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  storiesCount: number;
  stories: {
    id: string;
    title: string;
  }[];
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuthors() {
      try {
        const response = await fetch('/api/authors');
        const data = await response.json();
        
        if (response.ok) {
          setAuthors(data.authors);
        } else {
          setError(data.error || 'Erreur lors du chargement des auteurs');
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement des auteurs');
      } finally {
        setLoading(false);
      }
    }

    fetchAuthors();
  }, []);

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
              <Link href="/library" className="text-foreground/60 transition-colors hover:text-foreground">
                Bibliothèque
              </Link>
              <Link href="/authors" className="text-foreground">
                Auteurs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Pen className="h-4 w-4" />
              Auteurs
            </div>
            <h1 className="mb-4 text-5xl font-extrabold md:text-6xl">
              Rencontrez les Créateurs
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              Découvrez les auteurs talentueux qui donnent vie aux histoires de StoryVerse.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Loading State */}
          {loading && (
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-foreground/60">Chargement des auteurs...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && authors.length === 0 && (
            <div className="text-center">
              <Pen className="mx-auto h-16 w-16 text-foreground/20" />
              <h2 className="mt-4 text-2xl font-bold">Aucun auteur pour le moment</h2>
              <p className="mt-2 text-foreground/60">
                Soyez le premier à rejoindre notre communauté d'auteurs !
              </p>
              <Link href="/become-author" className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 font-semibold text-background transition-colors hover:bg-foreground/90">
                Devenir Auteur
              </Link>
            </div>
          )}

          {/* Authors List */}
          {!loading && !error && authors.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {authors.map((author, index) => (
                <motion.div
                  key={author.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group rounded-2xl border bg-card p-8 transition-all hover:shadow-xl"
                >
                  <div className="mb-6 flex items-start gap-4">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="h-20 w-20 rounded-full ring-4 ring-foreground/5 transition-transform group-hover:scale-105"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1 text-2xl font-bold">{author.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-foreground/60">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{author.storiesCount} histoire{author.storiesCount > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mb-6 text-foreground/70">{author.bio}</p>

                  {author.stories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground/60">Histoires :</p>
                      {author.stories.map((story) => (
                        <Link key={story.id} href={`/stories/${story.id}`}>
                          <div className="rounded-lg bg-foreground/5 px-3 py-2 text-sm transition-colors hover:bg-foreground/10">
                            {story.title}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-foreground/60">
          <p>© 2024 StoryVerse. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
