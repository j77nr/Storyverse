'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, BookOpen, Shield, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { AUTHOR_GUIDELINES } from '@/data/contentPolicy';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function BecomeAuthorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'form' | 'success'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    motivation: '',
    agreedToTerms: false,
    agreedToGuidelines: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier l'authentification
      if (!session?.user) {
        setError('Vous devez être connecté pour soumettre une candidature');
        setLoading(false);
        return;
      }

      // Validation côté client
      if (formData.bio.length < 50) {
        setError('La biographie doit contenir au moins 50 caractères');
        setLoading(false);
        return;
      }

      if (formData.motivation.length < 100) {
        setError('La motivation doit contenir au moins 100 caractères');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/author/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: formData.bio,
          motivation: formData.motivation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('success');
      } else {
        // Afficher les erreurs de validation détaillées si disponibles
        if (data.details && Array.isArray(data.details)) {
          const errorMessages = data.details.map((detail: any) => detail.message).join(', ');
          setError(errorMessages);
        } else {
          setError(data.error || 'Une erreur est survenue lors de la soumission');
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue lors de la soumission');
    } finally {
      setLoading(false);
    }
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
            <Link href="/" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      {step === 'info' && (
        <>
          {/* Hero Section */}
          <section className="border-b bg-gradient-to-b from-background to-muted/20 py-20">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <BookOpen className="h-4 w-4" />
                  Devenir Auteur
                </div>
                <h1 className="mb-6 text-5xl font-extrabold md:text-6xl">
                  Partagez Vos Histoires avec le Monde
                </h1>
                <p className="mb-8 text-xl text-foreground/70">
                  Rejoignez notre communauté d'auteurs passionnés et donnez vie à vos récits sur StoryVerse.
                </p>
                <button
                  onClick={() => setStep('form')}
                  className="rounded-full bg-foreground px-8 py-4 text-lg font-semibold text-background transition-colors hover:bg-foreground/90"
                >
                  Commencer Maintenant
                </button>
              </motion.div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 text-center text-4xl font-extrabold"
              >
                Pourquoi Devenir Auteur sur StoryVerse ?
              </motion.h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: BookOpen,
                    title: 'Plateforme Dédiée',
                    description: 'Une plateforme conçue spécifiquement pour le storytelling avec des outils puissants.',
                    color: 'text-blue-500',
                  },
                  {
                    icon: Users,
                    title: 'Audience Engagée',
                    description: 'Touchez des milliers de lecteurs passionnés à la recherche de nouvelles histoires.',
                    color: 'text-green-500',
                  },
                  {
                    icon: Shield,
                    title: 'Environnement Sûr',
                    description: 'Système de modération robuste garantissant un espace respectueux pour tous.',
                    color: 'text-purple-500',
                  },
                  {
                    icon: Award,
                    title: 'Reconnaissance',
                    description: 'Gagnez en visibilité et construisez votre réputation d\'auteur.',
                    color: 'text-yellow-500',
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="rounded-2xl border bg-card p-6"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-opacity-10 ${benefit.color}`}>
                      <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{benefit.title}</h3>
                    <p className="text-foreground/70">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Guidelines Section */}
          <section className="border-t bg-muted/20 py-20">
            <div className="mx-auto max-w-4xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-8 text-center text-4xl font-extrabold">
                  {AUTHOR_GUIDELINES.title}
                </h2>

                <div className="space-y-8">
                  {AUTHOR_GUIDELINES.sections.map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                      className="rounded-2xl border bg-card p-8"
                    >
                      <h3 className="mb-4 text-2xl font-bold">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                            <span className="text-foreground/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <button
                    onClick={() => setStep('form')}
                    className="rounded-full bg-foreground px-8 py-4 text-lg font-semibold text-background transition-colors hover:bg-foreground/90"
                  >
                    Je Comprends, Continuer
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      )}

      {step === 'form' && (
        <section className="py-20">
          <div className="mx-auto max-w-2xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-8 text-center text-4xl font-extrabold">
                Candidature Auteur
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  </div>
                )}

                {!session?.user && (
                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                      <p className="text-sm text-yellow-500">
                        Vous devez être connecté pour soumettre une candidature. 
                        <Link href="/api/auth/signin" className="ml-1 underline">
                          Se connecter
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="bio" className="mb-2 block font-semibold">
                    Biographie *
                  </label>
                  <textarea
                    id="bio"
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Parlez-nous de vous et de votre parcours d'écrivain..."
                  />
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className={formData.bio.length < 50 ? 'text-red-500' : 'text-green-500'}>
                      {formData.bio.length < 50 
                        ? `Minimum 50 caractères (${formData.bio.length}/50)` 
                        : `${formData.bio.length}/1000 caractères`}
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="motivation" className="mb-2 block font-semibold">
                    Pourquoi souhaitez-vous rejoindre StoryVerse ? *
                  </label>
                  <textarea
                    id="motivation"
                    required
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Expliquez votre motivation..."
                  />
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className={formData.motivation.length < 100 ? 'text-red-500' : 'text-green-500'}>
                      {formData.motivation.length < 100 
                        ? `Minimum 100 caractères (${formData.motivation.length}/100)` 
                        : `${formData.motivation.length}/2000 caractères`}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border bg-muted/20 p-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={formData.agreedToTerms}
                      onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm">
                      J'accepte les <Link href="/terms" className="text-primary hover:underline">conditions d'utilisation</Link> et la <Link href="/privacy" className="text-primary hover:underline">politique de confidentialité</Link> de StoryVerse.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="guidelines"
                      required
                      checked={formData.agreedToGuidelines}
                      onChange={(e) => setFormData({ ...formData, agreedToGuidelines: e.target.checked })}
                      className="mt-1"
                    />
                    <label htmlFor="guidelines" className="text-sm">
                      Je m'engage à respecter les guidelines de contenu et comprends que mes publications seront soumises à modération.
                    </label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('info')}
                    className="flex-1 rounded-full border-2 border-foreground px-6 py-3 font-semibold transition-colors hover:bg-foreground hover:text-background"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={
                      !formData.agreedToTerms || 
                      !formData.agreedToGuidelines || 
                      formData.bio.length < 50 ||
                      formData.motivation.length < 100 ||
                      loading || 
                      !session?.user
                    }
                    className="flex-1 rounded-full bg-foreground px-6 py-3 font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Envoi en cours...' : 'Soumettre ma Candidature'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {step === 'success' && (
        <section className="flex min-h-[80vh] items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-2xl px-6 text-center"
          >
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="mb-4 text-4xl font-extrabold">Candidature Envoyée !</h2>
            <p className="mb-8 text-xl text-foreground/70">
              Merci pour votre candidature, {formData.name} ! Notre équipe va examiner votre demande et vous contactera par email dans les 48 heures.
            </p>
            <div className="rounded-2xl border bg-card p-6 text-left">
              <h3 className="mb-4 font-semibold">Prochaines Étapes :</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Vérification de votre email (vous recevrez un lien de confirmation)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Examen de votre candidature par notre équipe</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Activation de votre compte auteur (sous 48h)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span>Accès à votre dashboard auteur et outils de publication</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link href="/">
                <button className="rounded-full bg-foreground px-8 py-4 font-semibold text-background transition-colors hover:bg-foreground/90">
                  Retour à l'Accueil
                </button>
              </Link>
            </div>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-foreground/60">
          <p>© 2024 StoryVerse. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
