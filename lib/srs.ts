import { CardProgress, Grade } from './types';

const DAY = 24 * 60 * 60 * 1000;

/** Progression initiale d'une carte jamais révisée. */
export function initialProgress(): CardProgress {
  return {
    ease: 2.5,
    interval: 0,
    reps: 0,
    due: 0,
    lastReviewed: 0,
  };
}

/**
 * Applique l'algorithme SM-2 (inspiré d'Anki/SuperMemo).
 * Renvoie une NOUVELLE progression sans muter l'entrée.
 *
 * - "again" : échec, on repart à zéro (revue dans ~1 min).
 * - "hard"  : réussi mais difficile, intervalle réduit.
 * - "good"  : réussi normalement.
 * - "easy"  : réussi facilement, bonus d'intervalle.
 */
export function review(prev: CardProgress, grade: Grade, now = Date.now()): CardProgress {
  let { ease, interval, reps } = prev;

  // Ajustement du facteur de facilité.
  const easeDelta: Record<Grade, number> = {
    again: -0.2,
    hard: -0.15,
    good: 0,
    easy: 0.15,
  };
  ease = Math.max(1.3, ease + easeDelta[grade]);

  if (grade === 'again') {
    reps = 0;
    interval = 0; // sera revu dans la même session (échéance immédiate)
    return { ease, interval, reps, due: now + 60 * 1000, lastReviewed: now };
  }

  reps += 1;

  if (reps === 1) {
    interval = grade === 'easy' ? 2 : 1;
  } else if (reps === 2) {
    interval = grade === 'easy' ? 5 : 3;
  } else {
    const factor = grade === 'hard' ? 1.2 : ease;
    interval = Math.round(interval * factor);
    if (grade === 'easy') interval = Math.round(interval * 1.3);
  }

  interval = Math.max(1, interval);
  return { ease, interval, reps, due: now + interval * DAY, lastReviewed: now };
}

/** Une carte est due si elle n'a jamais été vue ou si son échéance est passée. */
export function isDue(p: CardProgress | undefined, now = Date.now()): boolean {
  if (!p || p.lastReviewed === 0) return true;
  return p.due <= now;
}

/** Formate un intervalle (jours) en libellé court pour l'UI. */
export function formatInterval(grade: Grade, p: CardProgress | undefined): string {
  const base = p ?? initialProgress();
  const next = review(base, grade);
  if (grade === 'again') return '< 1 min';
  if (next.interval < 1) return '< 1 j';
  if (next.interval === 1) return '1 j';
  if (next.interval < 30) return `${next.interval} j`;
  const months = Math.round(next.interval / 30);
  return months <= 1 ? '1 mois' : `${months} mois`;
}
