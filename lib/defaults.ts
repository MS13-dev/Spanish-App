import { Profile, Settings, Streak, ProfileData } from './types';

export function defaultSettings(): Settings {
  return {
    newCardsPerDay: 10,
    dailyGoal: 20,
    gradingMode: 'simple',
    direction: 'recognition',
    autoPlayAudio: true,
    textScale: 1,
  };
}

export function defaultStreak(): Streak {
  return { current: 0, longest: 0, lastActiveDate: '' };
}

export function defaultProfileData(): ProfileData {
  return {
    progress: {},
    settings: defaultSettings(),
    streak: defaultStreak(),
    dailyLogs: [],
    newByDate: {},
  };
}

let counter = 0;
export function makeProfile(name: string, emoji = '🙂'): Profile {
  counter += 1;
  return {
    id: `p_${Date.now().toString(36)}_${counter}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    emoji,
  };
}

/** Réglages robustes : complète d'éventuels champs manquants (compat ascendante). */
export function normalizeSettings(s: Partial<Settings> | undefined): Settings {
  return { ...defaultSettings(), ...(s ?? {}) };
}

export function normalizeProfileData(d: Partial<ProfileData> | undefined): ProfileData {
  const base = defaultProfileData();
  return {
    progress: d?.progress ?? base.progress,
    settings: normalizeSettings(d?.settings),
    streak: d?.streak ?? base.streak,
    dailyLogs: d?.dailyLogs ?? base.dailyLogs,
    newByDate: d?.newByDate ?? base.newByDate,
  };
}
