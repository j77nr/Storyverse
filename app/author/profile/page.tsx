'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Calendar, BookOpen, Eye, Heart, Bookmark, ArrowLeft, Save, Loader2, Camera, X, Shuffle } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  createdAt: string;
  stories: Array<{
    id: string;
    title: string;
    status: string;
    stats: { views: number; likes: number; bookmarks: number } | null;
  }>;
}

// Styles d'avatars DiceBear disponibles
const AVATAR_STYLES = [
  { id: 'avataaars', label: 'Avataaars' },
  { id: 'bottts', label: 'Robots' },
  { id: 'pixel-art', label: 'Pixel Art' },
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'notionists', label: 'Notionists' },
  { id: 'adventurer', label: 'Aventurier' },
  { id: 'big-ears', label: 'Big Ears' },
  { id: 'thumbs', label: 'Thumbs' },
];

export default function AuthorProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('avataaars');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditName(data.name || '');
        setEditImage(data.image || '');
        setAvatarSeed(data.name || data.id || 'user');
      } else {
        setError('Impossible de charger le profil');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      setError('Le nom ne peut pas être vide');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editName.trim(),
          image: editImage || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setMessage('Profil mis à jour avec succès !');
        setTimeout(() => setMessage(''), 3000);
        // Rafraîchir la session pour mettre à jour le header
        await updateSession();
      } else {
        const data = await res.json();
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setSaving(false);
    }
  };

  const generateAvatarUrl = (style: string, seed: string) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  };

  const handleSelectAvatar = (style: string, seed: string) => {
    const url = generateAvatarUrl(style, seed);
    setEditImage(url);
    setShowAvatarPicker(false);
  };

  const handleRandomSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(randomSeed);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille
    if (file.size > 2 * 1024 * 1024) {
      setError('Le fichier est trop volumineux. Maximum 2 Mo.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEditImage(data.image);
        setShowAvatarPicker(false);
        setMessage('Avatar uploadé avec succès !');
        setTimeout(() => setMessage(''), 3000);
        // Rafraîchir le profil et la session
        fetchProfile();
        await updateSession();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'upload");
      }
    } catch (err) {
      setError("Erreur de connexion lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const hasChanges = profile && (editName !== profile.name || editImage !== (profile.image || ''));

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Profil non trouvé</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-500 hover:underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Calculer les statistiques totales
  const totalViews = profile.stories.reduce((sum, s) => sum + (s.stats?.views || 0), 0);
  const totalLikes = profile.stories.reduce((sum, s) => sum + (s.stats?.likes || 0), 0);
  const totalBookmarks = profile.stories.reduce((sum, s) => sum + (s.stats?.bookmarks || 0), 0);
  const publishedCount = profile.stories.filter(s => s.status === 'PUBLISHED').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            Retour
          </button>
          <h1 className="text-xl font-bold">Mon Profil</h1>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Sauvegarder
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-green-600"
          >
            {message}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-600"
          >
            {error}
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border bg-card p-8"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar avec bouton de modification */}
            <div className="relative group">
              <img
                src={editImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.id}`}
                alt={profile.name}
                className="h-28 w-28 rounded-full border-4 border-foreground/10 object-cover"
              />
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
              <span className={`absolute -bottom-1 -right-1 rounded-full px-2 py-0.5 text-xs font-bold text-white ${
                profile.role === 'ADMIN' ? 'bg-red-500' :
                profile.role === 'AUTHOR' ? 'bg-purple-500' : 'bg-gray-500'
              }`}>
                {profile.role}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-foreground/70">
                  Nom d'affichage
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2.5 text-lg font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Votre nom"
                />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Membre depuis {new Date(profile.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-2xl font-bold">Statistiques</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border bg-card p-6 text-center">
              <BookOpen className="mx-auto mb-2 h-6 w-6 text-blue-500" />
              <div className="text-3xl font-bold">{publishedCount}</div>
              <div className="text-sm text-foreground/60">Histoires publiées</div>
            </div>
            <div className="rounded-xl border bg-card p-6 text-center">
              <Eye className="mx-auto mb-2 h-6 w-6 text-green-500" />
              <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
              <div className="text-sm text-foreground/60">Vues totales</div>
            </div>
            <div className="rounded-xl border bg-card p-6 text-center">
              <Heart className="mx-auto mb-2 h-6 w-6 text-red-500" />
              <div className="text-3xl font-bold">{totalLikes.toLocaleString()}</div>
              <div className="text-sm text-foreground/60">Likes totaux</div>
            </div>
            <div className="rounded-xl border bg-card p-6 text-center">
              <Bookmark className="mx-auto mb-2 h-6 w-6 text-purple-500" />
              <div className="text-3xl font-bold">{totalBookmarks.toLocaleString()}</div>
              <div className="text-sm text-foreground/60">Sauvegardes</div>
            </div>
          </div>
        </motion.div>

        {/* Mes Histoires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 text-2xl font-bold">Mes Histoires</h2>
          {profile.stories.length > 0 ? (
            <div className="space-y-3">
              {profile.stories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center justify-between rounded-xl border bg-card p-4 transition-all hover:shadow-md"
                >
                  <div>
                    <h3 className="font-semibold">{story.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-foreground/60">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        story.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-600' :
                        story.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-600' :
                        story.status === 'REJECTED' ? 'bg-red-500/10 text-red-600' :
                        'bg-gray-500/10 text-gray-600'
                      }`}>
                        {story.status === 'PUBLISHED' ? 'Publiée' :
                         story.status === 'PENDING' ? 'En attente' :
                         story.status === 'REJECTED' ? 'Rejetée' : 'Brouillon'}
                      </span>
                      {story.stats && (
                        <>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {story.stats.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" /> {story.stats.likes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/author/stories/${story.id}/edit`)}
                    className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-foreground/5"
                  >
                    Éditer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-8 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-foreground/40" />
              <p className="text-foreground/60">Vous n'avez pas encore d'histoires.</p>
              <button
                onClick={() => router.push('/author/submit')}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
              >
                Créer ma première histoire
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal Sélecteur d'Avatar */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">Choisir un Avatar</h3>
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="rounded-lg p-2 hover:bg-foreground/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Seed et Randomize */}
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-foreground/70">
                  Graine (modifie l'apparence)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={avatarSeed}
                    onChange={(e) => setAvatarSeed(e.target.value)}
                    className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Entrez un mot..."
                  />
                  <button
                    onClick={handleRandomSeed}
                    className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-foreground/5"
                  >
                    <Shuffle className="h-4 w-4" />
                    Aléatoire
                  </button>
                </div>
              </div>

              {/* Grille d'avatars */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-foreground/70">
                  Style d'avatar
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {AVATAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setSelectedStyle(style.id);
                        handleSelectAvatar(style.id, avatarSeed);
                      }}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all hover:shadow-md ${
                        selectedStyle === style.id ? 'border-blue-500 bg-blue-500/5' : 'hover:bg-foreground/5'
                      }`}
                    >
                      <img
                        src={generateAvatarUrl(style.id, avatarSeed)}
                        alt={style.label}
                        className="h-14 w-14 rounded-full"
                      />
                      <span className="text-xs font-medium text-foreground/70">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aperçu */}
              <div className="mb-6 flex items-center justify-center">
                <div className="text-center">
                  <p className="mb-2 text-sm text-foreground/60">Aperçu</p>
                  <img
                    src={generateAvatarUrl(selectedStyle, avatarSeed)}
                    alt="Aperçu"
                    className="mx-auto h-20 w-20 rounded-full border-4 border-foreground/10"
                  />
                </div>
              </div>

              {/* URL personnalisée */}
              <div className="mb-6 border-t pt-4">
                <label className="mb-2 block text-sm font-medium text-foreground/70">
                  Ou uploadez votre propre image
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-foreground/20 px-4 py-3 text-sm text-foreground/60 transition-colors hover:border-blue-500 hover:text-blue-500">
                      <Camera className="h-4 w-4" />
                      <span>Choisir une image (JPG, PNG, WebP, GIF — max 2 Mo)</span>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                {uploading && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-foreground/60">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Upload en cours...
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-foreground/5"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSelectAvatar(selectedStyle, avatarSeed)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700"
                >
                  Appliquer cet avatar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
