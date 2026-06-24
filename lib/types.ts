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
