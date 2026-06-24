import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Card,
  CardProgress,
  Direction,
  Grade,
  Profile,
  ProfileData,
  Settings,
} from '@/lib/types';
import { initialProgress, review } from '@/lib/srs';
import { srsKey } from '@/lib/srskey';
import { buildQueue, countCards, todayCount, Counts, QueueItem } from '@/lib/scheduler';
import { bumpStreak, effectiveStreak, addToLog, todayLog, successRate } from '@/lib/stats';
import { dateStr } from '@/lib/dates';
import { makeProfile, defaultProfileData } from '@/lib/defaults';
import { AppState, loadState, saveState, freshState } from '@/lib/persist';

interface AppContextValue {
  ready: boolean;
  profiles: Profile[];
  activeProfile: Profile;
  settings: Settings;
  streak: number;
  longestStreak: number;

  // Profils
  addProfile: (name: string, emoji?: string) => void;
  switchProfile: (id: string) => void;
  renameProfile: (id: string, name: string, emoji: string) => void;
  deleteProfile: (id: string) => void;

  // Réglages
  updateSettings: (patch: Partial<Settings>) => void;

  // Révision
  gradeCard: (cardId: string, direction: Direction, grade: Grade) => void;
  getProgress: (cardId: string, direction: Direction) => CardProgress;
  buildLevelQueue: (cards: Card[], reviewAll: boolean) => QueueItem[];
  levelCounts: (cardIds: string[]) => Counts & { today: number };

  // Stats
  reviewedToday: number;
  successRate7d: number | null;

  // Données brutes du profil actif (pour stats avancées / page difficile)
  activeData: ProfileData;

  // Sauvegarde
  replaceActiveData: (data: ProfileData) => void;
  resetActive: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => freshState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setReady(true);
    });
  }, []);

  const update = useCallback((next: AppState) => {
    setState(next);
    saveState(next);
  }, []);

  /** Met à jour les données du profil actif de façon immuable. */
  const mutateActive = useCallback(
    (fn: (d: ProfileData) => ProfileData) => {
      setState((cur) => {
        const next: AppState = {
          ...cur,
          data: { ...cur.data, [cur.activeId]: fn(cur.data[cur.activeId]) },
        };
        saveState(next);
        return next;
      });
    },
    []
  );

  const activeProfile = useMemo(
    () => state.profiles.find((p) => p.id === state.activeId) ?? state.profiles[0],
    [state]
  );
  const activeData = state.data[state.activeId] ?? defaultProfileData();
  const settings = activeData.settings;
  const today = dateStr();

  // --- Profils ---
  const addProfile = useCallback(
    (name: string, emoji = '🙂') => {
      const p = makeProfile(name, emoji);
      update({
        profiles: [...state.profiles, p],
        activeId: p.id,
        data: { ...state.data, [p.id]: defaultProfileData() },
      });
    },
    [state, update]
  );

  const switchProfile = useCallback(
    (id: string) => {
      if (state.data[id]) update({ ...state, activeId: id });
    },
    [state, update]
  );

  const renameProfile = useCallback(
    (id: string, name: string, emoji: string) => {
      update({
        ...state,
        profiles: state.profiles.map((p) => (p.id === id ? { ...p, name, emoji } : p)),
      });
    },
    [state, update]
  );

  const deleteProfile = useCallback(
    (id: string) => {
      if (state.profiles.length <= 1) return; // toujours au moins un profil
      const profiles = state.profiles.filter((p) => p.id !== id);
      const data = { ...state.data };
      delete data[id];
      const activeId = state.activeId === id ? profiles[0].id : state.activeId;
      update({ profiles, activeId, data });
    },
    [state, update]
  );

  // --- Réglages ---
  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      mutateActive((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
    },
    [mutateActive]
  );

  // --- Révision ---
  const gradeCard = useCallback(
    (cardId: string, direction: Direction, grade: Grade) => {
      mutateActive((d) => {
        const key = srsKey(cardId, direction);
        const prev = d.progress[key] ?? initialProgress();
        const wasNew = !d.progress[key] || d.progress[key].lastReviewed === 0;
        const t = dateStr();
        const correct = grade === 'good' || grade === 'easy' ? 1 : 0;

        return {
          ...d,
          progress: { ...d.progress, [key]: review(prev, grade) },
          dailyLogs: addToLog(d.dailyLogs, t, 1, correct),
          streak: bumpStreak(d.streak, t),
          newByDate: wasNew
            ? { ...d.newByDate, [t]: (d.newByDate[t] ?? 0) + 1 }
            : d.newByDate,
        };
      });
    },
    [mutateActive]
  );

  const getProgress = useCallback(
    (cardId: string, direction: Direction) =>
      activeData.progress[srsKey(cardId, direction)] ?? initialProgress(),
    [activeData]
  );

  const buildLevelQueue = useCallback(
    (cards: Card[], reviewAll: boolean) =>
      buildQueue(cards, activeData.progress, {
        direction: settings.direction,
        newCardsPerDay: settings.newCardsPerDay,
        newIntroducedToday: activeData.newByDate[today] ?? 0,
        reviewAll,
      }),
    [activeData, settings, today]
  );

  const levelCounts = useCallback(
    (cardIds: string[]) => {
      const c = countCards(cardIds, settings.direction, activeData.progress);
      return {
        ...c,
        today: todayCount(c, settings.newCardsPerDay, activeData.newByDate[today] ?? 0),
      };
    },
    [activeData, settings, today]
  );

  const replaceActiveData = useCallback(
    (data: ProfileData) => mutateActive(() => data),
    [mutateActive]
  );

  const resetActive = useCallback(
    () => mutateActive(() => defaultProfileData()),
    [mutateActive]
  );

  const value: AppContextValue = {
    ready,
    profiles: state.profiles,
    activeProfile,
    settings,
    streak: effectiveStreak(activeData.streak, today),
    longestStreak: activeData.streak.longest,
    addProfile,
    switchProfile,
    renameProfile,
    deleteProfile,
    updateSettings,
    gradeCard,
    getProgress,
    buildLevelQueue,
    levelCounts,
    reviewedToday: todayLog(activeData.dailyLogs, today).reviewed,
    successRate7d: successRate(activeData.dailyLogs, 7, today),
    activeData,
    replaceActiveData,
    resetActive,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans un AppProvider');
  return ctx;
}
