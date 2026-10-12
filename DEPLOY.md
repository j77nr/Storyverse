# 🚀 Déploiement StoryVerse sur Vercel

Guide complet pour déployer StoryVerse sur Vercel avec PostgreSQL, OAuth, et Vercel Blob Storage.

---

## 📋 Vue d'Ensemble

### Ce qui change par rapport à Railway :
- **Base de données** : SQLite → PostgreSQL (Neon recommandé, gratuit)
- **Uploads** : File system local → Vercel Blob Storage
- **Déploiement** : Railway → Vercel
- **URLs** : `*.up.railway.app` → `*.vercel.app`

---

## 🎯 Prérequis

1. Un compte [Vercel](https://vercel.com) (gratuit, illimité pour projets personnels)
2. Un compte [Neon](https://neon.tech) pour PostgreSQL (gratuit, 500 MB)
3. Un repo Git (GitHub, GitLab, Bitbucket)
4. Les credentials OAuth prêts (GitHub, Google)

---

## 📦 Étape 1 : Préparation du Code

### 1.1 Pousser sur GitHub

```bash
git add .
git commit -m "Prêt pour déploiement Vercel"
git push origin main
```

### 1.2 Vérifier les fichiers de configuration

Confirmez que ces fichiers sont présents et corrects :
- ✅ `vercel.json` (framework: nextjs, regions: cdg1)
- ✅ `prisma/schema.prisma` (provider: "postgresql")
- ✅ `.env.example` (avec DATABASE_URL PostgreSQL)
- ✅ `next.config.mjs` (avec Vercel Blob dans remotePatterns)
- ✅ `package.json` (avec postinstall et db:migrate scripts)

---

## 🗄️ Étape 2 : Configuration de la Base de Données PostgreSQL

### Option A : Neon (Recommandé - Gratuit)

1. **Créer un compte sur [Neon](https://neon.tech)**
2. **Créer un nouveau projet**
   - Nom : `storyverse`
   - Région : Europe (Frankfurt ou proche)
   - PostgreSQL version : 15 ou 16
3. **Copier la Connection String**
   - Format : `postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`
   - Gardez-la pour l'étape Vercel

### Option B : Vercel Postgres (Payant après essai)

1. Dans le dashboard Vercel (après avoir créé le projet)
2. Onglet "Storage" → "Create Database" → "Postgres"
3. Suivre les instructions
4. La variable `DATABASE_URL` sera automatiquement ajoutée

### Option C : Autres providers
- [Supabase](https://supabase.com) (gratuit, 500 MB)
- [Railway Postgres](https://railway.app) (5$/mois de crédits)
- [Amazon RDS](https://aws.amazon.com/rds/) (payant)

---

## 🚀 Étape 3 : Déploiement sur Vercel

### 3.1 Créer le projet Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Add New..." → "Project"
3. Importer votre repo GitHub
4. Vercel détecte automatiquement Next.js
5. **NE PAS déployer encore** - configurer les variables d'abord

### 3.2 Configurer les Variables d'Environnement

Dans "Settings" → "Environment Variables", ajouter :

#### Base de Données
```
DATABASE_URL=postgresql://user:password@host:5432/storyverse?sslmode=require
```
(Coller votre Connection String de Neon)

#### NextAuth
```
NEXTAUTH_URL=https://votre-app.vercel.app
NEXTAUTH_SECRET=<générer ci-dessous>
```

Pour générer `NEXTAUTH_SECRET` :
```bash
openssl rand -base64 32
```
Ou utiliser : https://generate-secret.vercel.app/32

#### GitHub OAuth
```
GITHUB_CLIENT_ID=votre-github-client-id
GITHUB_CLIENT_SECRET=votre-github-client-secret
```

#### Google OAuth (optionnel)
```
GOOGLE_CLIENT_ID=votre-google-client-id
GOOGLE_CLIENT_SECRET=votre-google-client-secret
```

#### Email (optionnel)
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=StoryVerse <noreply@storyverse.com>
```

#### Vercel Blob Storage (pour les uploads)
```
BLOB_READ_WRITE_TOKEN=<sera généré à l'étape 4>
```

### 3.3 Déployer

1. Cliquer sur "Deploy"
2. Attendre le build (2-5 minutes)
3. Une fois terminé, noter votre URL : `https://storyverse-xxx.vercel.app`

---

## 🔐 Étape 4 : Configuration OAuth

### 4.1 GitHub OAuth

1. Aller sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Ouvrir votre OAuth App existante (ou en créer une nouvelle)
3. **Mettre à jour :**
   - **Homepage URL** : `https://votre-app.vercel.app`
   - **Authorization callback URL** : `https://votre-app.vercel.app/api/auth/callback/github`
4. Sauvegarder

### 4.2 Google OAuth (si utilisé)

1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionner votre projet OAuth
3. "APIs & Services" → "Credentials"
4. Éditer votre OAuth 2.0 Client ID
5. **Ajouter dans "Authorized redirect URIs" :**
   - `https://votre-app.vercel.app/api/auth/callback/google`
6. Sauvegarder

### 4.3 Mettre à jour NEXTAUTH_URL

Dans Vercel :
1. "Settings" → "Environment Variables"
2. Éditer `NEXTAUTH_URL`
3. Remplacer par votre vraie URL : `https://storyverse-xxx.vercel.app`
4. "Save" → "Redeploy" (un bouton apparaîtra)

---

## 📁 Étape 5 : Configuration du Blob Storage (Uploads)

### 5.1 Activer Vercel Blob

1. Dans votre projet Vercel
2. Onglet "Storage" → "Create Database"
3. Choisir "Blob" (gratuit pour 500 MB)
4. Créer le store : nom `storyverse-uploads`

### 5.2 Obtenir le token

1. Une fois créé, aller dans "Settings" du Blob store
2. Copier le `BLOB_READ_WRITE_TOKEN`
3. L'ajouter dans les variables d'environnement Vercel

### 5.3 Migrer le code d'upload

**Fichier à modifier** : `app/api/stories/[id]/upload/route.ts` (ou similaire)

**Avant (file system local) :**
```ts
import fs from 'fs';
import path from 'path';

// Sauvegarder localement
const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
fs.writeFileSync(filePath, buffer);
```

**Après (Vercel Blob) :**
```ts
import { put } from '@vercel/blob';

// Installer d'abord : npm install @vercel/blob

// Sauvegarder sur Vercel Blob
const blob = await put(`uploads/${filename}`, buffer, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN,
});

// blob.url contient l'URL publique
```

### 5.4 Installer le package

```bash
npm install @vercel/blob
git add package.json package-lock.json
git commit -m "Add Vercel Blob for uploads"
git push
```

Vercel redéploiera automatiquement.

---

## 🗃️ Étape 6 : Migration de la Base de Données

### 6.1 Créer les migrations

**En local** (avec votre ancien SQLite ou une DB de dev) :

```bash
# Générer une migration initiale
npx prisma migrate dev --name init

# Cela crée un fichier dans prisma/migrations/
```

### 6.2 Pousser les migrations

```bash
git add prisma/migrations
git commit -m "Add initial migration"
git push
```

Vercel exécutera automatiquement `prisma migrate deploy` lors du build grâce au `vercel.json`.

### 6.3 Seed la base de données (optionnel)

Si vous avez un fichier `prisma/seed.ts` :

**En local :**
```bash
# Pointer temporairement vers la DB de production
DATABASE_URL="postgresql://..." npm run db:seed
```

**Ou via Vercel CLI :**
```bash
npm install -g vercel
vercel env pull .env.production
npm run db:seed
```

---

## ✅ Étape 7 : Vérifications Post-Déploiement

### 7.1 Tester l'application

1. Ouvrir `https://votre-app.vercel.app`
2. Vérifier que la page d'accueil charge
3. Tester la connexion OAuth (GitHub/Google)
4. Vérifier que le dashboard fonctionne
5. Tester la soumission d'une histoire
6. Tester l'upload d'image (si implémenté)

### 7.2 Vérifier les logs

En cas d'erreur :
1. Onglet "Deployments" dans Vercel
2. Cliquer sur le dernier déploiement
3. Voir les logs de build et runtime
4. Les erreurs courantes :
   - Variables d'environnement manquantes
   - Erreurs de migration Prisma
   - Timeouts (augmenter les limites dans Settings)

### 7.3 Tester le PWA

1. Ouvrir l'app en navigation privée
2. Ouvrir les DevTools → Application → Service Workers
3. Confirmer que `/sw.js` est enregistré
4. Tester "Add to Home Screen" sur mobile
5. Vérifier le mode offline (fermer le serveur et rafraîchir)

---

## 🐛 Troubleshooting

### Erreur : "Dynamic server usage"
**Solution** : C'est normal pendant le build. Le `|| true` dans `vercel.json` l'ignore si nécessaire. Vérifier que les pages utilisent bien `export const dynamic = 'force-dynamic'` si besoin.

### Erreur : "Cannot connect to database"
**Solutions** :
1. Vérifier que `DATABASE_URL` est correcte dans Vercel
2. Vérifier que `?sslmode=require` est présent
3. Tester la connexion avec `npx prisma db pull` localement
4. Vérifier que Neon n'est pas en pause (gratuit = pause après 5 min d'inactivité)

### Erreur : "OAuth redirect_uri mismatch"
**Solution** : Vérifier que les URLs callback dans GitHub/Google correspondent EXACTEMENT à l'URL Vercel (avec https://).

### Erreur : "Prisma Client not found"
**Solution** : Le script `postinstall` ne s'est pas exécuté. Aller dans Settings → General → Build Command et ajouter manuellement : `prisma generate && next build`

### Les uploads ne fonctionnent pas
**Solutions** :
1. Vérifier que `BLOB_READ_WRITE_TOKEN` est défini
2. Vérifier que `@vercel/blob` est installé
3. Vérifier que le code utilise `put()` et pas `fs.writeFileSync()`

### Le Service Worker ne se charge pas
**Solutions** :
1. Vérifier que `/public/sw.js` existe
2. Vérifier que les headers sont configurés dans `next.config.mjs`
3. Vérifier dans DevTools → Network que `/sw.js` retourne 200
4. Effacer le cache du navigateur et réessayer

---

## 📊 Monitoring et Performance

### Vercel Analytics (optionnel)

1. Onglet "Analytics" dans Vercel
2. Activer "Web Analytics" (gratuit)
3. Ajouter dans `app/layout.tsx` :

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

4. Installer : `npm install @vercel/analytics`

### Limites du Plan Gratuit

- **Builds** : Illimités
- **Bandwidth** : 100 GB/mois
- **Serverless executions** : 100 GB-heures/mois
- **Blob Storage** : 500 MB (gratuit avec Hobby)
- **PostgreSQL (Neon)** : 500 MB, 1 DB (gratuit)

---

## 🔄 Workflow de Développement

### En local
```bash
# Utiliser SQLite ou une DB de dev
DATABASE_URL="file:./dev.db" npm run dev
```

### Pour tester en production
```bash
# Brancher sur la DB de prod
vercel env pull .env.local
npm run dev
```

### Déployer
```bash
git push origin main
# Vercel déploie automatiquement
```

### Preview deployments
Chaque PR crée un déploiement preview automatique avec URL unique.

---

## 🆘 Support

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

### Communauté
- [Vercel Discord](https://vercel.com/discord)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)

---

## 📝 Checklist Finale

Avant de considérer le déploiement comme complet :

- [ ] L'app est accessible sur `https://votre-app.vercel.app`
- [ ] La connexion OAuth GitHub fonctionne
- [ ] La connexion OAuth Google fonctionne (si configuré)
- [ ] Le dashboard admin affiche les vraies données
- [ ] Les histoires peuvent être soumises
- [ ] Les images peuvent être uploadées (si implémenté)
- [ ] Le PWA est installable (voir icône dans la barre d'adresse)
- [ ] Le Service Worker est actif (vérifier dans DevTools)
- [ ] Le mode offline affiche un fallback (pas d'erreur blanche)
- [ ] Les emails sont envoyés (si Resend configuré)
- [ ] Le build de production passe sans erreur
- [ ] Lighthouse score > 90 (Performance, Accessibilité, PWA)
- [ ] Aucune erreur dans les logs Vercel
- [ ] Les variables d'environnement sont toutes configurées

---

**Migration réussie ! 🎉**

**Prochaines étapes :**
1. Configurer un nom de domaine personnalisé (optionnel)
2. Activer Vercel Analytics pour tracking
3. Configurer les alertes de monitoring
4. Mettre en place un workflow CI/CD avec tests

**Créé avec ❤️ pour StoryVerse**
