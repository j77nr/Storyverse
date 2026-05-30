'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  FileText,
  Loader2,
  Shield,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string;
  userId: string;
  bio: string;
  motivation: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
    status: string;
  };
}

export default function AdminApplicationsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  // Vérifier l'accès admin
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/admin/applications');
    } else if (authStatus === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/');
    }
  }, [authStatus, session, router]);

  // Charger les candidatures
  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchApplications();
    }
  }, [filter, authStatus, session]);

  async function fetchApplications() {
    try {
      setLoading(true);
      const url = filter === 'ALL' 
        ? '/api/admin/applications' 
        : `/api/admin/applications?status=${filter}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications);
      } else {
        console.error('Erreur:', data.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(applicationId: string, userId: string) {
    if (!confirm('Êtes-vous sûr de vouloir approuver cette candidature ?')) {
      return;
    }

    try {
      setProcessingId(applicationId);
      const response = await fetch('/api/admin/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          userId,
          reviewNote: reviewNotes[applicationId] || 'Candidature approuvée',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Recharger les candidatures
        await fetchApplications();
        // Réinitialiser la note
        setReviewNotes({ ...reviewNotes, [applicationId]: '' });
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(applicationId: string) {
    const note = reviewNotes[applicationId];
    if (!note || note.trim().length < 10) {
      alert('Veuillez ajouter une note de rejet (minimum 10 caractères)');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir rejeter cette candidature ?')) {
      return;
    }

    try {
      setProcessingId(applicationId);
      const response = await fetch('/api/admin/applications/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          reviewNote: note,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Recharger les candidatures
        await fetchApplications();
        // Réinitialiser la note
        setReviewNotes({ ...reviewNotes, [applicationId]: '' });
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue');
    } finally {
      setProcessingId(null);
    }
  }

  if (authStatus === 'loading' || (authStatus === 'authenticated' && session?.user?.role !== 'ADMIN')) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    approved: applications.filter(a => a.status === 'APPROVED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  };

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
              <Link href="/admin/applications" className="text-foreground">
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
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-4xl font-extrabold">Candidatures Auteur</h1>
          <p className="text-foreground/60">
            Gérez les demandes pour devenir auteur sur StoryVerse
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-2 text-3xl font-bold">{stats.total}</div>
            <div className="text-sm text-foreground/60">Total</div>
          </div>
          <div className="rounded-xl border bg-yellow-500/10 p-6">
            <div className="mb-2 text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-foreground/60">En Attente</div>
          </div>
          <div className="rounded-xl border bg-green-500/10 p-6">
            <div className="mb-2 text-3xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-foreground/60">Approuvées</div>
          </div>
          <div className="rounded-xl border bg-red-500/10 p-6">
            <div className="mb-2 text-3xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-foreground/60">Rejetées</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-2"
        >
          <Filter className="h-5 w-5 text-foreground/60" />
          <span className="text-sm font-semibold text-foreground/60">Filtrer:</span>
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                rounded-full px-4 py-2 text-sm font-medium transition-colors
                ${filter === status
                  ? 'bg-primary text-white'
                  : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
                }
              `}
            >
              {status === 'ALL' && 'Toutes'}
              {status === 'PENDING' && 'En Attente'}
              {status === 'APPROVED' && 'Approuvées'}
              {status === 'REJECTED' && 'Rejetées'}
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <div className="rounded-xl border bg-card p-12 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-foreground/20" />
            <h3 className="mb-2 text-xl font-bold">Aucune candidature</h3>
            <p className="text-foreground/60">
              {filter === 'ALL' 
                ? 'Aucune candidature pour le moment'
                : `Aucune candidature avec le statut "${filter}"`
              }
            </p>
          </div>
        )}

        {/* Applications List */}
        {!loading && applications.length > 0 && (
          <div className="space-y-6">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="rounded-xl border bg-card p-6"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <img
                      src={app.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.user.name}`}
                      alt={app.user.name}
                      className="h-16 w-16 rounded-full ring-2 ring-foreground/10"
                    />
                    <div>
                      <h3 className="mb-1 text-xl font-bold">{app.user.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <Mail className="h-4 w-4" />
                        {app.user.email}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-foreground/60">
                        <Calendar className="h-4 w-4" />
                        Soumis le {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`
                    flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold
                    ${app.status === 'PENDING' && 'bg-yellow-500/10 text-yellow-600'}
                    ${app.status === 'APPROVED' && 'bg-green-500/10 text-green-600'}
                    ${app.status === 'REJECTED' && 'bg-red-500/10 text-red-600'}
                  `}>
                    {app.status === 'PENDING' && <Clock className="h-4 w-4" />}
                    {app.status === 'APPROVED' && <CheckCircle className="h-4 w-4" />}
                    {app.status === 'REJECTED' && <XCircle className="h-4 w-4" />}
                    {app.status === 'PENDING' && 'En Attente'}
                    {app.status === 'APPROVED' && 'Approuvée'}
                    {app.status === 'REJECTED' && 'Rejetée'}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold">Biographie</h4>
                  <p className="rounded-lg bg-foreground/5 p-4 text-sm text-foreground/80">
                    {app.bio}
                  </p>
                </div>

                {/* Motivation */}
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold">Motivation</h4>
                  <p className="rounded-lg bg-foreground/5 p-4 text-sm text-foreground/80">
                    {app.motivation}
                  </p>
                </div>

                {/* Review Note (if reviewed) */}
                {app.reviewNote && (
                  <div className="mb-4">
                    <h4 className="mb-2 font-semibold">Note de Révision</h4>
                    <p className="rounded-lg bg-blue-500/10 p-4 text-sm text-blue-600">
                      {app.reviewNote}
                    </p>
                    {app.reviewedAt && (
                      <p className="mt-2 text-xs text-foreground/60">
                        Révisé le {new Date(app.reviewedAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions (only for PENDING) */}
                {app.status === 'PENDING' && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Note de révision {app.status === 'PENDING' && '(optionnelle pour approbation, requise pour rejet)'}
                      </label>
                      <textarea
                        value={reviewNotes[app.id] || ''}
                        onChange={(e) => setReviewNotes({ ...reviewNotes, [app.id]: e.target.value })}
                        placeholder="Ajoutez une note pour expliquer votre décision..."
                        rows={3}
                        className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(app.id, app.userId)}
                        disabled={processingId === app.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                      >
                        {processingId === app.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5" />
                            Approuver
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleReject(app.id)}
                        disabled={processingId === app.id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                      >
                        {processingId === app.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-5 w-5" />
                            Rejeter
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
