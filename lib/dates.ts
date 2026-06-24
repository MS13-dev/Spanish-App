/** Date locale au format YYYY-MM-DD (jour de l'utilisateur, pas UTC). */
export function dateStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Nombre de jours entiers entre deux dates YYYY-MM-DD (b - a). */
export function daysBetween(a: string, b: string): number {
  const ta = Date.parse(`${a}T00:00:00`);
  const tb = Date.parse(`${b}T00:00:00`);
  return Math.round((tb - ta) / 86400000);
}
