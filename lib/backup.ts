import { ProgressMap } from './storage';
import { CardProgress } from './types';

/**
 * Format de fichier de sauvegarde de la progression.
 * Versionné pour rester compatible quand on ajoutera profils / réglages / streak.
 */
export const EXPORT_VERSION = 1;
export const APP_TAG = 'spanish-app';

export interface ExportFile {
  app: typeof APP_TAG;
  version: number;
  exportedAt: string;
  progress: ProgressMap;
  // Réservés pour les prochaines PR (profils, réglages, streak) :
  settings?: Record<string, unknown>;
  streak?: Record<string, unknown>;
}

/** Construit l'objet de sauvegarde à partir de la progression courante. */
export function buildExport(progress: ProgressMap): ExportFile {
  return {
    app: APP_TAG,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    progress,
  };
}

/** Sérialise une sauvegarde en JSON lisible. */
export function serializeExport(progress: ProgressMap): string {
  return JSON.stringify(buildExport(progress), null, 2);
}

/** Nom de fichier proposé pour la sauvegarde. */
export function exportFileName(date = new Date()): string {
  const d = date.toISOString().slice(0, 10);
  return `spanish-app-sauvegarde-${d}.json`;
}

function isCardProgress(v: unknown): v is CardProgress {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.ease === 'number' &&
    typeof o.interval === 'number' &&
    typeof o.reps === 'number' &&
    typeof o.due === 'number' &&
    typeof o.lastReviewed === 'number'
  );
}

export interface ParsedImport {
  progress: ProgressMap;
  cardCount: number;
}

/**
 * Lit et valide un fichier de sauvegarde.
 * Lève une Error avec un message en français si le fichier est invalide.
 */
export function parseImport(text: string): ParsedImport {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Ce fichier n'est pas une sauvegarde valide (format illisible).");
  }

  if (typeof data !== 'object' || data === null) {
    throw new Error("Ce fichier n'est pas une sauvegarde valide.");
  }
  const obj = data as Partial<ExportFile>;

  if (obj.app !== APP_TAG) {
    throw new Error("Ce fichier ne provient pas de l'application Spanish App.");
  }
  if (typeof obj.version !== 'number' || obj.version > EXPORT_VERSION) {
    throw new Error(
      'Cette sauvegarde a été créée avec une version plus récente de l’app. Mets l’app à jour.'
    );
  }
  if (typeof obj.progress !== 'object' || obj.progress === null) {
    throw new Error('Cette sauvegarde ne contient pas de progression.');
  }

  // Garde uniquement les entrées valides (robustesse).
  const progress: ProgressMap = {};
  for (const [key, value] of Object.entries(obj.progress)) {
    if (isCardProgress(value)) progress[key] = value;
  }

  return { progress, cardCount: Object.keys(progress).length };
}
