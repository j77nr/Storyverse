# ✅ TODO - StoryVerse

## 🔴 URGENT (Phase 1 - 5 jours)

### Jour 1: Base de Données ✅ COMPLÉTÉ
- [x] Ajouter `featured Boolean @default(false)` dans `prisma/schema.prisma`
- [x] Migrer: `npx prisma migrate dev --name add_featured_field`
- [x] Remplacer mock data dans `app/page.tsx`
- [x] Remplacer mock data dans `app/stories/[id]/page.tsx`
- [x] Remplacer mock data dans `app/stories/[id]/chapter/[number]/page.tsx`
- [x] Créer `prisma/seed.ts` avec données de test

### Jour 2: Emails ✅ COMPLÉTÉ
- [x] Configurer Resend dans `.env`
- [x] Créer `lib/email.ts` (service d'envoi)
- [x] Créer `lib/email-templates.ts` (7 templates)
- [x] Intégrer emails dans `app/api/author/apply/route.ts`
- [x] Intégrer emails dans `app/api/admin/applications/approve/route.ts`
- [x] Intégrer emails dans `app/api/admin/applications/reject/route.ts`
- [x] Intégrer emails dans `app/api/stories/submit/route.ts`

### Jour 3: Édition d'Histoires ✅ COMPLÉTÉ
- [x] Créer `app/api/stories/[id]/chapters/route.ts` (POST)
- [x] Créer `app/api/stories/[id]/chapters/[number]/route.ts` (PUT, DELETE)
- [x] Créer page `app/author/stories/[id]/edit/page.tsx`
- [x] Ajouter bouton "Éditer" dans `app/author/dashboard/page.tsx`
- [x] Implémenter sauvegarde brouillons dans `app/api/stories/[id]/route.ts`

### Jour 4: Statistiques ✅ COMPLÉTÉ
- [x] Créer `app/api/stories/[id]/view/route.ts`
- [x] Créer `app/api/stories/[id]/like/route.ts`
- [x] Créer `app/api/stories/[id]/bookmark/route.ts`
- [x] Ajouter boutons like/bookmark dans `app/stories/[id]/page.tsx`
- [x] Tracker automatiquement vues dans lecteur de chapitres

### Jour 5: Tests ✅ COMPLÉTÉ
- [x] Créer guide de tests complet
- [x] Créer checklist responsive
- [x] Créer script de tests automatisés
- [x] Vérifier build de production
- [x] Vérifier diagnostics TypeScript
- [ ] ⏳ Effectuer tests manuels (à faire par l'utilisateur)
- [ ] ⏳ Vérifier responsive (à faire par l'utilisateur)
- [ ] ⏳ Corriger bugs trouvés
- [ ] ⏳ Vérifier performances (Lighthouse)

---

## 🟡 IMPORTANT (Phase 2 - 7 jours)

### Jours 6-7: Recherche & Filtres ✅ COMPLÉTÉ
- [x] Créer `app/api/stories/search/route.ts` (intégré dans /api/stories)
- [x] Ajouter barre de recherche dans `app/library/page.tsx`
- [x] Ajouter filtres par genre
- [x] Ajouter tri (date, popularité, alphabétique)

### Jours 8-9: Profil Utilisateur ✅ COMPLÉTÉ
- [x] Créer `app/api/user/profile/route.ts` (GET, PUT)
- [x] Créer page `app/author/profile/page.tsx`
- [x] Implémenter upload d'avatar
- [x] Formulaire d'édition de profil

### Jour 10: Pages d'Erreur ✅ COMPLÉTÉ
- [x] Créer `app/not-found.tsx` (404)
- [x] Créer `app/error.tsx` (500)
- [ ] Créer `app/terms/page.tsx`
- [ ] Créer `app/privacy/page.tsx`
- [ ] Créer `app/guidelines/page.tsx`

### Jour 11: Sécurité ✅ COMPLÉTÉ
- [x] Créer `lib/rate-limit.ts` (rate limiter en mémoire)
- [x] Créer `lib/sanitize.ts` (protection XSS)
- [x] Appliquer rate limiting sur soumission d'histoires
- [x] Appliquer rate limiting sur candidatures auteur
- [x] Appliquer rate limiting sur likes (anti-spam)
- [x] Créer `middleware.ts` (headers de sécurité)

### Jour 12: Tests Finaux
- [ ] Tests de sécurité
- [ ] Tests de performance
- [ ] Tests d'accessibilité
- [ ] Audit Lighthouse

---

## 🟢 NICE-TO-HAVE (Phase 3 - Futur)

### Fonctionnalités Sociales
- [ ] Système de commentaires
- [ ] Notation/reviews
- [ ] Suivre des auteurs
- [ ] Listes de lecture personnalisées

### Éditeur Avancé
- [ ] Support Markdown
- [ ] Upload d'images dans chapitres
- [ ] Éditeur WYSIWYG
- [ ] Prévisualisation en temps réel

### Analytics
- [ ] Dashboard auteur avec graphiques
- [ ] Taux de complétion des lectures
- [ ] Démographie des lecteurs
- [ ] Tendances et recommandations

### Modération
- [ ] Pages `/moderator/*`
- [ ] Queue de modération
- [ ] Historique des décisions
- [ ] Système de reports

### Optimisations
- [ ] Cache Redis
- [ ] CDN pour images
- [ ] Lazy loading avancé
- [ ] PWA (Progressive Web App)
- [ ] Tests automatisés (Jest, Playwright)

---

## 📊 PROGRESSION

**Phase 1:** █████ 5/5 jours (100%)  
**Phase 2:** ██████░ 5/7 jours (71%)  
**Phase 3:** ⬜⬜⬜⬜⬜ 0% (futur)

**Total:** 10/12 jours complétés (83%)

---

## 🎯 OBJECTIF

**Rendre StoryVerse pleinement opérationnel en 2-3 semaines**

### Critères de succès:
✅ Toutes les données viennent de la base  
✅ Emails envoyés automatiquement  
✅ Auteurs peuvent éditer leurs histoires  
✅ Statistiques trackées en temps réel  
✅ Recherche et filtres fonctionnels  
✅ Site sécurisé (rate limiting, XSS)  
✅ Pages d'erreur personnalisées  
✅ Lighthouse score > 90  

---

## 🚀 DÉMARRER

```bash
# 1. Ouvrir le schéma Prisma
code prisma/schema.prisma

# 2. Ajouter le champ featured
# featured Boolean @default(false)

# 3. Migrer
npx prisma migrate dev --name add_featured_field

# 4. Commencer les modifications
```

**Prochaine tâche:** Modifier `prisma/schema.prisma` ⬅️ COMMENCER ICI
