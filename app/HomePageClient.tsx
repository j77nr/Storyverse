'use client';

import { MinimalistHero } from '@/components/hero/MinimalistHero';
import { BookOpen, Github, Twitter, Instagram, Sparkles, Users, Heart, TrendingUp, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { StoryCard } from '@/components/story/StoryCard';
import { AuthorQuickNav } from '@/components/author/AuthorQuickNav';
import { AuthorStats } from '@/components/author/AuthorStats';
import { Session } from 'next-auth';

interface Story {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  coverImage: string;
  accentColor: string;
  genre: string[];
  readTime: string;
  totalChapters: number;
  description: string;
}

interface HomePageClientProps {
  session: Session | null;
  featuredStories: Story[];
}

export default function HomePageClient({ session, featuredStories }: HomePageClientProps) {
  // Vérifier le rôle de l'utilisateur
  const isAdmin = session?.user?.role === 'ADMIN';
  const isAuthor = session?.user?.role === 'AUTHOR';
  const isVisitor = !session || session?.user?.role === 'VISITOR';

  return (
    <>
      {/* Hero Section */}
      <MinimalistHero
        logoText="StoryVerse"
        navLinks={[
          { label: 'ACCUEIL', href: '/' },
          { label: 'BIBLIOTHÈQUE', href: '/library' },
          { label: 'AUTEURS', href: '/authors' },
          ...(isAdmin 
            ? [{ label: 'ADMINISTRATION', href: '/admin/dashboard' }]
            : isAuthor
              ? [{ label: 'DASHBOARD', href: '/author/dashboard' }]
              : [{ label: 'DEVENIR AUTEUR', href: '/become-author' }]
          ),
          { label: 'À PROPOS', href: '/about' },
        ]}
        mainText={
          isAdmin
            ? `Bienvenue ${session?.user?.name || 'Admin'} ! Gérez la plateforme StoryVerse depuis votre espace d'administration.`
            : isAuthor
              ? `Bienvenue ${session?.user?.name || 'Auteur'} ! Gérez vos histoires et créez de nouveaux récits captivants.`
              : "Plongez dans des univers narratifs où chaque mot prend vie. Des histoires immersives qui transcendent la lecture traditionnelle."
        }
        readMoreLink={isAdmin ? '/admin/dashboard' : isAuthor ? '/author/dashboard' : '/library'}
        imageSrc="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=90"
        imageAlt="Bibliothèque majestueuse"
        overlayText={{
          part1: 'STORY',
          part2: 'VERSE',
        }}
        socialLinks={[
          { icon: Twitter, href: 'https://twitter.com' },
          { icon: Instagram, href: 'https://instagram.com' },
          { icon: Github, href: 'https://github.com' },
        ]}
        locationText="Paris, France"
      />

      {/* Admin Quick Navigation - Only for Admins */}
      {isAdmin && (
        <section className="border-t py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl blur-3xl" />
              <div className="relative rounded-3xl border border-foreground/10 bg-card/50 backdrop-blur-xl p-8">
                <div className="mb-8 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 px-4 py-2"
                  >
                    <Shield className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-semibold text-red-500">Administration</span>
                  </motion.div>
                  <h2 className="text-3xl font-extrabold">Accès Rapide</h2>
                  <p className="mt-2 text-foreground/60">Gérez la plateforme StoryVerse</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { href: '/admin/dashboard', icon: Shield, label: 'Dashboard', description: 'Vue d\'ensemble', color: 'from-red-500 to-rose-500' },
                    { href: '/admin/applications', icon: Users, label: 'Candidatures', description: 'Gérer les candidatures', color: 'from-orange-500 to-red-500' },
                    { href: '/admin/stories', icon: BookOpen, label: 'Histoires', description: 'Modérer les histoires', color: 'from-blue-500 to-cyan-500' },
                    { href: '/admin/users', icon: Users, label: 'Utilisateurs', description: 'Gérer les utilisateurs', color: 'from-green-500 to-emerald-500' },
                  ].map((button, index) => (
                    <motion.div
                      key={button.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Link href={button.href}>
                        <div className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                          <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${button.color} p-3 shadow-lg`}>
                            <button.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="mb-1 text-lg font-bold">{button.label}</h3>
                          <p className="text-sm text-foreground/60">{button.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Author Quick Navigation - Only for Authors */}
      {isAuthor && (
        <section className="border-t py-20">
          <div className="mx-auto max-w-7xl px-6">
            <AuthorQuickNav />
          </div>
        </section>
      )}

      {/* Author Stats - Only for Authors */}
      {isAuthor && (
        <section className="border-t bg-muted/20 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="mb-2 text-3xl font-extrabold">Vos Statistiques</h2>
              <p className="text-foreground/60">Suivez les performances de vos histoires</p>
            </motion.div>
            <AuthorStats />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="border-t bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Une Nouvelle Façon de Raconter
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-foreground/70">
              StoryVerse réinvente l'expérience de lecture avec des fonctionnalités pensées pour les lecteurs modernes.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BookOpen,
                title: 'Lecture Immersive',
                description: 'Des animations fluides et une typographie soignée pour une expérience de lecture optimale.',
                color: 'text-blue-500',
              },
              {
                icon: Sparkles,
                title: 'Design Cinématique',
                description: 'Chaque histoire a son propre univers visuel avec des couleurs et animations uniques.',
                color: 'text-purple-500',
              },
              {
                icon: Users,
                title: 'Communauté',
                description: 'Rejoignez une communauté passionnée d\'auteurs et de lecteurs du monde entier.',
                color: 'text-green-500',
              },
              {
                icon: Heart,
                title: 'Fait avec Passion',
                description: 'Chaque détail est conçu avec soin pour célébrer l\'art du storytelling.',
                color: 'text-red-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10 ${feature.color}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex items-center justify-between"
          >
            <div>
              <h2 className="mb-2 text-4xl font-extrabold">Histoires en Vedette</h2>
              <p className="text-lg text-foreground/70">
                Découvrez nos histoires les plus captivantes
              </p>
            </div>
            <Link href="/library">
              <button className="hidden rounded-full border-2 border-foreground px-6 py-3 font-semibold transition-colors hover:bg-foreground hover:text-background md:block">
                Voir Tout
              </button>
            </Link>
          </motion.div>

          {featuredStories.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
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
          ) : (
            <div className="rounded-xl border bg-card p-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-foreground/40" />
              <h3 className="mb-2 text-xl font-bold">Aucune histoire en vedette</h3>
              <p className="text-foreground/60">
                Les histoires en vedette apparaîtront ici bientôt.
              </p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 text-center md:hidden"
          >
            <Link href="/library">
              <button className="rounded-full border-2 border-foreground px-8 py-4 font-semibold transition-colors hover:bg-foreground hover:text-background">
                Voir Toutes les Histoires
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { number: '1000+', label: 'Lecteurs Actifs', icon: Users },
              { number: '50+', label: 'Histoires Publiées', icon: BookOpen },
              { number: '10K+', label: 'Chapitres Lus', icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="text-center"
              >
                <stat.icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                <div className="mb-2 text-5xl font-extrabold">{stat.number}</div>
                <div className="text-lg text-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Author CTA Section - Only for Visitors */}
      {isVisitor && (
        <section className="border-t bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border bg-card p-12 text-center shadow-lg"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">
                Vous Êtes Auteur ?
              </h2>
              <p className="mb-8 text-xl text-foreground/70">
                Partagez vos histoires avec une communauté passionnée. Rejoignez StoryVerse et donnez vie à vos récits.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/become-author">
                  <button className="w-full rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-primary/90 sm:w-auto">
                    Devenir Auteur
                  </button>
                </Link>
                <Link href="/authors">
                  <button className="w-full rounded-full border-2 border-foreground px-8 py-4 text-lg font-semibold transition-colors hover:bg-foreground hover:text-background sm:w-auto">
                    Découvrir Nos Auteurs
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Reader CTA Section */}
      <section className="border-t py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-extrabold md:text-5xl">
              Prêt à Commencer Votre Aventure ?
            </h2>
            <p className="mb-8 text-xl text-foreground/70">
              Rejoignez des milliers de lecteurs et découvrez des histoires qui vous transporteront dans des mondes extraordinaires.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/library">
                <button className="w-full rounded-full bg-foreground px-8 py-4 text-lg font-semibold text-background transition-colors hover:bg-foreground/90 sm:w-auto">
                  Explorer la Bibliothèque
                </button>
              </Link>
              <Link href="/about">
                <button className="w-full rounded-full border-2 border-foreground px-8 py-4 text-lg font-semibold transition-colors hover:bg-foreground hover:text-background sm:w-auto">
                  En Savoir Plus
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
