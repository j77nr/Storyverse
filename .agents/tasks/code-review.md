# Migration Vercel + PWA + Nettoyage

Migration de Railway vers Vercel avec ajout du support PWA (Progressive Web App) et suppression des fichiers de documentation obsolètes. Les changements couvrent la configuration du déploiement, la migration de SQLite vers PostgreSQL, l'ajout du manifeste PWA et du service worker, et la mise à jour de la configuration Next.js pour supporter ces nouvelles fonctionnalités.

**Watch for:** Les icônes PWA ne sont pas fournies (confirmed) — le manifeste référence 8 icônes PNG qui n'existent pas dans `/public/icons/`, ce qui causera des erreurs 404 et empêchera l'installation PWA. Le service worker tente de mettre en cache des routes qui peuvent ne pas exister (`/authors`).

**Verdict**: NEEDS_CHANGES

---

## High-level view

La migration du provider Prisma de `sqlite` vers `postgresql` change le schéma de base de données, ce qui nécessitera une migration et re-création de la base pour le déploiement Vercel. Le buildCommand dans vercel.json exécute `prisma migrate deploy` qui suppose que des migrations existent, mais si le projet utilisait SQLite avec `prisma db push`, il n'y aura pas de fichiers de migration.

Le manifeste PWA et le service worker sont syntaxiquement corrects et suivent les bonnes pratiques (stale-while-revalidate, exclusion des APIs, fallback offline). Cependant, les 8 icônes PNG déclarées dans le manifeste n'existent pas — seul un README d'instructions est présent dans `/public/icons/`. Sans ces icônes, le manifeste est invalide et l'installation PWA échouera.

La configuration Next.js ajoute correctement le wildcard `*.public.blob.vercel-storage.com` pour les images Blob Storage et les headers appropriés pour le service worker. Le script d'enregistrement du SW dans layout.tsx utilise la stratégie correcte (`afterInteractive`).

Les variables d'environnement dans .env.example couvrent les besoins Vercel (DATABASE_URL PostgreSQL, BLOB_READ_WRITE_TOKEN) et les scripts package.json incluent `postinstall` et `db:migrate` requis pour le déploiement automatique.

Les fichiers obsolètes (JOUR_*.md, PLAN_ACTION.md, railway.json, etc.) ont été correctement supprimés. Le DEPLOY.md a été complètement réécrit avec les instructions Vercel.

<details>
<summary>Issues (3)</summary>

1. **Icônes PWA manquantes** — Le manifeste référence 8 fichiers PNG dans `/public/icons/` qui n'existent pas. Générer les icônes selon les instructions du README ou retirer temporairement le manifeste du metadata.
2. **Migrations Prisma absentes** — Le buildCommand Vercel exécute `prisma migrate deploy` mais aucun dossier `prisma/migrations/` n'est visible dans le diff. Si le projet utilisait `db push` avec SQLite, créer une migration initiale avec `prisma migrate dev --name init` avant de déployer.
3. **Route service worker inexistante** — Le SW met en cache `/authors` qui peut ne pas exister dans l'application. Vérifier que cette route existe ou la retirer de `STATIC_ASSETS`.

</details>

<details>
<summary>Details</summary>

## Prisma schema migration et stratégie de déploiement

Le buildCommand dans vercel.json exécute `prisma migrate deploy`, qui applique les migrations existantes depuis `prisma/migrations/`. Si le projet utilisait précédemment `prisma db push` avec SQLite (développement rapide sans historique de migrations), ce dossier n'existe pas. Dans ce cas, `migrate deploy` échouera avec "No migration found".

```json
"buildCommand": "prisma generate && prisma migrate deploy && next build"
```

**likely**: Le projet n'a pas de fichiers de migration existants. Le diff ne montre pas de changements dans `prisma/migrations/`, et les projets qui démarrent avec SQLite utilisent généralement `db push` pour le développement rapide. Si c'est le cas, la première tentative de build Vercel échouera.

La solution avant le déploiement : créer une migration initiale avec `prisma migrate dev --name init` en développement local, puis commiter le dossier `prisma/migrations/`. Cela capture l'état actuel du schéma comme migration baseline pour PostgreSQL.

## Icônes PWA et installation

Le manifeste PWA dans `public/manifest.json` déclare 8 icônes requises pour une PWA complète :

```json
"icons": [
  { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
  { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png", "purpose": "any" },
  { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

**confirmed**: Le répertoire `public/icons/` existe mais ne contient que `README.md`. Les 8 fichiers PNG n'existent pas. Chaque tentative de chargement du manifeste générera 8 erreurs 404, et le navigateur marquera le manifeste comme invalide. L'invite "Ajouter à l'écran d'accueil" n'apparaîtra pas.

Le README fournit des instructions claires pour générer les icônes (RealFaviconGenerator, Figma, ou pwa-asset-generator). Les métadonnées dans `app/layout.tsx` référencent également deux icônes Apple absentes (152x152, 192x192), ce qui affectera l'expérience iOS.

## Service worker cache strategy et routes

Le service worker dans `public/sw.js` utilise une stratégie stale-while-revalidate pour les requêtes GET, avec exclusion des routes API et admin. La liste des assets statiques à mettre en cache inclut `/`, `/stories`, `/about`, `/authors`, et `/manifest.json`.

**possible**: La route `/authors` est mise en cache mais peut ne pas exister dans l'application. Si elle n'existe pas, la tentative de mise en cache lors de l'installation du SW échouera pour cet asset (404), mais ne bloquera pas l'installation du SW lui-même.

**possible**: Un seul 404 dans STATIC_ASSETS (par exemple `/authors`) empêchera la mise en cache de tous les autres assets via `cache.addAll()`. Utiliser `cache.add()` individuellement avec try-catch permettrait de continuer malgré les erreurs, mais le comportement actuel n'est pas bloquant.

## Next.js configuration PWA

L'ajout de `*.public.blob.vercel-storage.com` dans `remotePatterns` prépare le support du Vercel Blob Storage pour les uploads futurs. Les headers pour le service worker garantissent que le navigateur vérifie toujours la dernière version du SW (`max-age=0, must-revalidate`) et permettent au SW de contrôler tout le site (`Service-Worker-Allowed: /`).

## Vercel deployment configuration

Le buildCommand dans vercel.json exécute `prisma generate` deux fois : une fois explicitement, une fois via le script `postinstall` dans package.json qui s'exécute après `npm install`. La redondance ne cause pas d'erreur, juste du temps de build légèrement plus long. Le choix de la région `cdg1` (Paris) est approprié pour une application francophone.

## Environment variables et secrets

Le fichier `.env.example` a été mis à jour pour Vercel avec DATABASE_URL PostgreSQL et BLOB_READ_WRITE_TOKEN. Les commentaires rappellent de mettre à jour les callbacks OAuth dans GitHub et Google Console après changement de domaine (de Railway vers Vercel).

## Documentation et nettoyage

Le fichier `DEPLOY.md` a été complètement réécrit (466 lignes) avec un guide Vercel incluant configuration PostgreSQL (Neon, Vercel Postgres, alternatives), variables d'environnement, OAuth setup, et troubleshooting.

Les fichiers obsolètes ont été supprimés : journaux de développement (JOUR_*.md), checklists (TEST_CHECKLIST.md, RESPONSIVE_CHECKLIST.md), guides (GUIDE_TESTS.md, PLAN_ACTION.md), et la configuration Railway (railway.json). Le diff montre 5589 lignes supprimées.

</details>

---

<details>
<summary>File map</summary>

**Modified:**
- `.env.example` — Updated for Vercel: PostgreSQL DATABASE_URL, added BLOB_READ_WRITE_TOKEN
- `DEPLOY.md` — Completely rewritten with Vercel deployment guide (466 lines)
- `app/layout.tsx` — Added PWA metadata (manifest, themeColor, appleWebApp) and SW registration script
- `next.config.mjs` — Added Vercel Blob hostname, SW headers (Cache-Control, Service-Worker-Allowed)
- `package.json` — Added `postinstall` and `db:migrate` scripts for Vercel
- `prisma/schema.prisma` — Changed provider from "sqlite" to "postgresql"

**Added:**
- `.agents/tasks/plan.md` — Implementation plan document (agent-generated)
- `public/manifest.json` — PWA manifest with app metadata and icons list
- `public/sw.js` — Service worker with stale-while-revalidate caching strategy
- `public/icons/README.md` — Instructions for generating PWA icons
- `vercel.json` — Vercel build configuration with custom buildCommand

**Deleted:**
- `JOUR_1_COMPLETE.md`, `JOUR_2_COMPLETE.md`, `JOUR_3_COMPLETE.md`, `JOUR_4_COMPLETE.md`, `JOUR_5_COMPLETE.md` — Obsolete daily progress docs
- `PHASE_1_COMPLETE.md` — Obsolete phase completion doc
- `PLAN_ACTION.md` — Obsolete action plan
- `GUIDE_TESTS.md`, `TEST_CHECKLIST.md` — Obsolete test documentation
- `RESPONSIVE_CHECKLIST.md` — Obsolete responsive checklist
- `PROJET_CLEAN.md` — Obsolete cleanup notes
- `copy-image.ps1` — Obsolete PowerShell script
- `railway.json` — Removed Railway configuration

Full diff: `git diff HEAD~1 HEAD`

</details>
