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

## Structure du projet (à venir)

```
spanish-app/
├── app/              # Écrans (Expo Router)
├── components/       # Composants réutilisables
├── assets/           # Images, polices, sons
├── lib/              # Logique SRS, utilitaires
├── data/             # Decks de vocabulaire
└── store/            # État global (Zustand)
```

---

## Démarrage rapide

> La configuration initiale sera ajoutée au fur et à mesure du développement.

```bash
git clone https://github.com/MS13-dev/Spanish-App.git
cd Spanish-App
npm install
npx expo start
```

---

## Contribuer

Ce projet est en cours de démarrage. Les contributions sont les bienvenues une fois la base posée.

---

## Licence

MIT
