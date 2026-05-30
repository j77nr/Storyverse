# Architecture du Système d'Auteur - StoryVerse

## Vue d'Ensemble de l'Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Homepage   │  │   Become     │  │   Author     │         │
│  │              │  │   Author     │  │   Dashboard  │         │
│  │  - Hero      │  │              │  │              │         │
│  │  - Features  │  │  - Info      │  │  - Stats     │         │
│  │  - Stories   │  │  - Guidelines│  │  - Stories   │         │
│  │  - CTA       │  │  - Form      │  │  - Actions   │         │
│  │  - Footer    │  │  - Success   │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Submit     │  │   Library    │  │   Story      │         │
│  │   Story      │  │              │  │   Detail     │         │
│  │              │  │  - Grid      │  │              │         │
│  │  - Form      │  │  - Filters   │  │  - Hero      │         │
│  │  - Moderation│  │  - Search    │  │  - Chapters  │         │
│  │  - Result    │  │              │  │  - Reader    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js API Routes)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Authentication                       │    │
│  │  /api/auth/[...nextauth]                               │    │
│  │  - Login, Logout, Session Management                   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Author Routes                        │    │
│  │  POST   /api/author/apply      - Submit application    │    │
│  │  GET    /api/author/status     - Check status          │    │
│  │  PATCH  /api/author/profile    - Update profile        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Story Routes                         │    │
│  │  POST   /api/stories/submit    - Submit new story      │    │
│  │  GET    /api/stories/author    - Get author's stories  │    │
│  │  GET    /api/stories/[id]      - Get story details     │    │
│  │  PUT    /api/stories/[id]      - Update story          │    │
│  │  DELETE /api/stories/[id]      - Delete story          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Chapter Routes                       │    │
│  │  POST   /api/stories/[id]/chapters  - Add chapter      │    │
│  │  PUT    /api/chapters/[id]          - Update chapter   │    │
│  │  DELETE /api/chapters/[id]          - Delete chapter   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Moderation Routes                      │    │
│  │  GET    /api/moderation/queue   - Get review queue     │    │
│  │  POST   /api/moderation/review  - Review submission    │    │
│  │  POST   /api/moderation/appeal  - Appeal decision      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma ORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (PostgreSQL/MySQL)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Users     │  │   Accounts   │  │   Sessions   │         │
│  │              │  │              │  │              │         │
│  │  - id        │  │  - id        │  │  - id        │         │
│  │  - email     │  │  - userId    │  │  - userId    │         │
│  │  - name      │  │  - provider  │  │  - token     │         │
│  │  - role      │  │  - type      │  │  - expires   │         │
│  │  - status    │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Author     │  │   Stories    │  │   Chapters   │         │
│  │ Applications │  │              │  │              │         │
│  │              │  │  - id        │  │  - id        │         │
│  │  - id        │  │  - authorId  │  │  - storyId   │         │
│  │  - userId    │  │  - title     │  │  - number    │         │
│  │  - bio       │  │  - status    │  │  - title     │         │
│  │  - motivation│  │  - modScore  │  │  - content   │         │
│  │  - status    │  │  - genre     │  │  - readTime  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   Content    │  │   Story      │                            │
│  │   Warnings   │  │   Stats      │                            │
│  │              │  │              │                            │
│  │  - id        │  │  - storyId   │                            │
│  │  - storyId   │  │  - views     │                            │
│  │  - warning   │  │  - likes     │                            │
│  │              │  │  - bookmarks │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Email Service (Resend)                                │    │
│  │  - Confirmation emails                                 │    │
│  │  - Notification emails                                 │    │
│  │  - Status updates                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  OAuth Providers (Google, GitHub)                      │    │
│  │  - User authentication                                 │    │
│  │  - Profile information                                 │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Content Moderation APIs (Future)                      │    │
│  │  - OpenAI Moderation API                               │    │
│  │  - Perspective API                                     │    │
│  │  - Plagiarism detection                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  File Storage (Cloudinary/S3) (Future)                 │    │
│  │  - Cover images                                        │    │
│  │  - User avatars                                        │    │
│  │  - Story assets                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Flux de Données Détaillés

### 1. Flux de Candidature Auteur

```
┌─────────────┐
│   Visitor   │
└──────┬──────┘
       │
       │ 1. Visite /become-author
       ▼
┌─────────────────────┐
│  Become Author Page │
│                     │
│  - Lit guidelines   │
│  - Remplit form     │
│  - Accepte terms    │
└──────┬──────────────┘
       │
       │ 2. POST /api/author/apply
       │    { bio, motivation }
       ▼
┌─────────────────────┐
│   API Route         │
│                     │
│  - Vérifie auth     │
│  - Valide données   │
│  - Vérifie duplicat │
└──────┬──────────────┘
       │
       │ 3. Prisma.create()
       ▼
┌─────────────────────┐
│   Database          │
│                     │
│  AuthorApplication  │
│  status: PENDING    │
└──────┬──────────────┘
       │
       │ 4. Trigger email
       ▼
┌─────────────────────┐
│   Email Service     │
│                     │
│  - Confirmation     │
│  - Next steps       │
└──────┬──────────────┘
       │
       │ 5. Response
       ▼
┌─────────────────────┐
│   Success Page      │
│                     │
│  - Confirmation     │
│  - Timeline         │
└─────────────────────┘
```

### 2. Flux de Soumission d'Histoire

```
┌─────────────┐
│   Author    │
└──────┬──────┘
       │
       │ 1. Visite /author/submit
       ▼
┌─────────────────────────┐
│  Submit Story Page      │
│                         │
│  - Remplit formulaire   │
│  - Ajoute chapitre      │
│  - Sélectionne warnings │
└──────┬──────────────────┘
       │
       │ 2. POST /api/stories/submit
       │    { title, description, chapters, ... }
       ▼
┌─────────────────────────┐
│   API Route             │
│                         │
│  - Vérifie auth + role  │
│  - Valide données       │
└──────┬──────────────────┘
       │
       │ 3. moderateContent()
       ▼
┌─────────────────────────┐
│   Moderation Engine     │
│                         │
│  - Analyse contenu      │
│  - Calcule score        │
│  - Détecte flags        │
└──────┬──────────────────┘
       │
       │ 4. Détermine statut
       ├─────────────┬─────────────┬──────────────┐
       │             │             │              │
       │ Score ≥90   │ Score 70-89 │ Score <70    │
       ▼             ▼             ▼              │
   PUBLISHED      PENDING       REJECTED          │
       │             │             │              │
       └─────────────┴─────────────┴──────────────┘
                     │
                     │ 5. Prisma.create()
                     ▼
┌─────────────────────────────────────────────────┐
│   Database                                      │
│                                                 │
│  Story + Chapters + ContentWarnings + Stats    │
└──────┬──────────────────────────────────────────┘
       │
       │ 6. Trigger email
       ▼
┌─────────────────────────┐
│   Email Service         │
│                         │
│  - Published: Congrats  │
│  - Pending: In review   │
│  - Rejected: Reasons    │
└──────┬──────────────────┘
       │
       │ 7. Response
       ▼
┌─────────────────────────┐
│   Moderation Result     │
│                         │
│  - Score                │
│  - Flags                │
│  - Status               │
└──────┬──────────────────┘
       │
       │ 8. Redirect
       ▼
┌─────────────────────────┐
│   Success Page          │
│   ou                    │
│   Author Dashboard      │
└─────────────────────────┘
```

### 3. Flux de Lecture d'Histoire

```
┌─────────────┐
│   Reader    │
└──────┬──────┘
       │
       │ 1. Visite /library
       ▼
┌─────────────────────────┐
│  Library Page           │
│                         │
│  - GET /api/stories     │
│  - Filtre: PUBLISHED    │
└──────┬──────────────────┘
       │
       │ 2. Clique sur story
       ▼
┌─────────────────────────┐
│  Story Detail Page      │
│  /stories/[id]          │
│                         │
│  - GET /api/stories/[id]│
│  - Affiche hero         │
│  - Liste chapitres      │
└──────┬──────────────────┘
       │
       │ 3. Clique sur chapitre
       ▼
┌─────────────────────────┐
│  Chapter Reader Page    │
│  /stories/[id]/chapter/ │
│  [number]               │
│                         │
│  - Affiche contenu      │
│  - Animations           │
│  - Navigation           │
└──────┬──────────────────┘
       │
       │ 4. Incrémente vues
       ▼
┌─────────────────────────┐
│  POST /api/stories/     │
│  [id]/view              │
│                         │
│  - Update StoryStats    │
└─────────────────────────┘
```

## Système de Modération - Détails

### Algorithme de Scoring

```
┌─────────────────────────────────────────────────────────┐
│                   MODERATION ENGINE                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Input: Story Content (title + description + chapters)  │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  Step 1: Initialize Score                      │    │
│  │  score = 100                                    │    │
│  └────────────────────────────────────────────────┘    │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Step 2: Check Forbidden Keywords              │    │
│  │  For each keyword in FORBIDDEN_KEYWORDS:       │    │
│  │    if found: score -= 50, add flag             │    │
│  └────────────────────────────────────────────────┘    │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Step 3: Check Content Length                  │    │
│  │  if length < 100: score -= 20                  │    │
│  └────────────────────────────────────────────────┘    │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Step 4: Check Structure                       │    │
│  │  if sentences < 3: score -= 10                 │    │
│  └────────────────────────────────────────────────┘    │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Step 5: Check Offensive Language              │    │
│  │  count = offensive words found                 │    │
│  │  if count > 5: score -= 30                     │    │
│  │  else if count > 2: score -= 10                │    │
│  └────────────────────────────────────────────────┘    │
│                    ▼                                     │
│  ┌────────────────────────────────────────────────┐    │
│  │  Step 6: Determine Status                      │    │
│  │  if score >= 90: APPROVED                      │    │
│  │  else if score >= 70: MANUAL_REVIEW            │    │
│  │  else: REJECTED                                │    │
│  └────────────────────────────────────────────────┘    │
│                    ▼                                     │
│  Output: { approved, score, flags, requiresManual,     │
│            rejectionReasons }                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Matrice de Décision

| Score | Statut | Action | Notification |
|-------|--------|--------|--------------|
| 90-100 | ✅ APPROVED | Publication immédiate | "Histoire publiée avec succès" |
| 70-89 | ⏳ MANUAL_REVIEW | File d'attente modération | "En cours de révision (48h)" |
| 0-69 | ❌ REJECTED | Retour à l'auteur | "Histoire rejetée" + raisons |

## Rôles et Permissions

```
┌─────────────────────────────────────────────────────────────┐
│                         ROLES                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  VISITOR (Default)                                           │
│  ├─ Lire histoires publiées                                 │
│  ├─ Voir profils auteurs                                    │
│  ├─ Soumettre candidature auteur                            │
│  └─ Créer compte                                            │
│                                                              │
│  AUTHOR                                                      │
│  ├─ Tout ce que VISITOR peut faire                          │
│  ├─ Accéder au dashboard auteur                             │
│  ├─ Soumettre histoires                                     │
│  ├─ Éditer ses histoires                                    │
│  ├─ Supprimer ses histoires                                 │
│  ├─ Voir statistiques détaillées                            │
│  └─ Gérer ses chapitres                                     │
│                                                              │
│  MODERATOR                                                   │
│  ├─ Tout ce que AUTHOR peut faire                           │
│  ├─ Accéder à la file de modération                         │
│  ├─ Approuver/Rejeter histoires                             │
│  ├─ Approuver/Rejeter candidatures                          │
│  ├─ Voir historique de modération                           │
│  └─ Gérer les appels                                        │
│                                                              │
│  ADMIN                                                       │
│  ├─ Tout ce que MODERATOR peut faire                        │
│  ├─ Gérer utilisateurs (suspendre, bannir)                  │
│  ├─ Modifier politiques de contenu                          │
│  ├─ Voir analytics globales                                 │
│  ├─ Gérer modérateurs                                       │
│  └─ Accès complet à toutes les données                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Sécurité et Validation

### Couches de Sécurité

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Frontend Validation                                │
│  ├─ Validation de formulaire (React Hook Form + Zod)        │
│  ├─ Vérification de longueur                                │
│  ├─ Format d'email                                          │
│  └─ Champs requis                                           │
│                                                              │
│  Layer 2: Middleware                                         │
│  ├─ Vérification de session (NextAuth)                      │
│  ├─ Vérification de rôle                                    │
│  ├─ Rate limiting                                           │
│  └─ CSRF protection                                         │
│                                                              │
│  Layer 3: API Route Validation                              │
│  ├─ Validation Zod des données                              │
│  ├─ Vérification d'authentification                         │
│  ├─ Vérification de permissions                             │
│  └─ Sanitisation des entrées                                │
│                                                              │
│  Layer 4: Database Constraints                              │
│  ├─ Contraintes d'unicité                                   │
│  ├─ Relations foreign key                                   │
│  ├─ Valeurs par défaut                                      │
│  └─ Types de données stricts                                │
│                                                              │
│  Layer 5: Content Moderation                                │
│  ├─ Détection de mots-clés interdits                        │
│  ├─ Analyse de sentiment                                    │
│  ├─ Vérification de plagiat (future)                        │
│  └─ ML-based moderation (future)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Performance et Scalabilité

### Stratégies d'Optimisation

```
┌─────────────────────────────────────────────────────────────┐
│                    OPTIMIZATION STRATEGIES                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Database                                                    │
│  ├─ Index sur colonnes fréquemment requêtées                │
│  ├─ Pagination des résultats                                │
│  ├─ Connection pooling                                      │
│  └─ Query optimization                                      │
│                                                              │
│  Caching                                                     │
│  ├─ Redis pour sessions                                     │
│  ├─ Cache des histoires publiées                            │
│  ├─ Cache des statistiques                                  │
│  └─ CDN pour assets statiques                               │
│                                                              │
│  Frontend                                                    │
│  ├─ Code splitting par route                                │
│  ├─ Lazy loading des images                                 │
│  ├─ Prefetching des pages liées                             │
│  └─ Optimisation des animations                             │
│                                                              │
│  API                                                         │
│  ├─ Rate limiting                                           │
│  ├─ Compression des réponses                                │
│  ├─ Traitement asynchrone (queues)                          │
│  └─ Batch operations                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring et Logs

### Événements à Logger

```
┌─────────────────────────────────────────────────────────────┐
│                         LOGGING                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Authentication Events                                       │
│  ├─ Login success/failure                                   │
│  ├─ Logout                                                  │
│  ├─ Session expiration                                      │
│  └─ Password reset                                          │
│                                                              │
│  Author Events                                               │
│  ├─ Application submitted                                   │
│  ├─ Application approved/rejected                           │
│  ├─ Story submitted                                         │
│  ├─ Story published/rejected                                │
│  └─ Story edited/deleted                                    │
│                                                              │
│  Moderation Events                                           │
│  ├─ Content flagged                                         │
│  ├─ Manual review completed                                 │
│  ├─ Appeal submitted                                        │
│  └─ Appeal resolved                                         │
│                                                              │
│  Error Events                                                │
│  ├─ API errors                                              │
│  ├─ Database errors                                         │
│  ├─ Validation errors                                       │
│  └─ External service failures                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Conclusion

Cette architecture est conçue pour être:
- **Modulaire**: Chaque composant peut être développé et testé indépendamment
- **Scalable**: Peut gérer une croissance du nombre d'utilisateurs et de contenu
- **Sécurisée**: Multiples couches de validation et protection
- **Maintenable**: Code organisé et bien documenté
- **Extensible**: Facile d'ajouter de nouvelles fonctionnalités

La séparation claire entre frontend, API, et base de données permet une évolution progressive du système.
