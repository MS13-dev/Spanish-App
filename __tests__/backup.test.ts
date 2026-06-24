import {
  buildExport,
  serializeExport,
  parseImport,
  exportFileName,
  EXPORT_VERSION,
  APP_TAG,
} from '@/lib/backup';
import { ProgressMap } from '@/lib/storage';

const sample: ProgressMap = {
  'a1-saludos-hola:recognition': { ease: 2.5, interval: 3, reps: 2, due: 1000, lastReviewed: 500 },
};

describe('Sauvegarde (export/import)', () => {
  it('construit une sauvegarde avec app, version et date', () => {
    const exp = buildExport(sample);
    expect(exp.app).toBe(APP_TAG);
    expect(exp.version).toBe(EXPORT_VERSION);
    expect(typeof exp.exportedAt).toBe('string');
    expect(exp.progress).toEqual(sample);
  });

  it('fait un aller-retour export → import sans perte', () => {
    const text = serializeExport(sample);
    const parsed = parseImport(text);
    expect(parsed.progress).toEqual(sample);
    expect(parsed.cardCount).toBe(1);
  });

  it('rejette un JSON illisible', () => {
    expect(() => parseImport('pas du json {')).toThrow(/illisible/);
  });

  it("rejette un fichier d'une autre application", () => {
    const text = JSON.stringify({ app: 'autre-app', version: 1, progress: {} });
    expect(() => parseImport(text)).toThrow(/Spanish App/);
  });

  it('rejette une version future', () => {
    const text = JSON.stringify({ app: APP_TAG, version: EXPORT_VERSION + 1, progress: {} });
    expect(() => parseImport(text)).toThrow(/version plus récente/);
  });

  it('ignore les entrées de progression invalides', () => {
    const text = JSON.stringify({
      app: APP_TAG,
      version: EXPORT_VERSION,
      progress: {
        bonne: sample['a1-saludos-hola:recognition'],
        mauvaise: { ease: 'x' },
      },
    });
    const parsed = parseImport(text);
    expect(parsed.cardCount).toBe(1);
    expect(parsed.progress.bonne).toBeDefined();
    expect(parsed.progress.mauvaise).toBeUndefined();
  });

  it('génère un nom de fichier daté', () => {
    const name = exportFileName(new Date('2026-06-24T10:00:00Z'));
    expect(name).toBe('spanish-app-sauvegarde-2026-06-24.json');
  });
});
