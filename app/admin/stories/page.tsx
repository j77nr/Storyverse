'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Eye,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  Shield,
  Trash2,
  Edit,
} from 'lucide-react';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  author: {
    name: string;
    email: string;
  };
  status: 'PUBLISHED' | 'PENDING' | 'DRAFT' | 'REJECTED';
  views: number;
  likes: number;
  chapters: number;
  moderationScore?: number;
  createdAt: string;
  updatedAt: string;
}

type FilterStatus = 'ALL' | 'PUBLISHED' | 'PENDING' | 'DRAFT' | 'REJECTED';

const STATUS_CONFIG = {
  PUBLISHED: { label: 'Publié', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  PENDING: { label: 'En Révision', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  DRAFT: { label: 'Brouillon', icon: Edit, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  REJECTED: { label: 'Rejeté', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default function AdminStoriesPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Vérifier l'accès admin
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/admin/stories');
    } else if (authStatus === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [authStatus, session, router]);

  // Charger les histoires
  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchStories();
    }
  }, [authStatus, session]);

  async function fetchStories() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stories');
      const data = await response.json();
      
      if (response.ok) {
        setStories(data.stories || []);
      } else {
        console.error('Erreur:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des histoires:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filtrer les histoires
  const filteredStories = stories.filter((story) => {
    const matchesFilter = filter === 'ALL' || story.status === filter;
    const matchesSearch = 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Actions sur les histoires
  async function handleApproveStory(storyId: string) {
    if (!confirm('Êtes-vous sûr de vouloir approuver cette histoire ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Histoire approuvée avec succès !');
        fetchStories(); // Recharger la liste
      } else {
        alert(data.error || 'Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'approbation');
    }
  }

  async function handleRejectStory(storyId: string) {
    const reason = prompt('Raison du rejet (minimum 10 caractères) :');
    
    if (!reason) {
      return; // Annulé
    }

    if (reason.trim().length < 10) {
      alert('La raison doit contenir au moins 10 caractères');
      return;
    }

    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'reject',
          rejectionReason: reason.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Histoire rejetée');
        fetchStories(); // Recharger la liste
      } else {
        alert(data.error || 'Erreur lors du rejet');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du rejet');
    }
  }

  async function handleDeleteStory(storyId: string, title: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?\n\nCette action est irréversible.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/stories/${storyId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Histoire supprimée avec succès');
        fetchStories(); // Recharger la liste
      } else {
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  }

  // Statistiques
  const stats = {
    total: stories.length,
    published: stories.filter(s => s.status === 'PUBLISHED').length,
    pending: stories.filter(s => s.status === 'PENDING').length,
    rejected: stories.filter(s => s.status === 'REJECTED').length,
  };

  if (authStatus === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <h1 className="text-2xl font-bold">StoryVerse</h1>
              </Link>
              <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1">
                <Shield className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold text-red-500">Admin</span>
              </div>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/admin/dashboard" className="text-foreground/60 hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/admin/applications" className="text-foreground/60 hover:text-foreground">
                Candidatures
              </Link>
              <Link href="/admin/stories" className="text-foreground">
                Histoires
              </Link>
              <Link href="/admin/users" className="text-foreground/60 hover:text-foreground">
                Utilisateurs
              </Link>
              <Link href="/" className="text-foreground/60 hover:text-foreground">
                Retour au site
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-extrabold">Gestion des Histoires</h1>
          <p className="text-foreground/60">
            Gérez toutes les histoires de la plateforme
          </p>
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border bg-card p-6"
          >
            <div className="mb-2 text-3xl font-extrabold">{stats.total}</div>
            <div className="text-sm text-foreground/60">Total</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6"
          >
            <div className="mb-2 text-3xl font-extrabold text-green-500">{stats.published}</div>
            <div className="text-sm text-foreground/60">Publiées</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6"
          >
            <div className="mb-2 text-3xl font-extrabold text-yellow-500">{stats.pending}</div>
            <div className="text-sm text-foreground/60">En Révision</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border bg-gradient-to-br from-red-500/10 to-rose-500/10 p-6"
          >
            <div className="mb-2 text-3xl font-extrabold text-red-500">{stats.rejected}</div>
            <div className="text-sm text-foreground/60">Rejetées</div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              placeholder="Rechercher une histoire ou un auteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-card pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['ALL', 'PUBLISHED', 'PENDING', 'REJECTED'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  rounded-lg px-4 py-2 text-sm font-medium transition-colors
                  ${filter === status 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card hover:bg-foreground/5'
                  }
                `}
              >
                {status === 'ALL' ? 'Toutes' : STATUS_CONFIG[status as keyof typeof STATUS_CONFIG].label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stories List */}
        <div className="space-y-4">
          {filteredStories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border bg-card p-12 text-center"
            >
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-foreground/20" />
              <h3 className="mb-2 text-2xl font-bold">Aucune Histoire</h3>
              <p className="text-foreground/60">
                {searchQuery 
                  ? 'Aucune histoire ne correspond à votre recherche'
                  : 'Aucune histoire dans cette catégorie'
                }
              </p>
            </motion.div>
          ) : (
            filteredStories.map((story, index) => {
              const statusConfig = STATUS_CONFIG[story.status];
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + 0.05 * index }}
                  className="rounded-xl border bg-card p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <h3 className="text-xl font-bold">{story.title}</h3>
                        <div className={`flex items-center gap-1 rounded-full ${statusConfig.bg} px-3 py-1 text-sm font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          {statusConfig.label}
                        </div>
                        {story.moderationScore !== undefined && (
                          <div className="rounded-full bg-foreground/10 px-3 py-1 text-sm font-medium">
                            Score: {story.moderationScore}/100
                          </div>
                        )}
                      </div>

                      <p className="mb-3 text-sm text-foreground/60">
                        Par <span className="font-semibold">{story.author.name}</span> ({story.author.email})
                      </p>

                      <div className="flex items-center gap-6 text-sm text-foreground/60">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {story.chapters} chapitres
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {story.views} vues
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {story.likes} likes
                        </span>
                        <span>
                          Créée le {new Date(story.createdAt).toLocaleDateString('fr-FR')}
                        </span>
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
                      {story.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApproveStory(story.id)}
                            className="rounded-lg border border-green-500/20 px-4 py-2 text-sm font-medium text-green-500 transition-colors hover:bg-green-500/10"
                            title="Approuver"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejectStory(story.id)}
                            className="rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                            title="Rejeter"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {story.status === 'REJECTED' && (
                        <button
                          onClick={() => handleApproveStory(story.id)}
                          className="rounded-lg border border-green-500/20 px-4 py-2 text-sm font-medium text-green-500 transition-colors hover:bg-green-500/10"
                          title="Approuver quand même"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteStory(story.id, story.title)}
                        className="rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
