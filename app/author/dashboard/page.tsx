'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Edit, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Types
interface Story {
  id: string;
  title: string;
  subtitle?: string;
  status: 'PUBLISHED' | 'PENDING' | 'DRAFT' | 'REJECTED';
  views: number;
  chapters: number;
  updatedAt: string;
  moderationScore?: number;
  rejectionReason?: string;
}

const STATUS_CONFIG: Record<Story['status'], { label: string; icon: any; color: string }> = {
  PUBLISHED: { label: 'Publié', icon: CheckCircle, color: 'text-green-500' },
  PENDING: { label: 'En Révision', icon: Clock, color: 'text-yellow-500' },
  DRAFT: { label: 'Brouillon', icon: Edit, color: 'text-gray-500' },
  REJECTED: { label: 'Rejeté', icon: XCircle, color: 'text-red-500' },
};

export default function AuthorDashboard() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Rediriger si non authentifié
    if (authStatus === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/author/dashboard');
      return;
    }

    // ADMIN ne peut PAS accéder au dashboard auteur
    if (authStatus === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
      return;
    }

    // Vérifier le rôle AUTHOR
    if (authStatus === 'authenticated' && session?.user?.role !== 'AUTHOR') {
      router.push('/become-author');
      return;
    }

    // Charger les histoires
    async function fetchStories() {
      try {
        const response = await fetch('/api/stories/author');
        const data = await response.json();
        
        if (response.ok) {
          setStories(data.stories || []);
        } else {
          setError(data.error || 'Erreur lors du chargement des histoires');
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur lors du chargement des histoires');
      } finally {
        setLoading(false);
      }
    }

    if (authStatus === 'authenticated') {
      fetchStories();
    }
  }, [authStatus, session, router]);

  if (authStatus === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="text-foreground/70">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Calculer les statistiques
  const stats = {
    published: stories.filter(s => s.status === 'PUBLISHED').length,
    pending: stories.filter(s => s.status === 'PENDING').length,
    draft: stories.filter(s => s.status === 'DRAFT').length,
    totalViews: stories.reduce((sum, s) => sum + s.views, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold">StoryVerse</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/author/profile" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
                Mon Profil
              </Link>
              <Link href="/" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
                Voir le Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="mb-2 text-4xl font-extrabold">Dashboard Auteur</h2>
          <p className="text-lg text-foreground/70">
            Gérez vos histoires et suivez vos statistiques
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-4">
          {[
            { label: 'Histoires Publiées', value: stats.published.toString(), icon: BookOpen, color: 'text-blue-500' },
            { label: 'En Révision', value: stats.pending.toString(), icon: Clock, color: 'text-yellow-500' },
            { label: 'Brouillons', value: stats.draft.toString(), icon: Edit, color: 'text-gray-500' },
            { label: 'Vues Totales', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-green-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="rounded-2xl border bg-card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <h3 className="text-2xl font-bold">Mes Histoires</h3>
          <Link href="/author/submit">
            <button className="flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-semibold text-background transition-colors hover:bg-foreground/90">
              <Plus className="h-5 w-5" />
              Nouvelle Histoire
            </button>
          </Link>
        </motion.div>

        {/* Stories List */}
        <div className="space-y-4">
          {stories.map((story, index) => {
            const statusConfig = STATUS_CONFIG[story.status];
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + 0.1 * index }}
                className="rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h4 className="text-xl font-bold">{story.title}</h4>
                      <div className={`flex items-center gap-1 rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${statusConfig.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {statusConfig.label}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-foreground/60">
                      <span>{story.chapters} chapitres</span>
                      <span>{story.views} vues</span>
                      <span>Mis à jour le {new Date(story.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {story.status === 'PUBLISHED' && (
                      <Link href={`/stories/${story.id}`}>
                        <button className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/10">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                    )}
                    <Link href={`/author/stories/${story.id}/edit`}>
                      <button className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/10">
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>

                {story.status === 'PENDING' && (
                  <div className="mt-4 rounded-lg bg-yellow-500/10 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                      <div className="text-sm">
                        <p className="font-semibold text-yellow-500">En cours de révision</p>
                        <p className="text-foreground/70">
                          Votre histoire est en cours d'examen par notre équipe de modération. Vous recevrez une notification une fois la révision terminée (généralement sous 48h).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {story.status === 'REJECTED' && (
                  <div className="mt-4 rounded-lg bg-red-500/10 p-4">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                      <div className="text-sm">
                        <p className="font-semibold text-red-500">Histoire rejetée</p>
                        <p className="text-foreground/70">
                          {story.rejectionReason || 'Votre histoire ne respecte pas nos guidelines de contenu.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {stories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border bg-card p-12 text-center"
          >
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-foreground/20" />
            <h3 className="mb-2 text-2xl font-bold">Aucune Histoire</h3>
            <p className="mb-6 text-foreground/70">
              Commencez votre aventure d'auteur en créant votre première histoire !
            </p>
            <Link href="/author/submit">
              <button className="rounded-full bg-foreground px-8 py-4 font-semibold text-background transition-colors hover:bg-foreground/90">
                Créer ma Première Histoire
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
