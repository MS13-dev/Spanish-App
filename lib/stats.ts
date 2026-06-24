import { Streak, DailyLog } from './types';
import { daysBetween } from './dates';

/**
 * Met à jour la série (streak) après une activité un jour donné.
 * - même jour : inchangé
 * - lendemain : +1
 * - trou : repart à 1
 */
export function bumpStreak(s: Streak, today: string): Streak {
  if (s.lastActiveDate === today) return s;
  const diff = s.lastActiveDate ? daysBetween(s.lastActiveDate, today) : Infinity;
  const current = diff === 1 ? s.current + 1 : 1;
  return { current, longest: Math.max(s.longest, current), lastActiveDate: today };
}

/** Si la série a été interrompue (dernier jour actif ni aujourd'hui ni hier), elle vaut 0. */
export function effectiveStreak(s: Streak, today: string): number {
  if (!s.lastActiveDate) return 0;
  const diff = daysBetween(s.lastActiveDate, today);
  return diff <= 0 || diff === 1 ? s.current : 0;
}

/** Ajoute des révisions au journal du jour (crée l'entrée si besoin). */
export function addToLog(
  logs: DailyLog[],
  today: string,
  reviewed: number,
  correct: number
): DailyLog[] {
  const existing = logs.find((l) => l.date === today);
  if (existing) {
    return logs.map((l) =>
      l.date === today
        ? { ...l, reviewed: l.reviewed + reviewed, correct: l.correct + correct }
        : l
    );
  }
  // Garde au plus 90 jours d'historique.
  return [...logs, { date: today, reviewed, correct }].slice(-90);
}

export function todayLog(logs: DailyLog[], today: string): DailyLog {
  return logs.find((l) => l.date === today) ?? { date: today, reviewed: 0, correct: 0 };
}

/** Taux de réussite sur les N derniers jours (null si aucune révision). */
export function successRate(logs: DailyLog[], days: number, today: string): number | null {
  let reviewed = 0;
  let correct = 0;
  for (const l of logs) {
    const age = daysBetween(l.date, today);
    if (age >= 0 && age < days) {
      reviewed += l.reviewed;
      correct += l.correct;
    }
  }
  if (reviewed === 0) return null;
  return correct / reviewed;
}
