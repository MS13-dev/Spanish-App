import { buildQueue, countCards, todayCount, isNewCard } from '@/lib/scheduler';
import { review, initialProgress } from '@/lib/srs';
import { srsKey } from '@/lib/srskey';
import { Card, ProgressMap } from '@/lib/types';

const cards: Card[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `c${i}`,
  es: `es${i}`,
  fr: `fr${i}`,
  exampleEs: 'x',
  exampleFr: 'y',
}));

const DIR = 'recognition';

describe('Planificateur de file', () => {
  it('limite les nouvelles cartes au budget du jour', () => {
    const q = buildQueue(cards, {}, {
      direction: DIR,
      newCardsPerDay: 3,
      newIntroducedToday: 0,
      reviewAll: false,
    });
    expect(q.length).toBe(3);
    q.forEach((it) => expect(it.direction).toBe('recognition'));
  });

  it('respecte les nouvelles déjà introduites aujourd\'hui', () => {
    const q = buildQueue(cards, {}, {
      direction: DIR,
      newCardsPerDay: 5,
      newIntroducedToday: 4,
      reviewAll: false,
    });
    expect(q.length).toBe(1);
  });

  it('inclut les cartes dues en plus des nouvelles', () => {
    const now = 10_000_000_000;
    const progress: ProgressMap = {};
    // c0 vue et due (révisée il y a longtemps)
    progress[srsKey('c0', 'recognition')] = review(initialProgress(), 'good', now - 5 * 86400000);
    const q = buildQueue(cards, progress, {
      direction: DIR,
      newCardsPerDay: 2,
      newIntroducedToday: 0,
      reviewAll: false,
      now,
    });
    // 1 due (c0) + 2 nouvelles = 3
    expect(q.length).toBe(3);
    expect(q.some((it) => it.card.id === 'c0')).toBe(true);
  });

  it('en mode "tout revoir", renvoie toutes les cartes', () => {
    const q = buildQueue(cards, {}, {
      direction: DIR,
      newCardsPerDay: 1,
      newIntroducedToday: 0,
      reviewAll: true,
    });
    expect(q.length).toBe(10);
  });

  it('countCards distingue nouvelles / apprises / maîtrisées', () => {
    const now = 10_000_000_000;
    const progress: ProgressMap = {};
    // c0 maîtrisée (gros intervalle)
    let p = initialProgress();
    for (let i = 0; i < 8; i++) p = review(p, 'easy', now);
    progress[srsKey('c0', 'recognition')] = p;
    const c = countCards(cards.map((x) => x.id), DIR, progress, now);
    expect(c.total).toBe(10);
    expect(c.learned).toBe(1);
    expect(c.mastered).toBe(1);
    expect(c.fresh).toBe(9);
  });

  it('todayCount = dues + nouvelles autorisées', () => {
    const counts = { total: 20, due: 4, fresh: 15, learned: 5, mastered: 2 };
    expect(todayCount(counts, 10, 0)).toBe(14); // 4 + min(10,15)
    expect(todayCount(counts, 10, 7)).toBe(7); // 4 + min(3,15)
  });

  it('isNewCard reflète l\'absence de progression', () => {
    expect(isNewCard('c0', DIR, {})).toBe(true);
    const progress: ProgressMap = { [srsKey('c0', 'recognition')]: review(initialProgress(), 'good') };
    expect(isNewCard('c0', DIR, progress)).toBe(false);
  });
});
