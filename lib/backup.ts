import { Profile, ProfileData, ProgressMap } from './types';
import { normalizeProfileData } from './defaults';

/**
 * Format de fichier de sauvegarde.
 * v2 : profil + données complètes (progression, réglages, stats, streak).
 * v1 (ancien) : progression seule — encore accepté à l'import.
 */
export const EXPORT_VERSION = 2;
export const APP_TAG = 'spanish-app';

export interface ExportFile {
  app: typeof APP_TAG;
  version: number;
  exportedAt: string;
  profile: Profile;
  data: ProfileData;
}

export function buildExport(profile: Profile, data: ProfileData): ExportFile {
  return {
    app: APP_TAG,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    profile,
    data,
  };
}

export function serializeExport(profile: Profile, data: ProfileData): string {
  return JSON.stringify(buildExport(profile, data), null, 2);
}

function slug(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'profil';
}

export function exportFileName(profile: Profile, date = new Date()): string {
  const d = date.toISOString().slice(0, 10);
  return `spanish-app-${slug(profile.name)}-${d}.json`;
}

export interface ParsedImport {
  profile?: Profile;
  data: ProfileData;
  cardCount: number;
}

/** Lit et valide un fichier de sauvegarde (v1 ou v2). Lève une Error en français si invalide. */
export function parseImport(text: string): ParsedImport {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("Ce fichier n'est pas une sauvegarde valide (format illisible).");
  }
  if (typeof raw !== 'object' || raw === null) {
    throw new Error("Ce fichier n'est pas une sauvegarde valide.");
  }
  const obj = raw as Record<string, unknown>;

  if (obj.app !== APP_TAG) {
    throw new Error("Ce fichier ne provient pas de l'application Spanish App.");
  }
  const version = obj.version;
  if (typeof version !== 'number' || version > EXPORT_VERSION) {
    throw new Error(
      'Cette sauvegarde a été créée avec une version plus récente de l’app. Mets l’app à jour.'
    );
  }

  let data: ProfileData;
  let profile: Profile | undefined;

  if (version === 1) {
    // Ancien format : progression seule.
    const progress = (obj.progress ?? {}) as ProgressMap;
    data = normalizeProfileData({ progress });
  } else {
    data = normalizeProfileData(obj.data as Partial<ProfileData> | undefined);
    if (obj.profile && typeof obj.profile === 'object') {
      profile = obj.profile as Profile;
    }
  }

  return { profile, data, cardCount: Object.keys(data.progress).length };
}
