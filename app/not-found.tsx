import Link from 'next/link';
import { BookOpen, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="mb-6 text-8xl font-extrabold text-foreground/10">404</div>
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-foreground/5 p-4">
            <BookOpen className="h-12 w-12 text-foreground/40" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold">Page non trouvée</h1>
        <p className="mb-8 max-w-md text-lg text-foreground/60">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-all hover:bg-foreground/90"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
          <Link
            href="/library"
            className="flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-all hover:bg-foreground/5"
          >
            <Search className="h-4 w-4" />
            Explorer la bibliothèque
          </Link>
        </div>
      </div>
    </div>
  );
}
