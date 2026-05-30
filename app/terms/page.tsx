import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
        <h1 className="mb-8 text-4xl font-bold">Conditions d'Utilisation</h1>
        <p className="mb-4 text-sm text-foreground/60">Dernière mise à jour : Mai 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-foreground/80">
          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">1. Acceptation des Conditions</h2>
            <p>En accédant et en utilisant StoryVerse, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">2. Description du Service</h2>
            <p>StoryVerse est une plateforme de publication et de lecture d'histoires interactives. Nous offrons aux auteurs la possibilité de publier leurs œuvres et aux lecteurs de les découvrir.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">3. Comptes Utilisateurs</h2>
            <p>Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités effectuées sous votre compte.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">4. Contenu Utilisateur</h2>
            <p>En publiant du contenu sur StoryVerse, vous conservez vos droits d'auteur mais nous accordez une licence non exclusive pour afficher et distribuer votre contenu sur la plateforme.</p>
            <p className="mt-2">Vous vous engagez à ne pas publier de contenu :</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Illégal ou incitant à la haine</li>
              <li>Portant atteinte aux droits d'autrui</li>
              <li>Contenant des informations personnelles de tiers</li>
              <li>Spam ou contenu promotionnel non autorisé</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">5. Propriété Intellectuelle</h2>
            <p>Le design, le code et les fonctionnalités de StoryVerse sont protégés par le droit d'auteur. Les histoires publiées restent la propriété de leurs auteurs respectifs.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">6. Modération</h2>
            <p>Nous nous réservons le droit de supprimer tout contenu qui viole ces conditions ou nos guidelines de contenu, sans préavis.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">7. Limitation de Responsabilité</h2>
            <p>StoryVerse est fourni "tel quel". Nous ne garantissons pas la disponibilité continue du service et ne sommes pas responsables des dommages résultant de son utilisation.</p>
          </section>

          <section>
            <h2 className="mb-3 text-2xl font-bold text-foreground">8. Contact</h2>
            <p>Pour toute question concernant ces conditions, contactez-nous à : contact@storyverse.com</p>
          </section>
        </div>
      </main>
    </div>
  );
}
