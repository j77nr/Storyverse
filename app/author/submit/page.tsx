'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, Shield, Plus, Trash2, Image, Upload, Loader2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { moderateContent, CONTENT_WARNINGS, ModerationResult } from '@/data/contentPolicy';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Chapter {
  title: string;
  content: string;
}

export default function SubmitStoryPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'preview' | 'moderation' | 'success'>('form');
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    genre: [] as string[],
    description: '',
    coverImage: '',
    accentColor: 'bg-blue-500',
    contentWarnings: [] as string[],
    chapters: [{ title: '', content: '' }] as Chapter[],
  });

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/api/auth/signin?callbackUrl=/author/submit');
      return;
    }
    if (authStatus === 'authenticated' && session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
      return;
    }
    if (authStatus === 'authenticated' && session?.user?.role !== 'AUTHOR') {
      router.push('/become-author');
      return;
    }
  }, [authStatus, session, router]);

  const GENRES = [
    'Science-Fiction', 'Fantasy', 'Romance', 'Mystère', 'Thriller',
    'Horreur', 'Aventure', 'Drame', 'Comédie', 'Historique',
  ];

  const ACCENT_COLORS = [
    { name: 'Bleu', value: 'bg-blue-500' },
    { name: 'Violet', value: 'bg-purple-500' },
    { name: 'Vert', value: 'bg-green-500' },
    { name: 'Rouge', value: 'bg-red-500' },
    { name: 'Jaune', value: 'bg-yellow-500' },
    { name: 'Rose', value: 'bg-pink-500' },
  ];

  // Gestion des chapitres
  const addChapter = () => {
    setFormData({
      ...formData,
      chapters: [...formData.chapters, { title: '', content: '' }],
    });
  };

  const removeChapter = (index: number) => {
    if (formData.chapters.length <= 1) return;
    setFormData({
      ...formData,
      chapters: formData.chapters.filter((_, i) => i !== index),
    });
  };

  const updateChapter = (index: number, field: keyof Chapter, value: string) => {
    const updated = [...formData.chapters];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, chapters: updated });
  };

  // Upload de l'image de couverture
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image est trop volumineuse. Maximum 5 Mo.');
      return;
    }

    setUploadingCover(true);
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('cover', file);

      const res = await fetch('/api/upload/cover', {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, coverImage: data.url });
      } else {
        const data = await res.json();
        setError(data.error || 'Erreur lors de l\'upload');
      }
    } catch (err) {
      setError('Erreur de connexion lors de l\'upload');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/stories/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setModerationResult(data.moderationResult);
        setStep('moderation');
      } else {
        setError(data.error || 'Une erreur est survenue lors de la soumission');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    setStep('success');
  };

  // Validation
  const isValid = formData.title && formData.description && formData.genre.length > 0 &&
    formData.chapters.every(ch => ch.title && ch.content.length >= 500);

  if (authStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold">StoryVerse</h1>
            </Link>
            <Link href="/author/dashboard" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Retour au Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {step === 'form' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="mb-8 text-4xl font-extrabold">Soumettre une Nouvelle Histoire</h2>

            {error && (
              <div className="mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              </div>
            )}

            <div className="mb-8 rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-500">Modération Automatique</p>
                  <p className="text-foreground/70">
                    Votre histoire sera analysée automatiquement. Vous pouvez soumettre plusieurs chapitres à la fois.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations Générales */}
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="mb-6 text-2xl font-bold">Informations Générales</h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-semibold">Titre de l'Histoire *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-lg border bg-background px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Un titre accrocheur..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">Sous-titre</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full rounded-lg border bg-background px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Un sous-titre descriptif..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">Description / Synopsis *</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full rounded-lg border bg-background px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Décrivez votre histoire en quelques phrases..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">Genres * (max 3)</label>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                      {GENRES.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => {
                            if (formData.genre.includes(genre)) {
                              setFormData({ ...formData, genre: formData.genre.filter(g => g !== genre) });
                            } else if (formData.genre.length < 3) {
                              setFormData({ ...formData, genre: [...formData.genre, genre] });
                            }
                          }}
                          className={`rounded-lg border p-2 text-sm font-medium transition-all ${
                            formData.genre.includes(genre)
                              ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                              : 'hover:bg-foreground/5'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image de couverture */}
                  <div>
                    <label className="mb-2 block font-semibold">Image de Couverture</label>
                    <div className="flex items-start gap-4">
                      {formData.coverImage ? (
                        <div className="relative">
                          <img
                            src={formData.coverImage}
                            alt="Couverture"
                            className="h-40 w-28 rounded-lg object-cover border"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, coverImage: '' })}
                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-40 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-foreground/20 transition-colors hover:border-blue-500 hover:bg-blue-500/5">
                          {uploadingCover ? (
                            <Loader2 className="h-6 w-6 animate-spin text-foreground/40" />
                          ) : (
                            <>
                              <Image className="mb-2 h-6 w-6 text-foreground/40" />
                              <span className="text-xs text-foreground/60">Upload</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleCoverUpload}
                            disabled={uploadingCover}
                          />
                        </label>
                      )}
                      <div className="text-sm text-foreground/60">
                        <p>Format : JPG, PNG, WebP</p>
                        <p>Taille max : 5 Mo</p>
                        <p>Ratio recommandé : 2:3 (portrait)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">Couleur d'Accent</label>
                    <div className="flex gap-3">
                      {ACCENT_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, accentColor: color.value })}
                          className={`h-10 w-10 rounded-full ${color.value} transition-transform ${
                            formData.accentColor === color.value ? 'scale-125 ring-4 ring-foreground/20' : 'hover:scale-110'
                          }`}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">Avertissements de Contenu</label>
                    <div className="flex flex-wrap gap-2">
                      {CONTENT_WARNINGS.map((warning) => (
                        <button
                          key={warning}
                          type="button"
                          onClick={() => {
                            if (formData.contentWarnings.includes(warning)) {
                              setFormData({ ...formData, contentWarnings: formData.contentWarnings.filter(w => w !== warning) });
                            } else {
                              setFormData({ ...formData, contentWarnings: [...formData.contentWarnings, warning] });
                            }
                          }}
                          className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                            formData.contentWarnings.includes(warning)
                              ? 'border-yellow-500 bg-yellow-500/10 text-yellow-600 border'
                              : 'border hover:bg-foreground/5'
                          }`}
                        >
                          {warning}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapitres */}
              <div className="rounded-2xl border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Chapitres ({formData.chapters.length})</h3>
                  <button
                    type="button"
                    onClick={addChapter}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un chapitre
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.chapters.map((chapter, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border bg-background p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm font-medium text-foreground/60">
                            Chapitre {index + 1}
                          </span>
                        </div>
                        {formData.chapters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChapter(index)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          required
                          value={chapter.title}
                          onChange={(e) => updateChapter(index, 'title', e.target.value)}
                          className="w-full rounded-lg border bg-card px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder={`Titre du chapitre ${index + 1}...`}
                        />
                        <textarea
                          required
                          value={chapter.content}
                          onChange={(e) => updateChapter(index, 'content', e.target.value)}
                          rows={10}
                          className="w-full rounded-lg border bg-card px-4 py-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Écrivez le contenu du chapitre ici... (minimum 500 caractères)"
                        />
                        <div className="flex items-center justify-between text-xs text-foreground/50">
                          <span>{chapter.content.length} caractères</span>
                          <span className={chapter.content.length >= 500 ? 'text-green-500' : 'text-orange-500'}>
                            {chapter.content.length >= 500 ? '✓ Minimum atteint' : `${500 - chapter.content.length} caractères restants`}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bouton ajouter en bas */}
                <button
                  type="button"
                  onClick={addChapter}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-foreground/20 py-4 text-sm font-medium text-foreground/60 transition-colors hover:border-blue-500 hover:text-blue-500"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un autre chapitre
                </button>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Link href="/author/dashboard" className="flex-1">
                  <button
                    type="button"
                    className="w-full rounded-full border-2 border-foreground px-6 py-4 font-semibold transition-colors hover:bg-foreground hover:text-background"
                  >
                    Annuler
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={!isValid || loading}
                  className="flex-1 rounded-full bg-foreground px-6 py-4 font-semibold text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Soumission en cours...' : `Soumettre (${formData.chapters.length} chapitre${formData.chapters.length > 1 ? 's' : ''})`}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'moderation' && moderationResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h2 className="text-4xl font-extrabold">Résultat de la Modération</h2>

            <div className="rounded-2xl border bg-card p-8 text-center">
              <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10">
                <Shield className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="mb-2 text-3xl font-bold">Score: {moderationResult.score}/100</h3>
              <p className="text-foreground/70">
                {moderationResult.approved
                  ? 'Votre histoire respecte nos guidelines !'
                  : moderationResult.requiresManualReview
                  ? 'Votre histoire nécessite une révision manuelle'
                  : 'Votre histoire ne respecte pas nos guidelines'}
              </p>
            </div>

            {moderationResult.flags.length > 0 && (
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="mb-4 text-xl font-bold">Points d'Attention</h3>
                <ul className="space-y-2">
                  {moderationResult.flags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
                      <span className="text-foreground/80">{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep('form')}
                className="flex-1 rounded-full border-2 border-foreground px-6 py-4 font-semibold transition-colors hover:bg-foreground hover:text-background"
              >
                Modifier
              </button>
              {(moderationResult.approved || moderationResult.requiresManualReview) && (
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 rounded-full bg-foreground px-6 py-4 font-semibold text-background transition-colors hover:bg-foreground/90"
                >
                  {moderationResult.approved ? 'Publier' : 'Soumettre pour Révision'}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="mb-4 text-4xl font-extrabold">Histoire Soumise !</h2>
            <p className="mb-2 text-xl text-foreground/70">
              {moderationResult?.approved
                ? 'Votre histoire a été publiée avec succès !'
                : 'Votre histoire a été soumise pour révision manuelle.'}
            </p>
            <p className="mb-8 text-foreground/60">
              {formData.chapters.length} chapitre{formData.chapters.length > 1 ? 's' : ''} publié{formData.chapters.length > 1 ? 's' : ''}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/author/dashboard">
                <button className="rounded-full bg-foreground px-8 py-4 font-semibold text-background transition-colors hover:bg-foreground/90">
                  Retour au Dashboard
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
