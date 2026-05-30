'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur application:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold">Une erreur est survenue</h1>
        <p className="mb-8 max-w-md text-lg text-foreground/60">
          Quelque chose s'est mal passé. Veuillez réessayer ou retourner à l'accueil.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-foreground px-6 py-3 font-medium text-background transition-all hover:bg-foreground/90"
          >
            <RotateCcw className="h-4 w-4" />
            Réessayer
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-all hover:bg-foreground/5"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
