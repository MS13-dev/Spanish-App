/**
 * Palette chaleureuse inspirée de l'Espagne : terracotta, ocre, soleil, rouge profond.
 * Pensée pour de grandes formes arrondies et un rendu engageant.
 */

export const colors = {
  // Fonds
  background: '#FFF6EC', // crème chaud
  surface: '#FFFFFF',
  surfaceAlt: '#FBE9D6', // sable

  // Accents principaux
  terracotta: '#C75B39',
  terracottaDark: '#A8321E',
  ocre: '#E8A33D',
  sun: '#F2B705',
  olive: '#6B7330',

  // Texte
  text: '#3A2A20', // brun profond
  textSoft: '#7A6657',
  textOnColor: '#FFFFFF',

  // États SRS / feedback
  again: '#C0392B',
  hard: '#E08A3C',
  good: '#5C9A6B',
  easy: '#3E8E7E',

  // Divers
  border: '#EAD9C6',
  shadow: '#3A2A20',
};

/** Couleurs distinctes par niveau CECRL (dégradé chaud → froid). */
export const levelColors: Record<string, { main: string; soft: string }> = {
  A1: { main: '#E8A33D', soft: '#FBE3C2' },
  A2: { main: '#D96C4A', soft: '#F7D8CB' },
  B1: { main: '#C75B39', soft: '#F2CDBE' },
  B2: { main: '#A8321E', soft: '#EAC2BA' },
  C1: { main: '#6B7330', soft: '#DCE0C2' },
  C2: { main: '#3E8E7E', soft: '#C7E2DC' },
};

export const radius = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  display: { fontSize: 34, fontWeight: '800' as const, letterSpacing: 0.3 },
  title: { fontSize: 24, fontWeight: '800' as const },
  heading: { fontSize: 19, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '500' as const },
  caption: { fontSize: 13, fontWeight: '600' as const },
};

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  soft: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};
