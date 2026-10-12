# Icônes PWA - StoryVerse

Ce répertoire contient les icônes de l'application PWA (Progressive Web App).

## Icônes Requises

Les fichiers suivants doivent être générés :

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png` (maskable)
- `icon-384x384.png`
- `icon-512x512.png` (maskable)

## Design

### Couleurs
- **Background** : `#0a0a0a` (noir foncé)
- **Theme/Accent** : `#8b5cf6` (violet)

### Logo
Le logo StoryVerse est un 'S' stylisé en violet sur fond sombre.

## Comment Générer les Icônes

### Option 1 : RealFaviconGenerator (Recommandé)
1. Aller sur https://realfavicongenerator.net
2. Upload votre logo (SVG ou PNG haute résolution, minimum 512x512)
3. Configurer :
   - **iOS** : Activer
   - **Android** : Activer, theme color `#8b5cf6`
   - **Background color** : `#0a0a0a`
4. Générer et télécharger
5. Extraire les fichiers PNG dans ce répertoire

### Option 2 : Figma/Photoshop
1. Créer un carré de 512x512px avec fond `#0a0a0a`
2. Dessiner/importer le logo 'S' en violet `#8b5cf6`
3. Exporter en PNG à 512x512, 384x384, 192x192, 152x152, 144x144, 128x128, 96x96, 72x72

### Option 3 : PWA Asset Generator (CLI)
```bash
npm install -g pwa-asset-generator
pwa-asset-generator logo.svg ./icons --background "#0a0a0a" --icon-only
```

## Maskable Icons

Les icônes "maskable" (192x192 et 512x512) doivent avoir une zone de sécurité :
- Le contenu important doit rester dans les **80% centraux** de l'image
- Les 10% de chaque bord peuvent être coupés par certains systèmes

Tester sur : https://maskable.app/editor

## Vérification

Une fois les icônes générées, vérifier dans Chrome DevTools :
1. Ouvrir l'app : http://localhost:3000
2. DevTools → Application → Manifest
3. Confirmer que toutes les icônes s'affichent
4. Tester "Add to Home Screen"

## Statut

❌ **Icônes non générées** - Ce répertoire contient uniquement ce README.

Les icônes doivent être créées manuellement avant le déploiement en production.
