/// <reference lib="dom" />
/**
 * Synthèse vocale — implémentation web via l'API SpeechSynthesis du navigateur.
 * Gratuit, hors-ligne, aucune clé. Prononciation en espagnol (es-ES).
 */

const synth: SpeechSynthesis | undefined =
  typeof window !== 'undefined' ? window.speechSynthesis : undefined;

export const speechSupported = !!synth;

let spanishVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (!synth) return null;
  if (spanishVoice) return spanishVoice;
  const voices = synth.getVoices();
  spanishVoice =
    voices.find((v) => v.lang.toLowerCase().startsWith('es')) ?? null;
  return spanishVoice;
}

export function speak(text: string): void {
  if (!synth) return;
  synth.cancel(); // coupe une lecture en cours
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES';
  const v = pickVoice();
  if (v) u.voice = v;
  u.rate = 0.95;
  synth.speak(u);
}
