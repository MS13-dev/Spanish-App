import { Direction, DirectionSetting } from './types';

/** Clé de stockage SRS : un état distinct par carte ET par sens de révision. */
export function srsKey(cardId: string, direction: Direction): string {
  return `${cardId}:${direction}`;
}

/** Hash stable et simple d'une chaîne (pour répartir les sens en mode "mixte"). */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Sens effectif d'une carte selon le réglage.
 * En mode "mixte", le sens est réparti de façon stable (toujours le même pour
 * une carte donnée) afin que les compteurs et la file restent cohérents.
 */
export function resolveDirection(setting: DirectionSetting, cardId: string): Direction {
  if (setting !== 'mixed') return setting;
  return hash(cardId) % 2 === 0 ? 'recognition' : 'production';
}
