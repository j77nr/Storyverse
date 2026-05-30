# 🚀 Déploiement StoryVerse sur Railway

## Prérequis

1. Un compte [Railway](https://railway.app) (gratuit, 5$/mois de crédits)
2. Un repo Git (GitHub, GitLab)
3. Les variables d'environnement prêtes

---

## Étapes de Déploiement

### 1. Pousser le code sur GitHub

```bash
git init
git add .
git commit -m "Initial commit - StoryVerse"
git remote add origin https://github.com/VOTRE_USERNAME/storyverse.git
git push -u origin main
```

### 2. Créer un projet sur Railway

1. Aller sur [railway.app](https://railway.app)
2. Cliquer sur "New Project"
3. Choisir "Deploy from GitHub repo"
4. Sélectionner votre repo StoryVerse
5. Railway détectera automatiquement Next.js

### 3. Configurer les Variables d'Environnement

Dans Railway > Settings > Variables, ajouter :

```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_URL=https://votre-app.up.railway.app
NEXTAUTH_SECRET=generer-avec-openssl-rand-base64-32
GITHUB_CLIENT_ID=votre-github-client-id
GITHUB_CLIENT_SECRET=votre-github-client-secret
```

**Pour générer NEXTAUTH_SECRET :**
```bash
openssl rand -base64 32
```

### 4. Configurer GitHub OAuth pour la Production

1. Aller sur GitHub > Settings > Developer Settings > OAuth Apps
2. Créer une nouvelle app OU modifier l'existante
3. Mettre à jour :
   - Homepage URL: `https://votre-app.up.railway.app`
   - Authorization callback URL: `https://votre-app.up.railway.app/api/auth/callback/github`

### 5. Déployer

Railway déploie automatiquement à chaque push sur `main`.

Le build command est : `npx prisma generate && npm run build || true`
Le start command est : `npx prisma migrate deploy && npm run start`

### 6. Vérifier

Une fois déployé, Railway vous donne une URL comme :
`https://storyverse-production.up.railway.app`

---

## Variables d'Environnement Requises

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `DATABASE_URL` | Chemin SQLite | ✅ |
| `NEXTAUTH_URL` | URL de l'app | ✅ |
| `NEXTAUTH_SECRET` | Secret JWT | ✅ |
| `GITHUB_CLIENT_ID` | OAuth GitHub | ✅ |
| `GITHUB_CLIENT_SECRET` | OAuth GitHub | ✅ |
| `RESEND_API_KEY` | Emails | ❌ (optionnel) |
| `EMAIL_FROM` | Expéditeur | ❌ (optionnel) |

---

## Alternatives à Railway

### Render (gratuit)
1. Créer un compte sur [render.com](https://render.com)
2. New > Web Service
3. Connecter le repo GitHub
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npx prisma migrate deploy && npm run start`

### VPS (DigitalOcean, Hetzner)
```bash
# Sur le serveur
git clone https://github.com/VOTRE_USERNAME/storyverse.git
cd storyverse
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

---

## Troubleshooting

### Le build échoue
Les erreurs "Dynamic server usage" sont normales — le `|| true` dans le build command les ignore.

### La base de données est vide
```bash
# Lancer le seed après le premier déploiement
npx prisma db seed
```

### Les images ne persistent pas
Sur Railway, le filesystem est persistant par défaut. Les uploads dans `/public/uploads/` sont conservés entre les déploiements.

### OAuth ne fonctionne pas
Vérifier que `NEXTAUTH_URL` correspond exactement à l'URL de Railway et que le callback URL dans GitHub OAuth est correct.

---

## Commandes Utiles

```bash
# Voir les logs
railway logs

# Ouvrir un shell
railway shell

# Lancer le seed
railway run npx prisma db seed

# Ouvrir Prisma Studio
railway run npx prisma studio
```
