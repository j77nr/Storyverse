# ✅ CHECKLIST DE TEST - StoryVerse

**Date:** 29 Mai 2026  
**Objectif:** Vérifier que toutes les fonctionnalités de la Phase 1 fonctionnent

---

## 🚀 DÉMARRAGE

### 1. Préparer la Base de Données
```bash
# Si pas déjà fait, lancer le seed
npm run db:seed
```

**Résultat attendu:**
```
✅ Auteur créé: Sophie Laurent
✅ Histoire créée: Échos du Futur
✅ Chapitres créés: 3
✅ Statistiques créées
✅ Histoire 2 créée: Murmures dans l'Ombre
```

### 2. Démarrer le Serveur
```bash
npm run dev
```

**Résultat attendu:**
```
✓ Ready in 2s
○ Local: http://localhost:3000
```

---

## 📋 TESTS FONCTIONNELS

### ✅ Test 1: Page d'Accueil
**URL:** http://localhost:3000

**À vérifier:**
- [ ] La page se charge sans erreur
- [ ] Les histoires featured s'affichent (Échos du Futur)
- [ ] Les images se chargent
- [ ] Le bouton "Commencer la lecture" fonctionne
- [ ] Pas d'erreur dans la console

**Résultat:** ✅ / ❌

---

### ✅ Test 2: Page de Détails d'Histoire
**URL:** http://localhost:3000/stories/echoes-of-tomorrow

**À vérifier:**
- [ ] La page se charge sans erreur
- [ ] Le titre "Échos du Futur" s'affiche
- [ ] Les statistiques s'affichent (vues, likes, bookmarks)
- [ ] Les boutons "Aimer" et "Sauvegarder" fonctionnent
- [ ] La liste des 3 chapitres s'affiche
- [ ] Les informations de l'auteur s'affichent
- [ ] Pas d'erreur dans la console

**Actions à tester:**
1. Cliquer sur "Aimer" → Le bouton devient rouge
2. Recharger la page → Le like est toujours actif
3. Cliquer sur "Sauvegarder" → Le bouton devient bleu
4. Recharger la page → Le bookmark est toujours actif

**Résultat:** ✅ / ❌

---

### ✅ Test 3: Lecteur de Chapitres
**URL:** http://localhost:3000/stories/echoes-of-tomorrow/chapter/1

**À vérifier:**
- [ ] La page se charge sans erreur
- [ ] Le titre du chapitre s'affiche
- [ ] Le contenu du chapitre s'affiche
- [ ] Les boutons de navigation s'affichent
- [ ] Le bouton "Chapitre suivant" fonctionne
- [ ] Après 5 secondes, la vue est comptée (vérifier dans les stats)
- [ ] Pas d'erreur dans la console

**Actions à tester:**
1. Attendre 5 secondes sur la page
2. Retourner sur la page de détails
3. Vérifier que le compteur de vues a augmenté
4. Cliquer sur "Chapitre suivant"
5. Vérifier que le chapitre 2 se charge

**Résultat:** ✅ / ❌

---

### ✅ Test 4: Page 404 (Histoire Inexistante)
**URL:** http://localhost:3000/stories/invalid-id

**À vérifier:**
- [ ] La page 404 personnalisée s'affiche
- [ ] Le message "Histoire non trouvée" s'affiche
- [ ] Les boutons de retour fonctionnent
- [ ] Pas d'erreur dans la console

**Résultat:** ✅ / ❌

---

### ✅ Test 5: Page 404 (Chapitre Inexistant)
**URL:** http://localhost:3000/stories/echoes-of-tomorrow/chapter/999

**À vérifier:**
- [ ] La page 404 personnalisée s'affiche
- [ ] Le message "Chapitre non trouvé" s'affiche
- [ ] Les boutons de retour fonctionnent
- [ ] Pas d'erreur dans la console

**Résultat:** ✅ / ❌

---

### ✅ Test 6: Authentification
**URL:** http://localhost:3000

**À vérifier:**
- [ ] Le bouton "Se connecter" s'affiche
- [ ] Cliquer sur "Se connecter" redirige vers la page d'auth
- [ ] Connexion avec GitHub fonctionne
- [ ] Après connexion, le nom d'utilisateur s'affiche
- [ ] Le menu utilisateur fonctionne

**Résultat:** ✅ / ❌

---

### ✅ Test 7: Dashboard Auteur
**URL:** http://localhost:3000/author/dashboard

**Prérequis:** Être connecté en tant qu'AUTHOR

**À vérifier:**
- [ ] La page se charge sans erreur
- [ ] Les statistiques s'affichent
- [ ] La liste des histoires s'affiche
- [ ] Le bouton "Éditer" fonctionne
- [ ] Le bouton "Nouvelle Histoire" fonctionne
- [ ] Pas d'erreur dans la console

**Résultat:** ✅ / ❌

---

### ✅ Test 8: Édition d'Histoire
**URL:** http://localhost:3000/author/stories/[id]/edit

**Prérequis:** Être connecté en tant qu'AUTHOR

**À vérifier:**
- [ ] La page se charge sans erreur
- [ ] Le formulaire d'édition s'affiche
- [ ] La liste des chapitres s'affiche
- [ ] Le bouton "Éditer" un chapitre ouvre le modal
- [ ] Les modifications sont sauvegardées
- [ ] Le bouton "Ajouter un chapitre" fonctionne
- [ ] Pas d'erreur dans la console

**Actions à tester:**
1. Modifier le titre de l'histoire
2. Cliquer sur "Sauvegarder"
3. Vérifier que les modifications sont enregistrées
4. Éditer un chapitre
5. Modifier le contenu
6. Sauvegarder
7. Vérifier que les modifications sont enregistrées

**Résultat:** ✅ / ❌

---

### ✅ Test 9: Dashboard Admin
**URL:** http://localhost:3000/admin/dashboard

**Prérequis:** Être connecté en tant qu'ADMIN

**À vérifier:**
- [ ] La page se charge sans erreur
- [ ] Les statistiques globales s'affichent
- [ ] Les cartes de navigation fonctionnent
- [ ] Pas d'erreur dans la console

**Résultat:** ✅ / ❌

---

### ✅ Test 10: Gestion des Candidatures (Admin)
**URL:** http://localhost:3000/admin/applications

**Prérequis:** Être connecté en tant qu'ADMIN

**À vérifier:**
- [ ] La page se charge sans erreur
- [ ] La liste des candidatures s'affiche
- [ ] Les boutons "Approuver" et "Rejeter" fonctionnent
- [ ] Les emails sont envoyés (vérifier les logs)
- [ ] Pas d'erreur dans la console

**Résultat:** ✅ / ❌

---

### ✅ Test 11: Statistiques en Temps Réel
**Test:** Vérifier que les statistiques se mettent à jour

**Actions:**
1. Ouvrir une histoire dans un onglet
2. Cliquer sur "Aimer"
3. Ouvrir la même histoire dans un autre onglet
4. Recharger la page
5. Vérifier que le compteur de likes a augmenté

**À vérifier:**
- [ ] Les likes se mettent à jour
- [ ] Les bookmarks se mettent à jour
- [ ] Les vues se mettent à jour
- [ ] Pas de valeurs négatives

**Résultat:** ✅ / ❌

---

### ✅ Test 12: Emails
**Test:** Vérifier que les emails sont envoyés

**Actions:**
1. Soumettre une candidature auteur
2. Vérifier les logs de la console
3. Chercher "Email envoyé" ou "Email error"

**À vérifier:**
- [ ] Email de confirmation de candidature
- [ ] Email d'approbation (si approuvé)
- [ ] Email de rejet (si rejeté)
- [ ] Email de publication d'histoire

**Note:** Si RESEND_API_KEY n'est pas configuré, les emails sont loggés dans la console.

**Résultat:** ✅ / ❌

---

## 🐛 BUGS TROUVÉS

### Bug 1
**Description:**
**Page:**
**Étapes pour reproduire:**
**Résultat attendu:**
**Résultat obtenu:**

### Bug 2
**Description:**
**Page:**
**Étapes pour reproduire:**
**Résultat attendu:**
**Résultat obtenu:**

---

## 📊 RÉSUMÉ DES TESTS

**Tests réussis:** _____ / 12  
**Tests échoués:** _____  
**Bugs trouvés:** _____

**Statut global:** ✅ Tout fonctionne / ⚠️ Quelques bugs / ❌ Problèmes majeurs

---

## 🎯 PROCHAINES ÉTAPES

Si tous les tests passent:
- [ ] ✅ Phase 1 validée
- [ ] 🚀 Prêt pour la Phase 2

Si des bugs sont trouvés:
- [ ] 🐛 Corriger les bugs
- [ ] 🔄 Retester
- [ ] ✅ Valider les corrections

---

**Testeur:** ___________  
**Date:** ___________  
**Durée des tests:** ___________

