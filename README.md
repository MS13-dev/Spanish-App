# 🇪🇸 Spanish App

Une application mobile de révision de l'espagnol, inspirée d'Anki, avec des graphismes soignés et une expérience fluide pensée pour apprendre chaque jour.

---

## Vision

L'objectif est de créer **la meilleure app mobile pour apprendre l'espagnol** — pas une appli générique de flashcards, mais une expérience visuelle et gamifiée qui donne envie de revenir chaque jour.

Inspirations principales :
- **AnkiApp** — système de répétition espacée (SRS) éprouvé
- **Duolingo** — gamification et progression motivante
- **Drops** — graphismes épurés et animations fluides

---

## Fonctionnalités prévues

### Révision intelligente
- Algorithme de répétition espacée (SM-2 ou FSRS)
- Cartes personnalisables : mot, phrase, image, audio
- Statistiques de progression détaillées

### Expérience visuelle
- Animations de flip de cartes fluides
- Thèmes visuels (clair, sombre, couleurs vives)
- Illustrations et icônes cohérentes
- Transitions entre écrans soignées

### Contenu
- Decks préconstruits par niveau (A1 → C2)
- Vocabulaire thématique (voyage, cuisine, travail…)
- Conjugaisons et fiches de grammaire
- Prononciation audio native

### Mobile-first
- Application React Native (iOS + Android)
- Mode hors-ligne complet
- Notifications de rappel personnalisables
- Synchronisation entre appareils

---

## Stack technique envisagée

| Couche | Technologie |
|---|---|
| Mobile | React Native + Expo |
| UI | NativeWind + Reanimated 3 |
| État | Zustand |
| Base de données locale | SQLite (via Expo SQLite) |
| Backend (optionnel) | Supabase |
| Audio | Expo AV |

---

## Structure du projet

```
spanish-app/
├── app/                  # Écrans (Expo Router)
│   ├── _layout.tsx       # Layout racine + store global
│   ├── index.tsx         # Accueil : profil, série, objectif, niveaux
│   ├── level/[id].tsx    # Lancement d'une session
│   ├── review/[level].tsx# Session de révision (flashcards)
│   ├── progression.tsx   # Stats & maîtrise par niveau
│   ├── difficiles.tsx    # Cartes les plus ratées
│   ├── reglages.tsx      # Réglages (cartes/jour, objectif, sens, audio…)
│   ├── profils.tsx       # Profils (plusieurs utilisateurs)
│   ├── sauvegarde.tsx    # Export / import de la progression
│   └── +html.tsx         # Coquille HTML web (PWA)
├── components/           # Flashcard, boutons, barre de progression, encouragement
├── lib/                  # Thème, types, SRS (SM-2), planificateur, stats, audio…
├── data/                 # Niveaux et cartes (a1, a1b, a2…)
├── store/app.tsx         # État global (profils, progression, stats)
├── public/               # Manifest PWA, service worker, icônes
└── __tests__/            # Tests unitaires (SRS, planificateur, stats, sauvegarde)
```

## Fonctionnalités

- ✅ Application Expo (React Native + TypeScript, Expo Router), web + mobile
- ✅ **Répétition espacée SM-2** : file du jour (dues + nouvelles cartes limitées/jour)
- ✅ **Reprise des erreurs** en fin de session (en boucle jusqu'à validation)
- ✅ **Sens configurable** ES→FR / FR→ES / mixte (états SRS séparés)
- ✅ **Profils multiples** (chacun sa progression), changement instantané
- ✅ **Prononciation audio** espagnole (synthèse vocale du navigateur, gratuite)
- ✅ **Progression & stats** : maîtrise par niveau, série (streak), objectif quotidien, taux de réussite
- ✅ **Cartes difficiles** : les mots les plus ratés, tous niveaux
- ✅ **Sauvegarde / restauration** dans un fichier (filet de sécurité)
- ✅ **PWA** : installable « sur l'écran d'accueil », utilisable hors-ligne
- ✅ **Accessibilité** : taille de texte ajustable, gros boutons, interface en français
- ✅ **Niveaux A1 (~88 cartes) et A2 (~55 cartes)** complets ; A2→C2 en cours

---

## Démarrage rapide

```bash
git clone https://github.com/MS13-dev/Spanish-App.git
cd Spanish-App
npm install
npx expo start          # mobile : scanner le QR code avec Expo Go
npx expo start --web    # navigateur
npm test                # tests unitaires
```

---

## Déploiement web (Vercel)

L'app web est un export statique. Pour la mettre en ligne avec une URL partageable :

1. Crée un compte sur [vercel.com](https://vercel.com) (connexion avec GitHub).
2. **Add New Project** → choisis le dépôt `MS13-dev/Spanish-App`.
3. Vercel détecte `vercel.json` (build : `npx expo export --platform web`, sortie : `dist`).
4. **Deploy** → tu obtiens une URL type `spanish-app.vercel.app`.

À chaque fusion sur `main`, Vercel redéploie automatiquement. L'URL en HTTPS permet
l'installation PWA (« Ajouter à l'écran d'accueil ») et le fonctionnement hors-ligne.

---

## Contribuer

Ce projet est en cours de démarrage. Les contributions sont les bienvenues une fois la base posée.

---

## Licence

MIT
