import { initialProgress, review, isDue, formatInterval } from '@/lib/srs';

const DAY = 24 * 60 * 60 * 1000;

describe('SRS (SM-2)', () => {
  it('une carte neuve est due', () => {
    expect(isDue(undefined)).toBe(true);
    expect(isDue(initialProgress())).toBe(true);
  });

  it('"again" remet les répétitions à zéro et rééchéance très vite', () => {
    const now = 1_000_000;
    const p = review(initialProgress(), 'good', now);
    const again = review(p, 'again', now);
    expect(again.reps).toBe(0);
    expect(again.due).toBe(now + 60 * 1000);
  });

  it('les intervalles augmentent avec des réponses "good" successives', () => {
    const now = 1_000_000;
    const p1 = review(initialProgress(), 'good', now);
    const p2 = review(p1, 'good', now);
    const p3 = review(p2, 'good', now);
    expect(p1.interval).toBe(1);
    expect(p2.interval).toBe(3);
    expect(p3.interval).toBeGreaterThan(p2.interval);
  });

  it('"easy" donne un intervalle plus grand que "good"', () => {
    const now = 1_000_000;
    const good = review(initialProgress(), 'good', now);
    const easy = review(initialProgress(), 'easy', now);
    expect(easy.interval).toBeGreaterThanOrEqual(good.interval);
  });

  it('le facteur de facilité ne descend jamais sous 1.3', () => {
    let p = initialProgress();
    for (let i = 0; i < 20; i++) p = review(p, 'again');
    expect(p.ease).toBeGreaterThanOrEqual(1.3);
  });

  it("une carte révisée n'est plus due immédiatement", () => {
    const now = 1_000_000;
    const p = review(initialProgress(), 'good', now);
    expect(isDue(p, now)).toBe(false);
    expect(isDue(p, now + 2 * DAY)).toBe(true);
  });

  it('formatInterval renvoie un libellé lisible', () => {
    expect(formatInterval('again', undefined)).toBe('< 1 min');
    expect(formatInterval('good', undefined)).toBe('1 j');
  });
});
