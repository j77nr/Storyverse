import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-foreground/70 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-8 text-4xl font-bold">Politique de Confidentialité</h1>
        <p className="mb-4 text-sm text-foreground/60">Dernière mise à jour : Mai 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">1. Données Collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Informations de compte :</strong> nom, email, photo de profil (via GitHub/Google)</li>
              <li><strong>Contenu :</strong> histoires, chapitres, candidatures que vous soumettez</li>
              <li><strong>Statistiques :</strong> vues, likes, bookmarks (anonymisés)</li>
              <li><strong>Données techniques :</strong> adresse IP (pour le rate limiting uniquement)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">2. Utilisation des Données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte et vos publications</li>
              <li>Envoyer des notifications par email (candidatures, publications)</li>
              <li>Générer des statistiques anonymisées</li>
              <li>Protéger la plateforme contre les abus</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">3. Partage des Données</h2>
            <p>Nous ne vendons jamais vos données personnelles. Vos données peuvent être partagées avec :</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Fournisseurs d'authentification :</strong> GitHub, Google (pour la connexion)</li>
              <li><strong>Service d'email :</strong> Resend (pour l'envoi d'emails)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">4. Stockage et Sécurité</h2>
            <p>Vos données sont stockées de manière sécurisée. Nous utilisons le chiffrement pour les communications et les mots de passe. Les sessions sont gérées via des tokens JWT sécurisés.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">5. Vos Droits</h2>
            <p>Conformément au RGPD, vous avez le droit de :</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données</li>
              <li>Supprimer votre compte et vos données</li>
              <li>Exporter vos données</li>
              <li>Retirer votre consentement</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">6. Cookies</h2>
            <p>Nous utilisons des cookies essentiels pour le fonctionnement du site (session d'authentification). Nous n'utilisons pas de cookies de tracking ou publicitaires.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">7. Contact</h2>
            <p>Pour exercer vos droits ou pour toute question : contact@storyverse.com</p>
          </section>
        </div>
      </main>
    </div>
  );
}
