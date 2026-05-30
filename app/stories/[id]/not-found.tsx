import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-foreground/10 p-6">
            <BookOpen className="h-16 w-16 text-foreground/60" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold">Histoire non trouvée</h1>
        <p className="mb-8 text-lg text-foreground/70">
          Désolé, cette histoire n'existe pas ou n'est pas encore publiée.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/library"
            className="rounded-lg border bg-background px-6 py-3 font-medium transition-all hover:bg-foreground/5"
          >
            Parcourir la bibliothèque
          </Link>
          <Link
            href="/"
            className="rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-all hover:bg-foreground/90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
