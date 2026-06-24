import { bumpStreak, effectiveStreak, addToLog, todayLog, successRate } from '@/lib/stats';
import { defaultStreak } from '@/lib/defaults';

describe('Série (streak)', () => {
  it('démarre à 1 le premier jour', () => {
    const s = bumpStreak(defaultStreak(), '2026-06-24');
    expect(s.current).toBe(1);
    expect(s.longest).toBe(1);
  });

  it('incrémente le lendemain', () => {
    let s = bumpStreak(defaultStreak(), '2026-06-24');
    s = bumpStreak(s, '2026-06-25');
    expect(s.current).toBe(2);
  });

  it('ne change pas le même jour', () => {
    let s = bumpStreak(defaultStreak(), '2026-06-24');
    s = bumpStreak(s, '2026-06-24');
    expect(s.current).toBe(1);
  });

  it('repart à 1 après un trou', () => {
    let s = bumpStreak(defaultStreak(), '2026-06-24');
    s = bumpStreak(s, '2026-06-27');
    expect(s.current).toBe(1);
  });

  it('conserve le record (longest)', () => {
    let s = bumpStreak(defaultStreak(), '2026-06-24');
    s = bumpStreak(s, '2026-06-25');
    s = bumpStreak(s, '2026-06-28'); // trou
    expect(s.longest).toBe(2);
    expect(s.current).toBe(1);
  });

  it('effectiveStreak tombe à 0 si interrompue', () => {
    const s = bumpStreak(defaultStreak(), '2026-06-20');
    expect(effectiveStreak(s, '2026-06-25')).toBe(0);
    expect(effectiveStreak(s, '2026-06-21')).toBe(1); // lendemain → encore valide
  });
});

describe('Journal & taux de réussite', () => {
  it('agrège les révisions du jour', () => {
    let logs = addToLog([], '2026-06-24', 5, 4);
    logs = addToLog(logs, '2026-06-24', 3, 1);
    expect(todayLog(logs, '2026-06-24')).toEqual({ date: '2026-06-24', reviewed: 8, correct: 5 });
  });

  it('calcule le taux de réussite sur N jours', () => {
    let logs = addToLog([], '2026-06-24', 10, 8);
    logs = addToLog(logs, '2026-06-23', 10, 6);
    expect(successRate(logs, 7, '2026-06-24')).toBeCloseTo(0.7);
  });

  it('renvoie null si aucune révision', () => {
    expect(successRate([], 7, '2026-06-24')).toBeNull();
  });
});
