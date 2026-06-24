import { Card, CardProgress, Direction, DirectionSetting, ProgressMap } from './types';
import { isDue } from './srs';
import { srsKey, resolveDirection } from './srskey';

export const MASTERY_DAYS = 21;

export interface QueueItem {
  card: Card;
  direction: Direction;
}

/** Mélange une copie (Fisher-Yates). */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function seen(p: CardProgress | undefined): boolean {
  return !!p && p.lastReviewed > 0;
}

export interface BuildOptions {
  direction: DirectionSetting;
  newCardsPerDay: number;
  newIntroducedToday: number;
  reviewAll: boolean;
  now?: number;
}

/**
 * Construit la file de révision du jour pour un ensemble de cartes :
 * - cartes DUES (déjà vues, échéance passée)
 * - + un nombre limité de NOUVELLES cartes (budget = limite/jour − déjà introduites aujourd'hui)
 * En mode "tout revoir", toutes les cartes sont incluses.
 * Le tout est mélangé.
 */
export function buildQueue(
  cards: Card[],
  progress: ProgressMap,
  opts: BuildOptions
): QueueItem[] {
  const now = opts.now ?? Date.now();

  if (opts.reviewAll) {
    return shuffle(
      cards.map((card) => ({ card, direction: resolveDirection(opts.direction, card.id) }))
    );
  }

  const due: QueueItem[] = [];
  const fresh: QueueItem[] = [];

  for (const card of cards) {
    const direction = resolveDirection(opts.direction, card.id);
    const p = progress[srsKey(card.id, direction)];
    if (seen(p)) {
      if (isDue(p, now)) due.push({ card, direction });
    } else {
      fresh.push({ card, direction });
    }
  }

  const budget = Math.max(0, opts.newCardsPerDay - opts.newIntroducedToday);
  const chosenNew = shuffle(fresh).slice(0, budget);

  return shuffle([...due, ...chosenNew]);
}

/** Une carte est-elle considérée comme NOUVELLE (jamais révisée) dans ce sens ? */
export function isNewCard(
  cardId: string,
  direction: DirectionSetting,
  progress: ProgressMap
): boolean {
  const dir = resolveDirection(direction, cardId);
  return !seen(progress[srsKey(cardId, dir)]);
}

export interface Counts {
  total: number;
  /** Cartes déjà vues dont l'échéance est passée. */
  due: number;
  /** Cartes jamais vues. */
  fresh: number;
  /** Cartes déjà vues au moins une fois. */
  learned: number;
  /** Cartes en mémoire long terme (intervalle ≥ 21 jours). */
  mastered: number;
}

/** Compteurs détaillés pour un ensemble d'ids, selon le sens de révision. */
export function countCards(
  cardIds: string[],
  direction: DirectionSetting,
  progress: ProgressMap,
  now = Date.now()
): Counts {
  let due = 0;
  let fresh = 0;
  let learned = 0;
  let mastered = 0;
  for (const id of cardIds) {
    const dir = resolveDirection(direction, id);
    const p = progress[srsKey(id, dir)];
    if (seen(p)) {
      learned += 1;
      if (isDue(p, now)) due += 1;
      if ((p as CardProgress).interval >= MASTERY_DAYS) mastered += 1;
    } else {
      fresh += 1;
    }
  }
  return { total: cardIds.length, due, fresh, learned, mastered };
}

/** Nombre de cartes réellement proposées aujourd'hui (dues + nouvelles autorisées). */
export function todayCount(
  counts: Counts,
  newCardsPerDay: number,
  newIntroducedToday: number
): number {
  const budget = Math.max(0, newCardsPerDay - newIntroducedToday);
  return counts.due + Math.min(budget, counts.fresh);
}
