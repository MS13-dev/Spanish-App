import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile, ProfileData } from './types';
import { makeProfile, defaultProfileData, normalizeProfileData } from './defaults';

const KEY = 'spanishapp:v2';
const OLD_PROGRESS_KEY = 'spanishapp:progress:v1';

export interface AppState {
  profiles: Profile[];
  activeId: string;
  data: Record<string, ProfileData>;
}

/** État de départ : un profil unique « Moi ». */
export function freshState(): AppState {
  const me = makeProfile('Moi', '🙂');
  return { profiles: [me], activeId: me.id, data: { [me.id]: defaultProfileData() } };
}

function normalize(state: AppState): AppState {
  const data: Record<string, ProfileData> = {};
  for (const p of state.profiles) {
    data[p.id] = normalizeProfileData(state.data[p.id]);
  }
  const activeId = state.profiles.some((p) => p.id === state.activeId)
    ? state.activeId
    : state.profiles[0]?.id;
  return { profiles: state.profiles, activeId, data };
}

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw) as AppState);

    // Migration depuis l'ancien format (progression seule, un seul utilisateur).
    const old = await AsyncStorage.getItem(OLD_PROGRESS_KEY);
    const state = freshState();
    if (old) {
      const progress = JSON.parse(old);
      state.data[state.activeId].progress = progress;
    }
    await saveState(state);
    return state;
  } catch (e) {
    console.warn('Échec du chargement, état réinitialisé', e);
    return freshState();
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Échec de la sauvegarde', e);
  }
}
