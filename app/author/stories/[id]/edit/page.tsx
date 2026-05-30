'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Save,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
  readTime: string;
  mood?: string;
}

interface Story {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  genre: string[];
  accentColor: string;
  chapters: Chapter[];
}

export default function EditStoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // États pour l'édition
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState<string[]>([]);
  const [accentColor, setAccentColor] = useState('bg-blue-500');

  // État pour l'édition de chapitre
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterContent, setChapterContent] = useState('');

  // État pour l'ajout de chapitre
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterContent, setNewChapterContent] = useState('');
  const [chapterMood, setChapterMood] = useState('');

  // Charger l'histoire
  useEffect(() => {
    if (status === 'authenticated' && storyId) {
      loadStory();
    }
  }, [status, storyId]);

  async function loadStory() {
    try {
      setLoading(true);
      const res = await fetch(`/api/stories/${storyId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }

      setStory(data.story);
      setTitle(data.story.title);
      setSubtitle(data.story.subtitle || '');
      setDescription(data.story.description);
      setGenre(JSON.parse(data.story.genre));
      setAccentColor(data.story.accentColor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveStory() {
    try {
      setSaving(true);
      setError('');

      const res = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          description,
          genre,
          accentColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setSuccess('Histoire mise à jour avec succès!');
      setTimeout(() => setSuccess(''), 3000);
      loadStory();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveChapter() {
    if (!editingChapter) return;

    try {
      setSaving(true);
      setError('');

      const res = await fetch(
        `/api/stories/${storyId}/chapters/${editingChapter.number}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: chapterTitle,
            content: chapterContent,
            mood: chapterMood,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setSuccess('Chapitre mis à jour avec succès!');
      setTimeout(() => setSuccess(''), 3000);
      setEditingChapter(null);
      loadStory();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteChapter(chapterNumber: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce chapitre?')) return;

    try {
      setSaving(true);
      setError('');

      const res = await fetch(
        `/api/stories/${storyId}/chapters/${chapterNumber}`,
        {
          method: 'DELETE',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression');
      }

      setSuccess('Chapitre supprimé avec succès!');
      setTimeout(() => setSuccess(''), 3000);
      loadStory();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddChapter() {
    if (!newChapterTitle.trim() || newChapterContent.length < 100) {
      setError('Le titre est requis et le contenu doit faire au moins 100 caractères.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const res = await fetch(`/api/stories/${storyId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newChapterTitle.trim(),
          content: newChapterContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout');
      }

      setSuccess('Chapitre ajouté avec succès!');
      setTimeout(() => setSuccess(''), 3000);
      setShowAddChapter(false);
      setNewChapterTitle('');
      setNewChapterContent('');
      loadStory();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEditingChapter(chapter: Chapter) {
    setEditingChapter(chapter);
    setChapterTitle(chapter.title);
    setChapterContent(chapter.content);
    setChapterMood(chapter.mood || '');
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h1 className="text-2xl font-bold">Histoire non trouvée</h1>
          <Link href="/author/dashboard">
            <button className="mt-4 rounded-lg bg-primary px-6 py-2 text-white">
              Retour au Dashboard
            </button>
          </Link>
        </div>
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
              <Link href="/author/dashboard">
                <button className="flex items-center gap-2 text-foreground/60 hover:text-foreground">
                  <ArrowLeft className="h-5 w-5" />
                  Retour
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Éditer l'Histoire</h1>
                <p className="text-sm text-foreground/60">{story.title}</p>
              </div>
            </div>
            <button
              onClick={handleSaveStory}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              Sauvegarder
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-lg bg-red-500/10 border border-red-500 p-4 text-red-500">
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mx-auto max-w-7xl px-6 pt-6">
          <div className="rounded-lg bg-green-500/10 border border-green-500 p-4 text-green-500">
            {success}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Informations de l'histoire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl border bg-card p-6"
        >
          <h2 className="mb-6 text-xl font-bold">Informations de l'Histoire</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Titre</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2"
                placeholder="Titre de l'histoire"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Sous-titre (optionnel)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2"
                placeholder="Sous-titre"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full rounded-lg border bg-background px-4 py-2"
                placeholder="Description de l'histoire"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Genres (séparés par des virgules)
              </label>
              <input
                type="text"
                value={genre.join(', ')}
                onChange={(e) =>
                  setGenre(e.target.value.split(',').map((g) => g.trim()))
                }
                className="w-full rounded-lg border bg-background px-4 py-2"
                placeholder="Fantasy, Adventure, Romance"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Couleur d'accent
              </label>
              <select
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2"
              >
                <option value="bg-blue-500">Bleu</option>
                <option value="bg-purple-500">Violet</option>
                <option value="bg-green-500">Vert</option>
                <option value="bg-red-500">Rouge</option>
                <option value="bg-yellow-500">Jaune</option>
                <option value="bg-pink-500">Rose</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Liste des chapitres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Chapitres ({story.chapters.length})</h2>
            <button
              onClick={() => setShowAddChapter(true)}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              <Plus className="h-5 w-5" />
              Ajouter un Chapitre
            </button>
          </div>

          <div className="space-y-4">
            {story.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {chapter.number}
                    </span>
                    <div>
                      <h3 className="font-semibold">{chapter.title}</h3>
                      <p className="text-sm text-foreground/60">{chapter.readTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditingChapter(chapter)}
                    className="rounded-lg border p-2 hover:bg-muted"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(chapter.number)}
                    className="rounded-lg border border-red-500 p-2 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {story.chapters.length === 0 && (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-foreground/40" />
                <p className="text-foreground/60">Aucun chapitre pour le moment</p>
                <button
                  onClick={() => setShowAddChapter(true)}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                  Ajouter le Premier Chapitre
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Modal d'édition de chapitre */}
      {editingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl rounded-xl border bg-card p-6"
          >
            <h2 className="mb-6 text-2xl font-bold">
              Éditer le Chapitre {editingChapter.number}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Titre</label>
                <input
                  type="text"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Contenu</label>
                <textarea
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  rows={15}
                  className="w-full rounded-lg border bg-background px-4 py-2 font-mono text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Ambiance (optionnel)
                </label>
                <input
                  type="text"
                  value={chapterMood}
                  onChange={(e) => setChapterMood(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2"
                  placeholder="Ex: Mystérieux, Joyeux, Sombre..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setEditingChapter(null)}
                className="rounded-lg border px-6 py-2 hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveChapter}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Sauvegarder
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal d'ajout de chapitre */}
      {showAddChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border bg-card p-6"
          >
            <h3 className="mb-6 text-xl font-bold">Ajouter un Nouveau Chapitre</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Titre du Chapitre *</label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full rounded-lg border bg-background px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Titre du chapitre..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Contenu * (minimum 100 caractères)</label>
                <textarea
                  value={newChapterContent}
                  onChange={(e) => setNewChapterContent(e.target.value)}
                  rows={15}
                  className="w-full rounded-lg border bg-background px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Écrivez le contenu du chapitre..."
                />
                <div className="mt-1 flex justify-between text-xs text-foreground/50">
                  <span>{newChapterContent.length} caractères</span>
                  <span className={newChapterContent.length >= 100 ? 'text-green-500' : 'text-orange-500'}>
                    {newChapterContent.length >= 100 ? '✓ Minimum atteint' : `${100 - newChapterContent.length} restants`}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddChapter(false);
                  setNewChapterTitle('');
                  setNewChapterContent('');
                }}
                className="rounded-lg border px-6 py-2 hover:bg-muted"
              >
                Annuler
              </button>
              <button
                onClick={handleAddChapter}
                disabled={saving || !newChapterTitle.trim() || newChapterContent.length < 100}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                Ajouter le Chapitre
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
