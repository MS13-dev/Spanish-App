/// <reference lib="dom" />
/**
 * Entrées/sorties de fichier pour la sauvegarde — implémentation web (navigateur).
 * Utilise les API DOM standard : aucune dépendance externe.
 */

export const supported = true;

/** Déclenche le téléchargement d'un fichier texte dans le navigateur. */
export function downloadFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Ouvre le sélecteur de fichier et renvoie le contenu texte du fichier choisi. */
export function pickFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = () => {
      const file = input.files && input.files[0];
      if (!file) {
        reject(new Error('Aucun fichier sélectionné.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Impossible de lire le fichier.'));
      reader.readAsText(file);
    };
    // Si l'utilisateur annule, aucune promesse résolue — sans gravité.
    input.click();
  });
}
