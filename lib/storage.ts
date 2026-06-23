import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardProgress } from './types';

const KEY = 'spanishapp:progress:v1';

export type ProgressMap = Record<string, CardProgress>;

/** Charge l'intégralité de la progression depuis le stockage local. */
export async function loadProgress(): Promise<ProgressMap> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch (e) {
    console.warn('Échec du chargement de la progression', e);
    return {};
  }
}

/** Sauvegarde l'intégralité de la progression. */
export async function saveProgress(map: ProgressMap): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(map));
  } catch (e) {
    console.warn('Échec de la sauvegarde de la progression', e);
  }
}
