/**
 * Synthèse vocale — implémentation par défaut (natif).
 * La prononciation audio gratuite utilise l'API du navigateur ; sur natif (Expo Go)
 * elle n'est pas disponible dans cette version. Metro charge `speech.web.ts` sur le web.
 */
export const speechSupported = false;

export function speak(_text: string): void {
  // no-op sur natif
}
