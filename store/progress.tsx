import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CardProgress, Grade } from '@/lib/types';
import { initialProgress, review, isDue } from '@/lib/srs';
import { loadProgress, saveProgress, ProgressMap } from '@/lib/storage';

interface ProgressContextValue {
  ready: boolean;
  map: ProgressMap;
  /** Enregistre une révision pour une carte et persiste. */
  grade: (cardId: string, grade: Grade) => void;
  /** Progression d'une carte (ou état initial). */
  get: (cardId: string) => CardProgress;
  /** Nombre de cartes dues parmi une liste d'ids. */
  dueCount: (cardIds: string[]) => number;
  /** Nombre de cartes déjà apprises (au moins une révision réussie). */
  learnedCount: (cardIds: string[]) => number;
  /** Remplace toute la progression (utilisé par la restauration d'une sauvegarde). */
  replaceProgress: (next: ProgressMap) => void;
  /** Réinitialise toute la progression (pour tests / réglages). */
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadProgress().then((m) => {
      setMap(m);
      setReady(true);
    });
  }, []);

  const persist = useCallback((next: ProgressMap) => {
    setMap(next);
    saveProgress(next);
  }, []);

  const grade = useCallback(
    (cardId: string, g: Grade) => {
      setMap((current) => {
        const prev = current[cardId] ?? initialProgress();
        const next = { ...current, [cardId]: review(prev, g) };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const get = useCallback(
    (cardId: string) => map[cardId] ?? initialProgress(),
    [map]
  );

  const dueCount = useCallback(
    (ids: string[]) => ids.filter((id) => isDue(map[id])).length,
    [map]
  );

  const learnedCount = useCallback(
    (ids: string[]) => ids.filter((id) => (map[id]?.reps ?? 0) > 0).length,
    [map]
  );

  const replaceProgress = useCallback((next: ProgressMap) => persist(next), [persist]);

  const reset = useCallback(() => persist({}), [persist]);

  return (
    <ProgressContext.Provider
      value={{ ready, map, grade, get, dueCount, learnedCount, replaceProgress, reset }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé dans un ProgressProvider');
  return ctx;
}
