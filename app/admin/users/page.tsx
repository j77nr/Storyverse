'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  PenTool,
  User,
  Loader2,
  Search,
  Mail,
  Calendar,
  BookOpen,
  Eye,
  Ban,
  CheckCircle,
  Crown,
} from 'lucide-react';
import Link from 'next/link';

interface UserData {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'VISITOR' | 'AUTHOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  createdAt: string;
  _count: {
    stories: number;
  };
  totalViews?: number;
}

type FilterRole = 'ALL' | 'VISITOR' | 'AUTHOR' | 'ADMIN';

const ROLE_CONFIG = {
  ADMIN: { label: 'Admin', icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
  AUTHOR: { label: 'Auteur', icon: PenTool, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  VISITOR: { label: 'Visiteur', icon: User, color: 'text-gray-500', bg: 'bg-gray-500/10' },
};

const STATUS_CONFIG = {
  ACTIVE: { label: 'Actif', color: 'text-green-500', bg: 'bg-green-500/10' },
  SUSPENDED: { label: 'Suspendu', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  BANNED: { label: 'Banni', color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default function AdminUsersPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterRole>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Vérifier l'accès admin
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/admin/users');
    } else if (authStatus === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [authStatus, session, router]);

  // Charger les utilisateurs
  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [authStatus, session]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users || []);
      } else {
        console.error('Erreur:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === 'ALL' || user.role === filter;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Actions sur les utilisateurs
  async function handleChangeRole(userId: string, userName: string, currentRole: string) {
    const roles = ['VISITOR', 'AUTHOR', 'ADMIN'];
    const roleLabels = { VISITOR: 'Visiteur', AUTHOR: 'Auteur', ADMIN: 'Admin' };
    
    const newRole = prompt(
      `Changer le rôle de ${userName}\n\nRôle actuel: ${roleLabels[currentRole as keyof typeof roleLabels]}\n\nNouveau rôle (VISITOR, AUTHOR, ADMIN):`,
      currentRole
    );

    if (!newRole || newRole === currentRole) {
      return; // Annulé ou pas de changement
    }

    if (!roles.includes(newRole.toUpperCase())) {
      alert('Rôle invalide. Utilisez: VISITOR, AUTHOR ou ADMIN');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'change_role',
          role: newRole.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Rôle changé en ${roleLabels[newRole.toUpperCase() as keyof typeof roleLabels]}`);
        fetchUsers(); // Recharger la liste
      } else {
        alert(data.error || 'Erreur lors du changement de rôle');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du changement de rôle');
    }
  }

  async function handleChangeStatus(userId: string, userName: string, currentStatus: string) {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const action = newStatus === 'SUSPENDED' ? 'suspendre' : 'réactiver';

    if (!confirm(`Êtes-vous sûr de vouloir ${action} ${userName} ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'change_status',
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Utilisateur ${action === 'suspendre' ? 'suspendu' : 'réactivé'} avec succès`);
        fetchUsers(); // Recharger la liste
      } else {
        alert(data.error || `Erreur lors de l'action`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur lors de l'action`);
    }
  }

  async function handleDeleteUser(userId: string, userName: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?\n\nCette action supprimera:\n- Le compte utilisateur\n- Toutes ses histoires\n- Tous ses chapitres\n- Sa candidature auteur\n\nCette action est IRRÉVERSIBLE.`)) {
      return;
    }

    // Double confirmation pour la suppression
    const confirmation = prompt(`Tapez "SUPPRIMER" pour confirmer la suppression de ${userName}:`);
    
    if (confirmation !== 'SUPPRIMER') {
      alert('Suppression annulée');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Utilisateur supprimé avec succès');
        fetchUsers(); // Recharger la liste
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
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    authors: users.filter(u => u.role === 'AUTHOR').length,
    visitors: users.filter(u => u.role === 'VISITOR').length,
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
              <Link href="/admin/stories" className="text-foreground/60 hover:text-foreground">
                Histoires
              </Link>
              <Link href="/admin/users" className="text-foreground">
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
          <h1 className="mb-2 text-4xl font-extrabold">Gestion des Utilisateurs</h1>
          <p className="text-foreground/60">
            Gérez tous les utilisateurs de la plateforme
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
            className="rounded-xl border bg-gradient-to-br from-red-500/10 to-rose-500/10 p-6"
          >
            <div className="mb-2 text-3xl font-extrabold text-red-500">{stats.admins}</div>
            <div className="text-sm text-foreground/60">Admins</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6"
          >
            <div className="mb-2 text-3xl font-extrabold text-purple-500">{stats.authors}</div>
            <div className="text-sm text-foreground/60">Auteurs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border bg-gradient-to-br from-gray-500/10 to-slate-500/10 p-6"
          >
            <div className="mb-2 text-3xl font-extrabold text-gray-500">{stats.visitors}</div>
            <div className="text-sm text-foreground/60">Visiteurs</div>
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
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border bg-card pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Role Filter */}
          <div className="flex gap-2">
            {(['ALL', 'ADMIN', 'AUTHOR', 'VISITOR'] as FilterRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`
                  rounded-lg px-4 py-2 text-sm font-medium transition-colors
                  ${filter === role 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card hover:bg-foreground/5'
                  }
                `}
              >
                {role === 'ALL' ? 'Tous' : ROLE_CONFIG[role as keyof typeof ROLE_CONFIG].label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border bg-card p-12 text-center"
            >
              <Users className="mx-auto mb-4 h-16 w-16 text-foreground/20" />
              <h3 className="mb-2 text-2xl font-bold">Aucun Utilisateur</h3>
              <p className="text-foreground/60">
                {searchQuery 
                  ? 'Aucun utilisateur ne correspond à votre recherche'
                  : 'Aucun utilisateur dans cette catégorie'
                }
              </p>
            </motion.div>
          ) : (
            filteredUsers.map((user, index) => {
              const roleConfig = ROLE_CONFIG[user.role];
              const statusConfig = STATUS_CONFIG[user.status];
              const RoleIcon = roleConfig.icon;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + 0.05 * index }}
                  className="rounded-xl border bg-card p-6 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <img
                        src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="h-16 w-16 rounded-full"
                      />

                      {/* Info */}
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-xl font-bold">{user.name}</h3>
                          <div className={`flex items-center gap-1 rounded-full ${roleConfig.bg} px-3 py-1 text-sm font-medium ${roleConfig.color}`}>
                            <RoleIcon className="h-4 w-4" />
                            {roleConfig.label}
                          </div>
                          <div className={`rounded-full ${statusConfig.bg} px-3 py-1 text-sm font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </div>
                        </div>

                        <div className="mb-3 flex items-center gap-2 text-sm text-foreground/60">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>

                        <div className="flex items-center gap-6 text-sm text-foreground/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          {user.role === 'AUTHOR' && (
                            <>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {user._count.stories} histoires
                              </span>
                              {user.totalViews !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  {user.totalViews} vues
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleChangeRole(user.id, user.name, user.role)}
                        className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/10"
                        title="Changer le rôle"
                      >
                        <Crown className="h-4 w-4" />
                      </button>
                      {user.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleChangeStatus(user.id, user.name, user.status)}
                          className="rounded-lg border border-yellow-500/20 px-4 py-2 text-sm font-medium text-yellow-500 transition-colors hover:bg-yellow-500/10"
                          title="Suspendre"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleChangeStatus(user.id, user.name, user.status)}
                          className="rounded-lg border border-green-500/20 px-4 py-2 text-sm font-medium text-green-500 transition-colors hover:bg-green-500/10"
                          title="Réactiver"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                        title="Supprimer"
                      >
                        <Ban className="h-4 w-4" />
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
