# 📚 StoryVerse - Plateforme de Storytelling Interactif

Une plateforme complète de storytelling avec système d'auteurs, modération automatique et dashboard administrateur.

![StoryVerse](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80)

---

## 🎯 Statut du Projet

**Version:** 0.7 (70% complet)  
**Statut:** ⚠️ En développement - Corrections critiques nécessaires

### ✅ Fonctionnel
- Authentification complète (NextAuth + OAuth)
- Dashboard admin avec statistiques réelles
- Système auteur avec modération automatique
- Soumission d'histoires avec chapitres
- Pages publiques (home, library, stories)

### ⚠️ En Cours
- Intégration complète base de données
- Système d'emails
- Édition d'histoires
- Tracking des statistiques

---

## 📚 DOCUMENTATION

### 🔴 Commencer Ici
1. **[START_HERE.md](./START_HERE.md)** - Guide de démarrage rapide
2. **[TODO.md](./TODO.md)** - Liste des tâches à faire
3. **[ETAT_ACTUEL.md](./ETAT_ACTUEL.md)** - État actuel du projet

### 📊 Analyse Complète
4. **[ANALYSE_COMPLETE.md](./ANALYSE_COMPLETE.md)** - Analyse approfondie (5000+ mots)
5. **[PLAN_ACTION.md](./PLAN_ACTION.md)** - Plan d'action détaillé (4000+ mots)
6. **[RESUME_ANALYSE.md](./RESUME_ANALYSE.md)** - Résumé de l'analyse

### 🔧 Technique
7. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture du système
8. **[DASHBOARD_FIX.md](./DASHBOARD_FIX.md)** - Fix du problème de stats
9. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guide de contribution

---

## ✨ Fonctionnalités

### 🔐 Authentification & Autorisation
- NextAuth.js avec Google & GitHub OAuth
- Gestion des rôles: VISITOR, AUTHOR, MODERATOR, ADMIN
- Protection des routes par middleware
- Sessions JWT avec refresh automatique

### 👥 Système Utilisateur
- **Visiteurs:** Parcourir et lire les histoires
- **Auteurs:** Soumettre et gérer leurs histoires
- **Admins:** Modérer le contenu et gérer les utilisateurs

### 📝 Système Auteur
- Candidature avec bio et motivation
- Dashboard avec statistiques
- Soumission d'histoires avec chapitres multiples
- Modération automatique avec scoring
- Statuts: DRAFT, PENDING, PUBLISHED, REJECTED

### 🛡️ Modération Automatique
- Scoring 0-100 basé sur le contenu
- 10 catégories de contenu interdit
- Détection de keywords interdits
- Content warnings (violence, langage, etc.)
- Seuils: <70 auto-approve, 70-89 review, >90 reject

### 👨‍💼 Dashboard Admin
- Statistiques en temps réel (users, stories, applications)
- Gestion des utilisateurs (rôles, suspension, suppression)
- Modération des histoires (approuver, rejeter, supprimer)
- Gestion des candidatures auteur
- Interface moderne et responsive

### 📖 Expérience de Lecture
- Mode lecture optimisé avec contrôles
- Thèmes dynamiques par histoire
- Navigation fluide entre chapitres
- Profils d'auteurs détaillés
- Temps de lecture estimé

---

## 🚀 Démarrage Rapide

### 1. Installation
```bash
npm install
```

### 2. Configuration
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos credentials
```

### 3. Base de données
```bash
npx prisma generate
npx prisma db push
```

### 4. Lancer le serveur
```bash
npm run dev
```

### 5. Ouvrir le navigateur
👉 [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Stack Technique

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Inter & Playfair Display

### Backend
- **API:** Next.js API Routes
- **Database:** Prisma ORM + SQLite (dev)
- **Auth:** NextAuth.js
- **Validation:** Zod
- **Email:** Resend (à configurer)

---

## 📁 Structure du Projet

```
storyverse/
├── app/                              # Pages Next.js (App Router)
│   ├── page.tsx                     # Page d'accueil
│   ├── library/                     # Bibliothèque d'histoires
│   ├── stories/[id]/               # Pages dynamiques des histoires
│   │   ├── page.tsx                # Détails de l'histoire
│   │   └── chapter/[number]/       # Lecteur de chapitres
│   ├── author/                      # Pages auteur
│   │   ├── dashboard/              # Dashboard auteur
│   │   └── submit/                 # Soumission d'histoire
│   ├── admin/                       # Pages admin
│   │   ├── dashboard/              # Dashboard admin
│   │   ├── applications/           # Gestion candidatures
│   │   ├── stories/                # Modération histoires
│   │   └── users/                  # Gestion utilisateurs
│   ├── api/                         # API Routes
│   │   ├── auth/                   # NextAuth
│   │   ├── stories/                # API histoires
│   │   ├── author/                 # API auteur
│   │   └── admin/                  # API admin
│   ├── authors/                     # Page des auteurs
│   ├── about/                       # Page à propos
│   ├── become-author/              # Candidature auteur
│   ├── layout.tsx                   # Layout racine
│   └── globals.css                  # Styles globaux
├── components/                       # Composants réutilisables
│   ├── hero/                        # Composants Hero
│   ├── story/                       # Composants d'histoire
│   ├── author/                      # Composants auteur
│   ├── navigation/                  # Header
│   └── providers/                   # SessionProvider
├── lib/                             # Utilitaires
│   ├── auth.ts                     # Configuration NextAuth
│   ├── prisma.ts                   # Client Prisma
│   ├── moderation.ts               # Système de modération
│   └── utils.ts                    # Utilitaires
├── prisma/                          # Base de données
│   └── schema.prisma               # Schéma Prisma
├── data/                            # Données mock (à remplacer)
│   └── stories.ts                  # Histoires mockées
└── middleware.ts                    # Protection des routes
```

---

## 🔑 Variables d'Environnement

Fichier `.env` requis:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-ici"

# OAuth Providers
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
GITHUB_ID="votre-github-id"
GITHUB_SECRET="votre-github-secret"

# Email (à ajouter)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="StoryVerse <noreply@storyverse.com>"
```

---

## 🔧 Commandes Utiles

### Développement
```bash
npm run dev              # Serveur de développement
npm run build            # Build production
npm start                # Serveur production
npm run lint             # Linter
```

### Base de Données
```bash
npx prisma studio        # Interface graphique
npx prisma migrate dev   # Créer migration
npx prisma db push       # Pousser le schéma
npx prisma generate      # Générer le client
npx prisma db seed       # Seed la base (à créer)
```

---

## 📖 Flows Utilisateur

### Visiteur
1. Parcourir les histoires publiées
2. Lire les chapitres
3. Découvrir les auteurs
4. Postuler pour devenir auteur

### Auteur
1. Se connecter via OAuth
2. Soumettre candidature (bio + motivation)
3. Attendre approbation admin
4. Soumettre des histoires avec chapitres
5. Voir statistiques dans dashboard
6. ⚠️ Éditer histoires (à implémenter)

### Admin
1. Se connecter avec compte admin
2. Examiner les candidatures auteur
3. Modérer les histoires soumises
4. Gérer les utilisateurs (rôles, suspension)
5. Voir statistiques globales

---

## 🚨 Problèmes Connus

### 🔴 Critique
1. **Mock data** - Certaines pages utilisent encore `/data/stories.ts`
2. **Emails** - 7 TODOs non implémentés
3. **Édition** - Impossible de modifier après soumission
4. **Stats** - Views/likes non trackés
5. **Champ featured** - Manquant dans le schéma

### 🟡 Important
6. **Recherche** - Pas de barre de recherche
7. **Profil** - Pas de page de profil utilisateur
8. **Sécurité** - Pas de rate limiting
9. **Erreurs** - Pas de pages 404/500

👉 **Voir [ANALYSE_COMPLETE.md](./ANALYSE_COMPLETE.md) pour plus de détails**

---

## 🎯 Roadmap

### Phase 1: Corrections Critiques (5 jours) 🔴
- [ ] Intégration complète base de données
- [ ] Système d'emails fonctionnel
- [ ] Édition d'histoires
- [ ] Tracking des statistiques
- [ ] Tests et corrections

### Phase 2: Améliorations (7 jours) 🟡
- [ ] Recherche et filtres
- [ ] Profil utilisateur
- [ ] Pages d'erreur
- [ ] Rate limiting
- [ ] Tests finaux

### Phase 3: Fonctionnalités Avancées (2-4 semaines) 🟢
- [ ] Système de commentaires
- [ ] Notation/reviews
- [ ] Analytics auteur
- [ ] Upload d'images
- [ ] Éditeur Markdown
- [ ] Notifications in-app

---

## 📊 Progression

```
Fonctionnalités:     ████████░░ 70%
Backend:             ████████░░ 80%
Frontend:            ██████░░░░ 65%
Sécurité:            █████░░░░░ 50%
Tests:               ░░░░░░░░░░  0%
Production-ready:    ██████░░░░ 60%
```

**Estimation:** 2-3 semaines pour production-ready

---

## 🤝 Contribution

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines.

### Workflow
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 License

MIT

---

## 🆘 Support

### Documentation
- [START_HERE.md](./START_HERE.md) - Démarrage rapide
- [TODO.md](./TODO.md) - Liste des tâches
- [ANALYSE_COMPLETE.md](./ANALYSE_COMPLETE.md) - Analyse détaillée
- [PLAN_ACTION.md](./PLAN_ACTION.md) - Plan d'action

### Problèmes Courants

**Le dashboard tourne en boucle?**
✅ Déjà corrigé! Voir [DASHBOARD_FIX.md](./DASHBOARD_FIX.md)

**Les histoires n'apparaissent pas?**
⚠️ Normal, voir [TODO.md](./TODO.md) Jour 1

**Pas d'emails envoyés?**
⚠️ Normal, voir [TODO.md](./TODO.md) Jour 2

---

## 🎓 Ressources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

**Créé avec ❤️ en utilisant Next.js, Prisma et Framer Motion**

**Prochaine étape:** Ouvrir [START_HERE.md](./START_HERE.md) pour commencer! 🚀
