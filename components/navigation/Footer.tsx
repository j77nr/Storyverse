import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-card/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold">StoryVerse</h3>
            <p className="text-sm text-foreground/70">
              Une plateforme de storytelling interactif qui transforme la lecture en expérience immersive.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link href="/" className="hover:text-foreground">Accueil</Link></li>
              <li><Link href="/library" className="hover:text-foreground">Bibliothèque</Link></li>
              <li><Link href="/authors" className="hover:text-foreground">Auteurs</Link></li>
              <li><Link href="/about" className="hover:text-foreground">À Propos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Pour les Auteurs</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link href="/become-author" className="hover:text-foreground">Devenir Auteur</Link></li>
              <li><Link href="/author/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/author/submit" className="hover:text-foreground">Soumettre une Histoire</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Légal</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li><Link href="/terms" className="hover:text-foreground">Conditions d'utilisation</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Politique de confidentialité</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} StoryVerse. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
