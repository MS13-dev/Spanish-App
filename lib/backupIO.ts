/**
 * Entrées/sorties de fichier pour la sauvegarde — implémentation par défaut (natif).
 * Sur natif (Expo Go), l'export/import de fichier n'est pas géré dans cette version :
 * la fonctionnalité est disponible dans la version web de l'app.
 * Metro remplace ce module par `backupIO.web.ts` quand on tourne sur le web.
 */

export const supported = false;

export function downloadFile(_filename: string, _content: string): void {
  throw new Error(
    'La sauvegarde dans un fichier est disponible dans la version web (navigateur).'
  );
}

export function pickFile(): Promise<string> {
  return Promise.reject(
    new Error('La restauration depuis un fichier est disponible dans la version web (navigateur).')
  );
}
