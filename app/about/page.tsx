'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
              <Link href="/about" className="text-foreground">
                À Propos
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-6 text-5xl font-extrabold md:text-6xl">
              Réinventer l'Art de Raconter
            </h1>
            <p className="text-xl text-foreground/70">
              StoryVerse transforme la lecture en une expérience immersive et cinématique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-bold">Notre Mission</h2>
            <p className="text-lg leading-relaxed text-foreground/80">
              Nous croyons que chaque histoire mérite d'être racontée avec passion et créativité.
              StoryVerse offre aux auteurs une plateforme pour partager leurs récits avec une
              présentation visuelle époustouflante, et aux lecteurs une expérience de lecture
              qui transcende le format traditionnel.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border bg-card p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Lecture Immersive</h3>
              <p className="text-foreground/70">
                Chaque chapitre est présenté avec des animations fluides et une typographie
                soignée pour une expérience de lecture optimale.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl border bg-card p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Design Cinématique</h3>
              <p className="text-foreground/70">
                Des hero sections uniques pour chaque histoire, créant une première impression
                mémorable et captivante.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border bg-card p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Communauté d'Auteurs</h3>
              <p className="text-foreground/70">
                Rejoignez une communauté passionnée d'écrivains et de lecteurs qui partagent
                l'amour des belles histoires.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl border bg-card p-8"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Fait avec Passion</h3>
              <p className="text-foreground/70">
                Chaque détail de StoryVerse est conçu avec soin pour célébrer l'art du
                storytelling sous toutes ses formes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="mb-6 text-4xl font-bold">Prêt à Plonger ?</h2>
            <p className="mb-8 text-lg text-foreground/70">
              Explorez notre bibliothèque et découvrez votre prochaine histoire favorite.
            </p>
            <Link href="/library">
              <button className="rounded-full bg-foreground px-8 py-4 text-lg font-semibold text-background transition-colors hover:bg-foreground/90">
                Explorer la Bibliothèque
              </button>
            </Link>
          </motion.div>
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
