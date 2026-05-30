# 🚀 PLAN D'ACTION - StoryVerse

**Objectif:** Rendre le site pleinement opérationnel  
**Durée estimée:** 2-3 semaines  
**Priorité:** Corrections critiques d'abord

---

## 📅 PHASE 1: CORRECTIONS CRITIQUES (Jours 1-5)

### ✅ JOUR 1: Intégration Base de Données

#### Tâche 1.1: Ajouter champ `featured` au schéma
```bash
# Modifier prisma/schema.prisma
# Ajouter: featured Boolean @default(false)
npx prisma migrate dev --name add_featured_field
npx prisma generate
```

#### Tâche 1.2: Remplacer mock data dans `/app/page.tsx`
**Fichier:** `app/page.tsx`
```typescript
// Remplacer:
import { stories } from '@/data/stories';
const featuredStories = stories.filter(s => s.featured);

// Par:
const featuredStories = await prisma.story.findMany({
  where: { 
    status: 'PUBLISHED',
    featured: true 
  },
  include: { 
    author: true,
    stats: true,
    chapters: { take: 1 }
  },
  take: 3
});
```

#### Tâche 1.3: Remplacer mock data dans `/app/stories/[id]/page.tsx`
**Fichier:** `app/stories/[id]/page.tsx`
```typescript
// Remplacer:
const story = stories.find(s => s.id === params.id);

// Par:
const story = await prisma.story.findUnique({
  where: { id: params.id },
  include: {
    author: true,
    chapters: { orderBy: { number: 'asc' } },
    stats: true,
    contentWarnings: true
  }
});
```

#### Tâche 1.4: Remplacer mock data dans lecteur de chapitres
**Fichier:** `app/stories/[id]/chapter/[number]/page.tsx`
```typescript
// Remplacer:
const story = stories.find(s => s.id === params.id);
const chapter = story?.chapters[chapterNumber - 1];

// Par:
const chapter = await prisma.chapter.findFirst({
  where: {
    storyId: params.id,
    number: parseInt(params.number)
  },
  include: {
    story: {
      include: {
        author: true,
        chapters: { select: { number: true, title: true } }
      }
    }
  }
});
```

#### Tâche 1.5: Créer script de seed pour données de test
**Fichier:** `prisma/seed.ts`
```typescript
// Créer des histoires featured pour tester
// Ajouter des chapitres
// Initialiser StoryStats
```

**Commandes:**
```bash
npx prisma db seed
```

---

### ✅ JOUR 2: Système d'Emails

#### Tâche 2.1: Configuration Resend
**Fichier:** `.env`
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=StoryVerse <noreply@storyverse.com>
```

#### Tâche 2.2: Créer service d'emails
**Fichier:** `lib/email.ts`
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email error:', error);
  }
}
```

#### Tâche 2.3: Créer templates d'emails
**Fichier:** `lib/email-templates.ts`
```typescript
export const emailTemplates = {
  applicationReceived: (name: string) => ({
    subject: 'Candidature reçue - StoryVerse',
    html: `<h1>Bonjour ${name},</h1>...`
  }),
  applicationApproved: (name: string) => ({
    subject: 'Candidature approuvée! 🎉',
    html: `<h1>Félicitations ${name}!</h1>...`
  }),
  applicationRejected: (name: string, reason?: string) => ({
    subject: 'Candidature non retenue',
    html: `<h1>Bonjour ${name},</h1>...`
  }),
  storyPublished: (name: string, storyTitle: string) => ({
    subject: `Votre histoire "${storyTitle}" est publiée!`,
    html: `<h1>Bravo ${name}!</h1>...`
  }),
  storyPending: (name: string, storyTitle: string) => ({
    subject: `Votre histoire "${storyTitle}" est en cours de modération`,
    html: `<h1>Bonjour ${name},</h1>...`
  }),
  storyRejected: (name: string, storyTitle: string, reason: string) => ({
    subject: `Votre histoire "${storyTitle}" nécessite des modifications`,
    html: `<h1>Bonjour ${name},</h1>...`
  }),
  welcome: (name: string) => ({
    subject: 'Bienvenue sur StoryVerse! 👋',
    html: `<h1>Bienvenue ${name}!</h1>...`
  })
};
```

#### Tâche 2.4: Intégrer emails dans les API routes
**Fichiers à modifier:**
1. `app/api/author/apply/route.ts` - Email confirmation
2. `app/api/admin/applications/approve/route.ts` - Email approbation
3. `app/api/admin/applications/reject/route.ts` - Email rejet
4. `app/api/stories/submit/route.ts` - Emails selon statut
5. `app/api/admin/stories/[id]/route.ts` - Emails modération

**Exemple:**
```typescript
import { sendEmail } from '@/lib/email';
import { emailTemplates } from '@/lib/email-templates';

// Après approbation
const template = emailTemplates.applicationApproved(user.name);
await sendEmail({
  to: user.email,
  ...template
});
```

---

### ✅ JOUR 3: Édition d'Histoires

#### Tâche 3.1: Créer API routes pour chapitres
**Fichier:** `app/api/stories/[id]/chapters/route.ts`
```typescript
// POST - Ajouter un chapitre
export async function POST(req: Request, { params }) {
  const session = await getServerSession(authOptions);
  const { title, content, readTime, mood } = await req.json();
  
  // Vérifier que l'utilisateur est l'auteur
  const story = await prisma.story.findUnique({
    where: { id: params.id }
  });
  
  if (story.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }
  
  // Trouver le prochain numéro de chapitre
  const lastChapter = await prisma.chapter.findFirst({
    where: { storyId: params.id },
    orderBy: { number: 'desc' }
  });
  
  const chapter = await prisma.chapter.create({
    data: {
      storyId: params.id,
      number: (lastChapter?.number || 0) + 1,
      title,
      content,
      readTime,
      mood
    }
  });
  
  return NextResponse.json(chapter);
}
```

**Fichier:** `app/api/stories/[id]/chapters/[number]/route.ts`
```typescript
// PUT - Modifier un chapitre
export async function PUT(req: Request, { params }) {
  // Vérifier autorisation
  // Mettre à jour le chapitre
}

// DELETE - Supprimer un chapitre
export async function DELETE(req: Request, { params }) {
  // Vérifier autorisation
  // Supprimer le chapitre
  // Réorganiser les numéros
}
```

#### Tâche 3.2: Créer page d'édition d'histoire
**Fichier:** `app/author/stories/[id]/edit/page.tsx`
```typescript
'use client';

export default function EditStoryPage({ params }) {
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  
  // Charger l'histoire
  useEffect(() => {
    fetch(`/api/stories/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setStory(data);
        setChapters(data.chapters);
      });
  }, [params.id]);
  
  // Formulaire d'édition
  // Liste des chapitres avec boutons edit/delete
  // Bouton "Ajouter un chapitre"
  
  return (
    <div>
      <h1>Éditer: {story?.title}</h1>
      {/* Formulaire */}
    </div>
  );
}
```

#### Tâche 3.3: Ajouter bouton "Éditer" dans dashboard auteur
**Fichier:** `app/author/dashboard/page.tsx`
```typescript
// Remplacer le bouton désactivé par:
<Link href={`/author/stories/${story.id}/edit`}>
  <button className="...">
    <Edit className="h-4 w-4" />
    Éditer
  </button>
</Link>
```

#### Tâche 3.4: Implémenter sauvegarde de brouillons
**Fichier:** `app/api/stories/[id]/route.ts`
```typescript
// PUT - Mettre à jour une histoire
export async function PUT(req: Request, { params }) {
  const session = await getServerSession(authOptions);
  const data = await req.json();
  
  // Vérifier autorisation
  const story = await prisma.story.findUnique({
    where: { id: params.id }
  });
  
  if (story.authorId !== session.user.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }
  
  // Mettre à jour
  const updated = await prisma.story.update({
    where: { id: params.id },
    data: {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      genre: data.genre,
      // Si status change de DRAFT à PENDING, relancer modération
      ...(data.status === 'PENDING' && story.status === 'DRAFT' && {
        status: 'PENDING',
        // Relancer modération
      })
    }
  });
  
  return NextResponse.json(updated);
}
```

---

### ✅ JOUR 4: Tracking des Statistiques

#### Tâche 4.1: API pour tracker les vues
**Fichier:** `app/api/stories/[id]/view/route.ts`
```typescript
export async function POST(req: Request, { params }) {
  try {
    // Vérifier si StoryStats existe, sinon créer
    const stats = await prisma.storyStats.upsert({
      where: { storyId: params.id },
      update: {
        views: { increment: 1 }
      },
      create: {
        storyId: params.id,
        views: 1,
        likes: 0,
        bookmarks: 0
      }
    });
    
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}
```

#### Tâche 4.2: API pour likes
**Fichier:** `app/api/stories/[id]/like/route.ts`
```typescript
// POST - Liker
export async function POST(req: Request, { params }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  }
  
  // Créer table UserLike pour éviter les doublons
  // Ou utiliser cookies/localStorage côté client
  
  await prisma.storyStats.update({
    where: { storyId: params.id },
    data: { likes: { increment: 1 } }
  });
  
  return NextResponse.json({ success: true });
}

// DELETE - Unliker
export async function DELETE(req: Request, { params }) {
  // Décrémenter
}
```

#### Tâche 4.3: API pour bookmarks
**Fichier:** `app/api/stories/[id]/bookmark/route.ts`
```typescript
// Similaire à likes
```

#### Tâche 4.4: Ajouter boutons dans UI
**Fichier:** `app/stories/[id]/page.tsx`
```typescript
'use client';

function StoryActions({ storyId }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  const handleLike = async () => {
    const res = await fetch(`/api/stories/${storyId}/like`, {
      method: liked ? 'DELETE' : 'POST'
    });
    if (res.ok) setLiked(!liked);
  };
  
  return (
    <div className="flex gap-4">
      <button onClick={handleLike}>
        <Heart className={liked ? 'fill-red-500' : ''} />
        Like
      </button>
      <button onClick={handleBookmark}>
        <Bookmark className={bookmarked ? 'fill-blue-500' : ''} />
        Sauvegarder
      </button>
    </div>
  );
}
```

#### Tâche 4.5: Tracker automatiquement les vues
**Fichier:** `app/stories/[id]/chapter/[number]/page.tsx`
```typescript
'use client';

useEffect(() => {
  // Tracker la vue après 5 secondes de lecture
  const timer = setTimeout(() => {
    fetch(`/api/stories/${params.id}/view`, { method: 'POST' });
  }, 5000);
  
  return () => clearTimeout(timer);
}, [params.id]);
```

---

### ✅ JOUR 5: Tests & Corrections

#### Tâche 5.1: Tests manuels
- [ ] Créer un compte
- [ ] Soumettre candidature auteur
- [ ] Approuver candidature (admin)
- [ ] Soumettre une histoire
- [ ] Vérifier email reçu
- [ ] Voir l'histoire dans la bibliothèque
- [ ] Lire un chapitre
- [ ] Vérifier que les vues sont trackées
- [ ] Liker l'histoire
- [ ] Éditer l'histoire
- [ ] Ajouter un chapitre
- [ ] Supprimer un chapitre

#### Tâche 5.2: Vérifier responsive
- [ ] Tester sur mobile (375px)
- [ ] Tester sur tablette (768px)
- [ ] Tester sur desktop (1920px)

#### Tâche 5.3: Corriger les bugs trouvés
- [ ] Lister tous les bugs
- [ ] Prioriser
- [ ] Corriger un par un

#### Tâche 5.4: Vérifier les performances
```bash
npm run build
npm run start
# Ouvrir Lighthouse dans Chrome DevTools
```

---

## 📅 PHASE 2: AMÉLIORATIONS MOYENNES (Jours 6-12)

### ✅ JOUR 6-7: Recherche et Filtres

#### Tâche 6.1: API de recherche
**Fichier:** `app/api/stories/search/route.ts`
```typescript
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const genre = searchParams.get('genre');
  const sort = searchParams.get('sort') || 'createdAt';
  
  const stories = await prisma.story.findMany({
    where: {
      status: 'PUBLISHED',
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      }),
      ...(genre && {
        genre: { contains: genre }
      })
    },
    include: {
      author: true,
      stats: true,
      chapters: { take: 1 }
    },
    orderBy: {
      [sort === 'views' ? 'stats' : sort]: sort === 'views' ? { views: 'desc' } : 'desc'
    }
  });
  
  return NextResponse.json(stories);
}
```

#### Tâche 6.2: UI de recherche
**Fichier:** `app/library/page.tsx`
```typescript
'use client';

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [stories, setStories] = useState([]);
  
  useEffect(() => {
    const params = new URLSearchParams({
      ...(searchQuery && { q: searchQuery }),
      ...(selectedGenre && { genre: selectedGenre }),
      sort: sortBy
    });
    
    fetch(`/api/stories/search?${params}`)
      .then(res => res.json())
      .then(setStories);
  }, [searchQuery, selectedGenre, sortBy]);
  
  return (
    <div>
      <input
        type="search"
        placeholder="Rechercher..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
        <option value="">Tous les genres</option>
        <option value="fantasy">Fantasy</option>
        <option value="sci-fi">Science-Fiction</option>
        {/* ... */}
      </select>
      
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="createdAt">Plus récent</option>
        <option value="views">Plus populaire</option>
        <option value="title">Alphabétique</option>
      </select>
      
      <div className="grid">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
```

---

### ✅ JOUR 8-9: Profil Utilisateur

#### Tâche 8.1: API de profil
**Fichier:** `app/api/user/profile/route.ts`
```typescript
// GET - Récupérer profil
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      stories: {
        include: { stats: true }
      },
      authorApplication: true
    }
  });
  
  return NextResponse.json(user);
}

// PUT - Mettre à jour profil
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const { name, bio, image } = await req.json();
  
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, image }
  });
  
  return NextResponse.json(user);
}
```

#### Tâche 8.2: Page de profil
**Fichier:** `app/author/profile/page.tsx`
```typescript
'use client';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  
  // Charger profil
  // Formulaire d'édition
  // Upload d'avatar (Cloudinary ou S3)
  
  return (
    <div>
      <h1>Mon Profil</h1>
      {/* ... */}
    </div>
  );
}
```

---

### ✅ JOUR 10: Pages d'Erreur

#### Tâche 10.1: Page 404
**Fichier:** `app/not-found.tsx`
```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl">Page non trouvée</p>
        <Link href="/">
          <button>Retour à l'accueil</button>
        </Link>
      </div>
    </div>
  );
}
```

#### Tâche 10.2: Page d'erreur globale
**Fichier:** `app/error.tsx`
```typescript
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Une erreur est survenue</h1>
        <p className="text-foreground/60">{error.message}</p>
        <button onClick={reset}>Réessayer</button>
      </div>
    </div>
  );
}
```

#### Tâche 10.3: Pages légales
**Fichiers:**
- `app/terms/page.tsx` - Conditions d'utilisation
- `app/privacy/page.tsx` - Politique de confidentialité
- `app/guidelines/page.tsx` - Règles de contenu

---

### ✅ JOUR 11: Rate Limiting & Sécurité

#### Tâche 11.1: Installer Upstash
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Fichier:** `.env`
```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

#### Tâche 11.2: Créer middleware de rate limiting
**Fichier:** `lib/rate-limit.ts`
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const ratelimit = {
  // 10 requêtes par heure pour soumissions
  submission: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
  }),
  
  // 100 requêtes par minute pour API générale
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
  }),
};
```

#### Tâche 11.3: Appliquer rate limiting
**Fichier:** `app/api/stories/submit/route.ts`
```typescript
import { ratelimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Rate limiting
  const { success } = await ratelimit.submission.limit(session.user.id);
  if (!success) {
    return NextResponse.json(
      { error: 'Trop de soumissions. Réessayez dans 1 heure.' },
      { status: 429 }
    );
  }
  
  // ... reste du code
}
```

#### Tâche 11.4: Protection XSS
**Installer:** `npm install dompurify isomorphic-dompurify`

**Fichier:** `lib/sanitize.ts`
```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: []
  });
}
```

---

### ✅ JOUR 12: Tests Finaux

#### Tâche 12.1: Tests de sécurité
- [ ] Tester rate limiting
- [ ] Tenter injection SQL
- [ ] Tenter XSS
- [ ] Vérifier CSRF protection

#### Tâche 12.2: Tests de performance
- [ ] Lighthouse audit
- [ ] Test de charge (k6 ou Artillery)
- [ ] Vérifier temps de réponse API

#### Tâche 12.3: Tests d'accessibilité
- [ ] Tester avec lecteur d'écran
- [ ] Vérifier contraste des couleurs
- [ ] Tester navigation au clavier

---

## 🎯 CHECKLIST FINALE AVANT PRODUCTION

### Fonctionnalités
- [ ] ✅ Toutes les pages utilisent la base de données
- [ ] ✅ Emails fonctionnels
- [ ] ✅ Édition d'histoires
- [ ] ✅ Statistiques trackées
- [ ] ✅ Recherche et filtres
- [ ] ✅ Profil utilisateur
- [ ] ✅ Pages d'erreur

### Sécurité
- [ ] ✅ Rate limiting
- [ ] ✅ Protection XSS
- [ ] ✅ HTTPS
- [ ] ✅ Variables d'environnement sécurisées
- [ ] ✅ Validation côté serveur

### Performance
- [ ] ✅ Lighthouse score > 90
- [ ] ✅ Images optimisées
- [ ] ✅ Lazy loading

### Légal
- [ ] ✅ Terms of service
- [ ] ✅ Privacy policy
- [ ] ✅ Content guidelines

---

## 📊 SUIVI DE PROGRESSION

| Tâche | Statut | Priorité | Durée estimée |
|-------|--------|----------|---------------|
| Base de données | ⏳ À faire | 🔴 Critique | 1 jour |
| Emails | ⏳ À faire | 🔴 Critique | 1 jour |
| Édition histoires | ⏳ À faire | 🔴 Critique | 1 jour |
| Statistiques | ⏳ À faire | 🔴 Critique | 1 jour |
| Tests Phase 1 | ⏳ À faire | 🔴 Critique | 1 jour |
| Recherche | ⏳ À faire | 🟡 Important | 2 jours |
| Profil | ⏳ À faire | 🟡 Important | 2 jours |
| Pages erreur | ⏳ À faire | 🟡 Important | 1 jour |
| Sécurité | ⏳ À faire | 🟡 Important | 1 jour |
| Tests Phase 2 | ⏳ À faire | 🟡 Important | 1 jour |

**Total:** 12 jours de travail

---

## 🚀 COMMENCER MAINTENANT

Pour démarrer la Phase 1, exécutez:

```bash
# 1. Ajouter champ featured
# Modifier prisma/schema.prisma puis:
npx prisma migrate dev --name add_featured_field

# 2. Démarrer le serveur
npm run dev

# 3. Ouvrir le projet
code .
```

**Prochaine étape:** Modifier `prisma/schema.prisma` pour ajouter le champ `featured`.
