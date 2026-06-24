/** Une flashcard : un mot espagnol + sa traduction + une phrase de contexte. */
export interface Card {
  /** Identifiant stable et unique (ex. "a1-saludos-hola"). */
  id: string;
  /** Le mot ou l'expression en espagnol. */
  es: string;
  /** Sa traduction en français. */
  fr: string;
  /** Une phrase en espagnol qui montre le mot en contexte. */
  exampleEs: string;
  /** La traduction française de la phrase de contexte. */
  exampleFr: string;
  /** Catégorie grammaticale courte (nom, verbe, adjectif…), optionnelle. */
  pos?: string;
}

/** Un deck thématique à l'intérieur d'un niveau (ex. "Salutations"). */
export interface Deck {
  id: string;
  title: string;
  emoji: string;
  cards: Card[];
}

/** Un niveau CECRL contenant plusieurs decks thématiques. */
export interface Level {
  id: string; // "A1", "A2", ...
  title: string;
  subtitle: string;
  decks: Deck[];
}

/** État de répétition espacée pour une carte donnée (algorithme SM-2). */
export interface CardProgress {
  /** Facteur de facilité (>= 1.3). */
  ease: number;
  /** Intervalle courant en jours. */
  interval: number;
  /** Nombre de répétitions réussies consécutives. */
  reps: number;
  /** Date de prochaine révision (timestamp ms). */
  due: number;
  /** Dernière révision (timestamp ms), 0 si jamais vue. */
  lastReviewed: number;
}

/** Qualité de la réponse de l'utilisateur lors d'une révision. */
export type Grade = 'again' | 'hard' | 'good' | 'easy';

/** Table de progression : clé = `${cardId}:${direction}`. */
export type ProgressMap = Record<string, CardProgress>;

/**
 * Sens de révision :
 * - recognition : on voit l'espagnol, on se rappelle le français (plus facile)
 * - production  : on voit le français, on doit produire l'espagnol (plus exigeant)
 */
export type Direction = 'recognition' | 'production';

/** Réglage de sens choisi par l'utilisateur (mixed = un sens au hasard par carte). */
export type DirectionSetting = Direction | 'mixed';

/** Mode de notation présenté à l'utilisateur. */
export type GradingMode = 'simple' | 'detailed';

/** Un profil utilisateur (ex. toi / ta mère), avec sa propre progression. */
export interface Profile {
  id: string;
  name: string;
  emoji: string;
}

/** Réglages d'un profil. */
export interface Settings {
  /** Nombre maximum de NOUVELLES cartes introduites par jour. */
  newCardsPerDay: number;
  /** Objectif quotidien de cartes révisées. */
  dailyGoal: number;
  /** Notation simple (2 boutons) ou détaillée (4 boutons). */
  gradingMode: GradingMode;
  /** Sens de révision par défaut. */
  direction: DirectionSetting;
  /** Lecture audio automatique au retournement de la carte. */
  autoPlayAudio: boolean;
  /** Facteur de taille du texte (accessibilité). 1 = normal. */
  textScale: number;
}

/** Compteur de jours consécutifs d'activité. */
export interface Streak {
  current: number;
  longest: number;
  /** Dernier jour d'activité au format YYYY-MM-DD. */
  lastActiveDate: string;
}

/** Journal d'activité d'un jour donné. */
export interface DailyLog {
  date: string; // YYYY-MM-DD
  reviewed: number;
  correct: number;
}

/** Toutes les données d'un profil (progression + réglages + stats). */
export interface ProfileData {
  /** Clé = `${cardId}:${direction}`. */
  progress: Record<string, CardProgress>;
  settings: Settings;
  streak: Streak;
  dailyLogs: DailyLog[];
  /** Nombre de nouvelles cartes introduites par jour (clé = YYYY-MM-DD). */
  newByDate: Record<string, number>;
}
