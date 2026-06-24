import {
  buildExport,
  serializeExport,
  parseImport,
  exportFileName,
  EXPORT_VERSION,
  APP_TAG,
} from '@/lib/backup';
import { makeProfile, defaultProfileData } from '@/lib/defaults';

const profile = makeProfile('Maman', '🌸');
const data = defaultProfileData();
data.progress['a1-saludos-hola:recognition'] = {
  ease: 2.5,
  interval: 3,
  reps: 2,
  due: 1000,
  lastReviewed: 500,
};

describe('Sauvegarde (export/import v2)', () => {
  it('construit une sauvegarde v2 avec profil et données', () => {
    const exp = buildExport(profile, data);
    expect(exp.app).toBe(APP_TAG);
    expect(exp.version).toBe(EXPORT_VERSION);
    expect(exp.profile.name).toBe('Maman');
    expect(exp.data.progress).toEqual(data.progress);
  });

  it('fait un aller-retour export → import sans perte', () => {
    const parsed = parseImport(serializeExport(profile, data));
    expect(parsed.profile?.name).toBe('Maman');
    expect(parsed.data.progress).toEqual(data.progress);
    expect(parsed.cardCount).toBe(1);
  });

  it('accepte encore l\'ancien format v1 (progression seule)', () => {
    const v1 = JSON.stringify({
      app: APP_TAG,
      version: 1,
      progress: { 'a1-x:recognition': { ease: 2, interval: 1, reps: 1, due: 0, lastReviewed: 1 } },
    });
    const parsed = parseImport(v1);
    expect(parsed.cardCount).toBe(1);
    expect(parsed.data.settings).toBeDefined(); // complété avec les réglages par défaut
  });

  it('rejette un JSON illisible', () => {
    expect(() => parseImport('pas du json {')).toThrow(/illisible/);
  });

  it("rejette un fichier d'une autre application", () => {
    expect(() => parseImport(JSON.stringify({ app: 'autre', version: 2 }))).toThrow(/Spanish App/);
  });

  it('rejette une version future', () => {
    const text = JSON.stringify({ app: APP_TAG, version: EXPORT_VERSION + 1 });
    expect(() => parseImport(text)).toThrow(/version plus récente/);
  });

  it('génère un nom de fichier daté avec le prénom', () => {
    const name = exportFileName(profile, new Date('2026-06-24T10:00:00Z'));
    expect(name).toBe('spanish-app-maman-2026-06-24.json');
  });
});
