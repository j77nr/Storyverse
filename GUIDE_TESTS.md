# 🧪 GUIDE DE TESTS - StoryVerse

**Date:** 29 Mai 2026  
**Version:** 1.0  
**Objectif:** Valider le fonctionnement complet de StoryVerse

---

## 📋 TABLE DES MATIÈRES

1. [Tests Fonctionnels](#tests-fonctionnels)
2. [Tests Responsive](#tests-responsive)
3. [Tests de Performance](#tests-de-performance)
4. [Tests d'Accessibilité](#tests-daccessibilité)
5. [Tests de Sécurité](#tests-de-sécurité)
6. [Checklist Finale](#checklist-finale)

---

## 🎯 TESTS FONCTIONNELS

### Test 1: Authentification

#### 1.1 Connexion avec GitHub
```
✅ Étapes:
1. Aller sur la page d'accueil
2. Cliquer sur "Se connecter"
3. Choisir "Continuer avec GitHub"
4. Autoriser l'application
5. Vérifier la redirection vers la page d'accueil
6. Vérifier que le nom d'utilisateur apparaît dans le header

❌ Problèmes potentiels:
- Boucle de redirection
- Session non créée
- Rôle non assigné

✅ Résultat attendu:
- Connexion réussie
- Session active
- Rôle VISITOR par défaut
```

#### 1.2 Déconnexion
```
✅ Étapes:
1. Cliquer sur le menu utilisateur
2. Cliquer sur "Se déconnecter"
3. Vérifier la redirection vers la page d'accueil
4. Vérifier que le bouton "Se connecter" réapparaît

✅ Résultat attendu:
- Déconnexion réussie
- Session supprimée
- Redirection correcte
```

---

### Test 2: Système d'Auteur

#### 2.1 Soumettre une Candidature
```
✅ Étapes:
1. Se connecter en tant que VISITOR
2. Aller sur /become-author
3. Remplir le formulaire:
   - Bio: "Auteur passionné de fantasy..."
   - Motivation: "J'écris depuis 10 ans..."
4. Soumettre la candidature
5. Vérifier le message de confirmation
6. Vérifier l'email de confirmation

❌ Problèmes potentiels:
- Validation échouée
- Email non envoyé
- Candidature non créée en base

✅ Résultat attendu:
- Candidature créée avec status PENDING
- Email de confirmation reçu
- Message de succès affiché
```

#### 2.2 Approuver une Candidature (Admin)
```
✅ Étapes:
1. Se connecter en tant qu'ADMIN
2. Aller sur /admin/applications
3. Trouver la candidature PENDING
4. Cliquer sur "Approuver"
5. Vérifier le changement de status
6. Vérifier l'email d'approbation

❌ Problèmes potentiels:
- Rôle non mis à jour
- Email non envoyé
- Status non changé

✅ Résultat attendu:
- Status changé à APPROVED
- Rôle utilisateur changé à AUTHOR
- Email d'approbation envoyé
- L'utilisateur peut maintenant soumettre des histoires
```

#### 2.3 Rejeter une Candidature (Admin)
```
✅ Étapes:
1. Se connecter en tant qu'ADMIN
2. Aller sur /admin/applications
3. Trouver une candidature PENDING
4. Cliquer sur "Rejeter"
5. Entrer une raison: "Motivation insuffisante"
6. Confirmer le rejet
7. Vérifier l'email de rejet

✅ Résultat attendu:
- Status changé à REJECTED
- Raison enregistrée
- Email de rejet envoyé avec la raison
```

---

### Test 3: Soumission d'Histoire

#### 3.1 Soumettre une Histoire (Auteur)
```
✅ Étapes:
1. Se connecter en tant qu'AUTHOR
2. Aller sur /author/submit
3. Remplir le formulaire:
   - Titre: "Les Chroniques d'Eldoria"
   - Sous-titre: "Tome 1: L'Éveil"
   - Description: "Dans un monde où la magie..."
   - Genres: Fantasy, Aventure
   - Couleur: Violet
4. Ajouter des chapitres:
   - Chapitre 1: "Le Commencement" (500+ mots)
   - Chapitre 2: "La Découverte" (500+ mots)
5. Soumettre pour modération
6. Vérifier l'email de confirmation

❌ Problèmes potentiels:
- Validation échouée (titre trop court, etc.)
- Chapitres non sauvegardés
- Email non envoyé

✅ Résultat attendu:
- Histoire créée avec status PENDING
- Chapitres créés et liés
- StoryStats créé (views: 0, likes: 0, bookmarks: 0)
- Email de modération envoyé
```

#### 3.2 Publier une Histoire (Admin)
```
✅ Étapes:
1. Se connecter en tant qu'ADMIN
2. Aller sur /admin/stories
3. Trouver l'histoire PENDING
4. Cliquer sur "Publier"
5. Vérifier le changement de status
6. Vérifier l'email de publication

✅ Résultat attendu:
- Status changé à PUBLISHED
- publishedAt défini à maintenant
- Email de publication envoyé
- Histoire visible dans /library
```

---

### Test 4: Édition d'Histoire

#### 4.1 Modifier les Informations
```
✅ Étapes:
1. Se connecter en tant qu'AUTHOR
2. Aller sur /author/dashboard
3. Cliquer sur "Éditer" pour une histoire
4. Modifier le titre: "Les Chroniques d'Eldoria - Édition Révisée"
5. Modifier la description
6. Changer la couleur d'accent
7. Cliquer sur "Sauvegarder"
8. Vérifier les modifications

✅ Résultat attendu:
- Modifications sauvegardées
- updatedAt mis à jour
- Message de succès affiché
```

#### 4.2 Ajouter un Chapitre
```
✅ Étapes:
1. Sur la page d'édition
2. Cliquer sur "Ajouter un Chapitre"
3. Remplir:
   - Titre: "Chapitre 3: La Révélation"
   - Contenu: (500+ mots)
   - Ambiance: "Mystérieux"
4. Sauvegarder
5. Vérifier que le chapitre apparaît dans la liste

✅ Résultat attendu:
- Chapitre créé avec number = 3
- readTime calculé automatiquement
- Chapitre visible dans la liste
```

#### 4.3 Modifier un Chapitre
```
✅ Étapes:
1. Sur la page d'édition
2. Cliquer sur "Éditer" pour un chapitre
3. Modifier le titre et le contenu
4. Sauvegarder
5. Vérifier les modifications

✅ Résultat attendu:
- Modifications sauvegardées
- readTime recalculé
- updatedAt mis à jour
```

#### 4.4 Supprimer un Chapitre
```
✅ Étapes:
1. Sur la page d'édition
2. Cliquer sur "Supprimer" pour le chapitre 2
3. Confirmer la suppression
4. Vérifier que le chapitre 3 devient le chapitre 2

✅ Résultat attendu:
- Chapitre supprimé
- Numéros réorganisés automatiquement
- Histoire mise à jour
```

---

### Test 5: Statistiques

#### 5.1 Tracking des Vues
```
✅ Étapes:
1. Ouvrir une histoire publiée
2. Cliquer sur "Commencer la lecture"
3. Attendre 5 secondes sur le chapitre
4. Retourner sur la page de l'histoire
5. Vérifier que le compteur de vues a augmenté
6. Recharger la page
7. Vérifier que la vue n'est pas recomptée

✅ Résultat attendu:
- Vue comptée après 5 secondes
- Une seule vue par session
- Compteur mis à jour en temps réel
```

#### 5.2 Likes
```
✅ Étapes:
1. Ouvrir une histoire publiée
2. Cliquer sur "Aimer"
3. Vérifier que:
   - Le bouton devient rouge
   - L'icône se remplit
   - Le compteur augmente
4. Recharger la page
5. Vérifier que le like est toujours actif
6. Cliquer à nouveau pour retirer le like
7. Vérifier que le compteur diminue

✅ Résultat attendu:
- Like ajouté/retiré correctement
- État persistant (localStorage)
- Compteur mis à jour
- Pas de valeurs négatives
```

#### 5.3 Bookmarks
```
✅ Étapes:
1. Ouvrir une histoire publiée
2. Cliquer sur "Sauvegarder"
3. Vérifier que:
   - Le bouton devient bleu
   - L'icône se remplit
   - Le compteur augmente
4. Recharger la page
5. Vérifier que le bookmark est toujours actif
6. Cliquer à nouveau pour retirer
7. Vérifier que le compteur diminue

✅ Résultat attendu:
- Bookmark ajouté/retiré correctement
- État persistant (localStorage)
- Compteur mis à jour
- Pas de valeurs négatives
```

---

### Test 6: Dashboard Admin

#### 6.1 Statistiques Globales
```
✅ Étapes:
1. Se connecter en tant qu'ADMIN
2. Aller sur /admin/dashboard
3. Vérifier les statistiques:
   - Nombre total d'utilisateurs
   - Nombre d'auteurs
   - Nombre d'histoires
   - Nombre de candidatures en attente

✅ Résultat attendu:
- Statistiques correctes
- Chargement rapide
- Pas d'erreurs
```

#### 6.2 Gestion des Utilisateurs
```
✅ Étapes:
1. Aller sur /admin/users
2. Vérifier la liste des utilisateurs
3. Tester les filtres (VISITOR, AUTHOR, ADMIN)
4. Tester la recherche par nom/email
5. Modifier le rôle d'un utilisateur
6. Suspendre un utilisateur

✅ Résultat attendu:
- Liste complète des utilisateurs
- Filtres fonctionnels
- Recherche fonctionnelle
- Modifications sauvegardées
```

---

### Test 7: Dashboard Auteur

#### 7.1 Statistiques Personnelles
```
✅ Étapes:
1. Se connecter en tant qu'AUTHOR
2. Aller sur /author/dashboard
3. Vérifier les statistiques:
   - Nombre d'histoires
   - Total de vues
   - Total de likes
   - Total de bookmarks

✅ Résultat attendu:
- Statistiques correctes
- Calcul précis des totaux
- Affichage clair
```

#### 7.2 Liste des Histoires
```
✅ Étapes:
1. Sur le dashboard auteur
2. Vérifier la liste des histoires
3. Vérifier les statuts (DRAFT, PENDING, PUBLISHED, REJECTED)
4. Tester les boutons d'action:
   - Éditer
   - Voir
   - Supprimer (si DRAFT)

✅ Résultat attendu:
- Toutes les histoires affichées
- Statuts corrects
- Boutons fonctionnels
```

---

### Test 8: Lecture d'Histoire

#### 8.1 Page de Détails
```
✅ Étapes:
1. Aller sur /library
2. Cliquer sur une histoire
3. Vérifier l'affichage:
   - Titre, sous-titre, description
   - Informations auteur
   - Genres
   - Statistiques (vues, likes, bookmarks)
   - Liste des chapitres
4. Tester les boutons like/bookmark

✅ Résultat attendu:
- Toutes les informations affichées
- Design attrayant
- Boutons fonctionnels
```

#### 8.2 Lecteur de Chapitres
```
✅ Étapes:
1. Cliquer sur "Commencer la lecture"
2. Vérifier l'affichage:
   - Titre du chapitre
   - Contenu formaté
   - Boutons de navigation
3. Tester la navigation:
   - Chapitre suivant
   - Chapitre précédent
   - Retour à l'histoire
4. Vérifier le tracking de vue après 5 secondes

✅ Résultat attendu:
- Contenu lisible
- Navigation fluide
- Tracking fonctionnel
```

---

## 📱 TESTS RESPONSIVE

### Test 9: Mobile (375px)

#### 9.1 Navigation
```
✅ Étapes:
1. Ouvrir DevTools (F12)
2. Activer le mode responsive
3. Sélectionner iPhone SE (375px)
4. Tester la navigation:
   - Menu hamburger
   - Liens de navigation
   - Boutons

✅ Résultat attendu:
- Menu hamburger fonctionnel
- Navigation accessible
- Pas de débordement horizontal
```

#### 9.2 Pages Principales
```
✅ Pages à tester:
- / (Accueil)
- /library (Bibliothèque)
- /stories/[id] (Détails histoire)
- /stories/[id]/chapter/[number] (Lecteur)
- /author/dashboard (Dashboard auteur)
- /admin/dashboard (Dashboard admin)

✅ Résultat attendu:
- Toutes les pages responsive
- Texte lisible
- Boutons accessibles
- Images adaptées
```

---

### Test 10: Tablette (768px)

#### 10.1 Layout
```
✅ Étapes:
1. Sélectionner iPad (768px)
2. Vérifier le layout:
   - Grilles de cartes (2 colonnes)
   - Sidebar (si présent)
   - Formulaires

✅ Résultat attendu:
- Layout adapté
- Espacement correct
- Lisibilité optimale
```

---

### Test 11: Desktop (1920px)

#### 11.1 Layout Large
```
✅ Étapes:
1. Sélectionner Desktop (1920px)
2. Vérifier:
   - Largeur maximale des conteneurs
   - Espacement généreux
   - Grilles de cartes (3-4 colonnes)

✅ Résultat attendu:
- Pas de contenu étiré
- Espacement harmonieux
- Design équilibré
```

---

## ⚡ TESTS DE PERFORMANCE

### Test 12: Lighthouse Audit

#### 12.1 Performance
```
✅ Étapes:
1. Ouvrir Chrome DevTools
2. Aller dans l'onglet Lighthouse
3. Sélectionner:
   - Mode: Desktop
   - Catégories: Performance, Accessibility, Best Practices, SEO
4. Cliquer sur "Analyze page load"
5. Attendre les résultats

✅ Objectifs:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

❌ Problèmes courants:
- Images non optimisées
- JavaScript trop lourd
- Fonts non optimisées
- Pas de cache
```

#### 12.2 Pages à Auditer
```
✅ Pages prioritaires:
1. / (Accueil)
2. /library (Bibliothèque)
3. /stories/[id] (Détails)
4. /stories/[id]/chapter/[number] (Lecteur)

✅ Résultat attendu:
- Toutes les pages > 90 en performance
- Temps de chargement < 3 secondes
- First Contentful Paint < 1.5s
```

---

### Test 13: Temps de Réponse API

#### 13.1 Endpoints Critiques
```
✅ Endpoints à tester:
- GET /api/stories (liste)
- GET /api/stories/[id] (détails)
- POST /api/stories/[id]/view (tracking)
- POST /api/stories/[id]/like (like)
- GET /api/admin/stats (statistiques)

✅ Objectif:
- Temps de réponse < 500ms
- Pas d'erreurs 500
- Gestion correcte des erreurs

🔧 Outil:
- Chrome DevTools > Network
- Ou Postman
```

---

## ♿ TESTS D'ACCESSIBILITÉ

### Test 14: Navigation au Clavier

#### 14.1 Tab Navigation
```
✅ Étapes:
1. Ouvrir la page d'accueil
2. Appuyer sur Tab pour naviguer
3. Vérifier:
   - Tous les éléments interactifs sont accessibles
   - L'ordre de tabulation est logique
   - Le focus est visible

✅ Résultat attendu:
- Navigation fluide au clavier
- Focus visible (outline)
- Ordre logique
```

#### 14.2 Raccourcis Clavier
```
✅ Raccourcis à tester:
- Enter: Activer un bouton/lien
- Espace: Activer un bouton
- Escape: Fermer un modal
- Arrow keys: Navigation dans les listes

✅ Résultat attendu:
- Tous les raccourcis fonctionnels
- Comportement intuitif
```

---

### Test 15: Contraste des Couleurs

#### 15.1 Vérification WCAG
```
✅ Étapes:
1. Installer l'extension "WAVE" ou "axe DevTools"
2. Analyser les pages
3. Vérifier les ratios de contraste:
   - Texte normal: minimum 4.5:1
   - Texte large: minimum 3:1

✅ Résultat attendu:
- Tous les textes respectent WCAG AA
- Pas d'avertissements de contraste
```

---

### Test 16: Lecteur d'Écran

#### 16.1 NVDA / JAWS (Windows)
```
✅ Étapes:
1. Installer NVDA (gratuit)
2. Activer le lecteur d'écran
3. Naviguer sur le site
4. Vérifier:
   - Les titres sont annoncés
   - Les liens sont descriptifs
   - Les images ont des alt text
   - Les formulaires sont labellisés

✅ Résultat attendu:
- Navigation fluide
- Contenu compréhensible
- Pas d'éléments manquants
```

---

## 🔒 TESTS DE SÉCURITÉ

### Test 17: Authentification

#### 17.1 Protection des Routes
```
✅ Routes à tester:
- /author/* (nécessite AUTHOR)
- /admin/* (nécessite ADMIN)
- /api/author/* (nécessite AUTHOR)
- /api/admin/* (nécessite ADMIN)

✅ Étapes:
1. Se déconnecter
2. Essayer d'accéder aux routes protégées
3. Vérifier la redirection vers /api/auth/signin

✅ Résultat attendu:
- Redirection automatique
- Pas d'accès non autorisé
- Message d'erreur clair
```

---

### Test 18: Validation des Données

#### 18.1 Formulaires
```
✅ Formulaires à tester:
- Candidature auteur
- Soumission d'histoire
- Édition de chapitre

✅ Tests:
1. Soumettre avec des champs vides
2. Soumettre avec des données invalides
3. Soumettre avec des données trop longues
4. Essayer d'injecter du HTML/JavaScript

✅ Résultat attendu:
- Validation côté client
- Validation côté serveur
- Messages d'erreur clairs
- Pas d'injection possible
```

---

### Test 19: Permissions

#### 19.1 Édition d'Histoire
```
✅ Étapes:
1. Se connecter en tant qu'AUTHOR A
2. Créer une histoire
3. Se déconnecter
4. Se connecter en tant qu'AUTHOR B
5. Essayer d'éditer l'histoire de A

✅ Résultat attendu:
- Erreur 403 Forbidden
- Message: "Vous n'êtes pas l'auteur"
- Pas d'accès aux données
```

---

## ✅ CHECKLIST FINALE

### Fonctionnalités
- [ ] ✅ Authentification GitHub
- [ ] ✅ Système d'auteur (candidature, approbation, rejet)
- [ ] ✅ Soumission d'histoires
- [ ] ✅ Modération d'histoires (admin)
- [ ] ✅ Édition d'histoires (auteur)
- [ ] ✅ Gestion des chapitres (CRUD)
- [ ] ✅ Tracking des vues
- [ ] ✅ Système de likes
- [ ] ✅ Système de bookmarks
- [ ] ✅ Dashboard admin
- [ ] ✅ Dashboard auteur
- [ ] ✅ Lecteur de chapitres
- [ ] ✅ Emails automatiques

### Performance
- [ ] ✅ Lighthouse score > 90
- [ ] ✅ Temps de chargement < 3s
- [ ] ✅ API response time < 500ms
- [ ] ✅ Images optimisées
- [ ] ✅ Fonts optimisées

### Responsive
- [ ] ✅ Mobile (375px)
- [ ] ✅ Tablette (768px)
- [ ] ✅ Desktop (1920px)
- [ ] ✅ Pas de débordement horizontal
- [ ] ✅ Texte lisible sur tous les écrans

### Accessibilité
- [ ] ✅ Navigation au clavier
- [ ] ✅ Contraste WCAG AA
- [ ] ✅ Alt text sur les images
- [ ] ✅ Labels sur les formulaires
- [ ] ✅ Focus visible
- [ ] ✅ Lecteur d'écran compatible

### Sécurité
- [ ] ✅ Routes protégées
- [ ] ✅ Validation des données
- [ ] ✅ Permissions vérifiées
- [ ] ✅ Pas d'injection SQL/XSS
- [ ] ✅ HTTPS (en production)

### Emails
- [ ] ✅ Candidature reçue
- [ ] ✅ Candidature approuvée
- [ ] ✅ Candidature rejetée
- [ ] ✅ Histoire publiée
- [ ] ✅ Histoire en modération
- [ ] ✅ Histoire rejetée

---

## 🐛 BUGS CONNUS

### À Corriger
```
1. [ ] ...
2. [ ] ...
3. [ ] ...
```

### Améliorations Futures
```
1. [ ] Recherche et filtres
2. [ ] Profil utilisateur
3. [ ] Rate limiting
4. [ ] Pages d'erreur personnalisées
5. [ ] Tests automatisés
```

---

## 📊 RÉSULTATS DES TESTS

### Date: ___________

#### Fonctionnalités
- Tests réussis: _____ / _____
- Tests échoués: _____
- Bugs trouvés: _____

#### Performance
- Lighthouse Performance: _____
- Lighthouse Accessibility: _____
- Lighthouse Best Practices: _____
- Lighthouse SEO: _____

#### Responsive
- Mobile: ✅ / ❌
- Tablette: ✅ / ❌
- Desktop: ✅ / ❌

#### Accessibilité
- Navigation clavier: ✅ / ❌
- Contraste: ✅ / ❌
- Lecteur d'écran: ✅ / ❌

#### Sécurité
- Authentification: ✅ / ❌
- Validation: ✅ / ❌
- Permissions: ✅ / ❌

---

## 🎯 CONCLUSION

**Statut global:** ⏳ En cours / ✅ Validé / ❌ Échec

**Prêt pour la production:** ✅ Oui / ❌ Non

**Prochaines étapes:**
1. ...
2. ...
3. ...

---

**Testeur:** ___________  
**Date:** ___________  
**Signature:** ___________

