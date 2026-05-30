'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  Eye,
  Heart,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  users: {
    total: number;
    authors: number;
    visitors: number;
    admins: number;
  };
  stories: {
    total: number;
    published: number;
    pending: number;
    rejected: number;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  engagement: {
    totalViews: number;
    totalLikes: number;
  };
  recentActivity?: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour calculer le temps écoulé
  function getTimeAgo(timestamp: string): string {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Il y a quelques secondes';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      return past.toLocaleDateString('fr-FR');
    }
  }

  // Vérifier l'accès admin
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/admin/dashboard');
    } else if (authStatus === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [authStatus, session, router]);

  // Charger les statistiques
  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchStats();
    }
  }, [authStatus, session]);

  async function fetchStats() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        console.error('Erreur:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (authStatus === 'loading' || loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const quickLinks = [
    {
      title: 'Candidatures',
      description: `${stats.applications.pending} en attente`,
      href: '/admin/applications',
      icon: FileText,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-500/10 to-orange-500/10',
    },
    {
      title: 'Histoires',
      description: `${stats.stories.pending} à modérer`,
      href: '/admin/stories',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      title: 'Utilisateurs',
      description: `${stats.users.total} utilisateurs`,
      href: '/admin/users',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
    },
  ];

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
              <Link href="/admin/dashboard" className="text-foreground">
                Dashboard
              </Link>
              <Link href="/admin/applications" className="text-foreground/60 hover:text-foreground">
                Candidatures
              </Link>
              <Link href="/admin/stories" className="text-foreground/60 hover:text-foreground">
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
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-extrabold">
            Bienvenue, {session?.user?.name} 👋
          </h1>
          <p className="text-foreground/60">
            Tableau de bord administrateur - Vue d'ensemble de StoryVerse
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Users Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="mb-1 text-3xl font-extrabold">{stats.users.total}</div>
            <div className="mb-3 text-sm text-foreground/60">Utilisateurs</div>
            <div className="flex gap-4 text-xs text-foreground/60">
              <span>{stats.users.authors} auteurs</span>
              <span>{stats.users.visitors} visiteurs</span>
            </div>
          </motion.div>

          {/* Stories Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="mb-1 text-3xl font-extrabold">{stats.stories.total}</div>
            <div className="mb-3 text-sm text-foreground/60">Histoires</div>
            <div className="flex gap-4 text-xs text-foreground/60">
              <span>{stats.stories.published} publiées</span>
              <span>{stats.stories.pending} en attente</span>
            </div>
          </motion.div>

          {/* Applications Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 p-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              {stats.applications.pending > 0 && (
                <Clock className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="mb-1 text-3xl font-extrabold">{stats.applications.pending}</div>
            <div className="mb-3 text-sm text-foreground/60">Candidatures en attente</div>
            <div className="flex gap-4 text-xs text-foreground/60">
              <span>{stats.applications.approved} approuvées</span>
              <span>{stats.applications.rejected} rejetées</span>
            </div>
          </motion.div>

          {/* Engagement Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-3">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="mb-1 text-3xl font-extrabold">
              {(stats.engagement.totalViews / 1000).toFixed(1)}k
            </div>
            <div className="mb-3 text-sm text-foreground/60">Vues totales</div>
            <div className="flex gap-4 text-xs text-foreground/60">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {(stats.engagement.totalLikes / 1000).toFixed(1)}k likes
              </span>
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-2xl font-bold">Accès Rapide</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map((link, index) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + 0.1 * index }}
                  className={`
                    group cursor-pointer rounded-xl border bg-gradient-to-br ${link.bgColor} p-6
                    transition-all hover:scale-105 hover:shadow-xl
                  `}
                >
                  <div className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${link.color} p-3`}>
                    <link.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{link.title}</h3>
                  <p className="text-sm text-foreground/60">{link.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-xl border bg-card p-6"
        >
          <h2 className="mb-4 text-2xl font-bold">Activité Récente</h2>
          <div className="space-y-4">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => {
                const getActivityIcon = () => {
                  switch (activity.type) {
                    case 'application_approved':
                      return <CheckCircle className="h-5 w-5 text-green-500" />;
                    case 'story_published':
                      return <BookOpen className="h-5 w-5 text-blue-500" />;
                    case 'user_registered':
                      return <Users className="h-5 w-5 text-purple-500" />;
                    default:
                      return <Clock className="h-5 w-5 text-gray-500" />;
                  }
                };

                const getActivityBg = () => {
                  switch (activity.type) {
                    case 'application_approved':
                      return 'bg-green-500/10';
                    case 'story_published':
                      return 'bg-blue-500/10';
                    case 'user_registered':
                      return 'bg-purple-500/10';
                    default:
                      return 'bg-foreground/5';
                  }
                };

                const timeAgo = getTimeAgo(activity.timestamp);

                return (
                  <div key={index} className={`flex items-center gap-4 rounded-lg ${getActivityBg()} p-4`}>
                    <div className="rounded-full bg-background p-2">
                      {getActivityIcon()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.message}</p>
                      <p className="text-sm text-foreground/60">{timeAgo}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center gap-4 rounded-lg bg-foreground/5 p-4">
                <div className="rounded-full bg-foreground/10 p-2">
                  <Clock className="h-5 w-5 text-foreground/60" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Aucune activité récente</p>
                  <p className="text-sm text-foreground/60">Les activités apparaîtront ici</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
