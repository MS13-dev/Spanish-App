import { Level, Deck, Card } from '@/lib/types';
import { a1Decks } from './a1';
import { a1DecksPart2 } from './a1b';
import { a2Decks } from './a2';

/**
 * Tous les niveaux de l'application.
 * A1 est complet (~88 cartes). Les niveaux A2 → C2 sont déclarés
 * mais leurs decks seront remplis dans les prochaines PR (objectif 500+ cartes).
 */
export const levels: Level[] = [
  {
    id: 'A1',
    title: 'A1 — Débutant',
    subtitle: 'Les premiers mots et expressions',
    decks: [...a1Decks, ...a1DecksPart2],
  },
  {
    id: 'A2',
    title: 'A2 — Élémentaire',
    subtitle: 'La vie quotidienne',
    decks: a2Decks,
  },
  { id: 'B1', title: 'B1 — Intermédiaire', subtitle: 'Bientôt disponible', decks: [] },
  { id: 'B2', title: 'B2 — Avancé', subtitle: 'Bientôt disponible', decks: [] },
  { id: 'C1', title: 'C1 — Autonome', subtitle: 'Bientôt disponible', decks: [] },
  { id: 'C2', title: 'C2 — Maîtrise', subtitle: 'Bientôt disponible', decks: [] },
];

export function getLevel(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}

export function getDeck(levelId: string, deckId: string): Deck | undefined {
  return getLevel(levelId)?.decks.find((d) => d.id === deckId);
}

/**
 * Toutes les cartes d'un niveau, tous thèmes confondus.
 * Les thèmes restent organisés dans les fichiers de données (pour faciliter
 * l'enrichissement), mais l'app les présente comme un seul lot.
 */
export function getLevelCards(levelId: string): Card[] {
  return getLevel(levelId)?.decks.flatMap((d) => d.cards) ?? [];
}

/** Tous les ids de cartes d'un niveau (pour compter dues/apprises). */
export function levelCardIds(level: Level): string[] {
  return level.decks.flatMap((d) => d.cards.map((c) => c.id));
}

/** Toutes les cartes de l'application, tous niveaux confondus. */
export function allCards(): Card[] {
  return levels.flatMap((l) => l.decks.flatMap((d) => d.cards));
}

const byId = new Map<string, Card>(allCards().map((c) => [c.id, c]));

/** Retrouve une carte par son id. */
export function getCardById(id: string): Card | undefined {
  return byId.get(id);
}
