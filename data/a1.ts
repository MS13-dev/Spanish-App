import { Deck } from '@/lib/types';

/**
 * Niveau A1 — débutant.
 * Vocabulaire de base regroupé par thèmes de la vie courante.
 * Chaque carte : mot espagnol + traduction française + phrase de contexte (ES/FR).
 */
export const a1Decks: Deck[] = [
  {
    id: 'a1-saludos',
    title: 'Salutations & politesse',
    emoji: '👋',
    cards: [
      { id: 'a1-saludos-hola', es: 'hola', fr: 'bonjour / salut', pos: 'interj.', exampleEs: '¡Hola! ¿Cómo estás?', exampleFr: 'Salut ! Comment vas-tu ?' },
      { id: 'a1-saludos-buenos-dias', es: 'buenos días', fr: 'bonjour (le matin)', pos: 'expr.', exampleEs: 'Buenos días, señora García.', exampleFr: 'Bonjour, madame García.' },
      { id: 'a1-saludos-buenas-tardes', es: 'buenas tardes', fr: 'bon après-midi', pos: 'expr.', exampleEs: 'Buenas tardes, ¿qué desea?', exampleFr: 'Bon après-midi, que désirez-vous ?' },
      { id: 'a1-saludos-buenas-noches', es: 'buenas noches', fr: 'bonsoir / bonne nuit', pos: 'expr.', exampleEs: 'Buenas noches, hasta mañana.', exampleFr: 'Bonne nuit, à demain.' },
      { id: 'a1-saludos-adios', es: 'adiós', fr: 'au revoir', pos: 'interj.', exampleEs: 'Adiós, nos vemos pronto.', exampleFr: 'Au revoir, à bientôt.' },
      { id: 'a1-saludos-gracias', es: 'gracias', fr: 'merci', pos: 'interj.', exampleEs: 'Muchas gracias por tu ayuda.', exampleFr: 'Merci beaucoup pour ton aide.' },
      { id: 'a1-saludos-de-nada', es: 'de nada', fr: 'de rien', pos: 'expr.', exampleEs: '—Gracias. —De nada.', exampleFr: '— Merci. — De rien.' },
      { id: 'a1-saludos-por-favor', es: 'por favor', fr: "s'il vous plaît", pos: 'expr.', exampleEs: 'Un café, por favor.', exampleFr: "Un café, s'il vous plaît." },
      { id: 'a1-saludos-perdon', es: 'perdón', fr: 'pardon / excusez-moi', pos: 'interj.', exampleEs: 'Perdón, ¿dónde está el baño?', exampleFr: 'Pardon, où sont les toilettes ?' },
      { id: 'a1-saludos-si', es: 'sí', fr: 'oui', pos: 'adv.', exampleEs: 'Sí, estoy de acuerdo.', exampleFr: "Oui, je suis d'accord." },
      { id: 'a1-saludos-no', es: 'no', fr: 'non / ne... pas', pos: 'adv.', exampleEs: 'No, no quiero más.', exampleFr: "Non, je n'en veux plus." },
      { id: 'a1-saludos-como-estas', es: '¿cómo estás?', fr: 'comment vas-tu ?', pos: 'expr.', exampleEs: 'Hola Ana, ¿cómo estás?', exampleFr: 'Salut Ana, comment vas-tu ?' },
    ],
  },
  {
    id: 'a1-familia',
    title: 'La famille',
    emoji: '👨‍👩‍👧',
    cards: [
      { id: 'a1-familia-madre', es: 'la madre', fr: 'la mère', pos: 'nom', exampleEs: 'Mi madre cocina muy bien.', exampleFr: 'Ma mère cuisine très bien.' },
      { id: 'a1-familia-padre', es: 'el padre', fr: 'le père', pos: 'nom', exampleEs: 'Su padre trabaja en un banco.', exampleFr: 'Son père travaille dans une banque.' },
      { id: 'a1-familia-hermano', es: 'el hermano', fr: 'le frère', pos: 'nom', exampleEs: 'Tengo un hermano menor.', exampleFr: 'J\'ai un frère cadet.' },
      { id: 'a1-familia-hermana', es: 'la hermana', fr: 'la sœur', pos: 'nom', exampleEs: 'Mi hermana estudia medicina.', exampleFr: 'Ma sœur étudie la médecine.' },
      { id: 'a1-familia-hijo', es: 'el hijo', fr: 'le fils', pos: 'nom', exampleEs: 'Su hijo tiene cinco años.', exampleFr: 'Son fils a cinq ans.' },
      { id: 'a1-familia-hija', es: 'la hija', fr: 'la fille', pos: 'nom', exampleEs: 'La hija de Pedro es muy simpática.', exampleFr: 'La fille de Pedro est très sympathique.' },
      { id: 'a1-familia-abuelo', es: 'el abuelo', fr: 'le grand-père', pos: 'nom', exampleEs: 'Mi abuelo cuenta buenas historias.', exampleFr: 'Mon grand-père raconte de belles histoires.' },
      { id: 'a1-familia-abuela', es: 'la abuela', fr: 'la grand-mère', pos: 'nom', exampleEs: 'La abuela vive en el campo.', exampleFr: 'La grand-mère vit à la campagne.' },
      { id: 'a1-familia-esposo', es: 'el esposo', fr: 'le mari', pos: 'nom', exampleEs: 'Su esposo es profesor.', exampleFr: 'Son mari est professeur.' },
      { id: 'a1-familia-esposa', es: 'la esposa', fr: 'la femme (épouse)', pos: 'nom', exampleEs: 'La esposa de Juan habla francés.', exampleFr: 'La femme de Juan parle français.' },
      { id: 'a1-familia-amigo', es: 'el amigo', fr: "l'ami", pos: 'nom', exampleEs: 'Voy al cine con un amigo.', exampleFr: 'Je vais au cinéma avec un ami.' },
      { id: 'a1-familia-nino', es: 'el niño', fr: "l'enfant (garçon)", pos: 'nom', exampleEs: 'El niño juega en el parque.', exampleFr: "L'enfant joue dans le parc." },
    ],
  },
  {
    id: 'a1-numeros',
    title: 'Les nombres',
    emoji: '🔢',
    cards: [
      { id: 'a1-numeros-uno', es: 'uno', fr: 'un', pos: 'num.', exampleEs: 'Solo tengo un euro.', exampleFr: "Je n'ai qu'un euro." },
      { id: 'a1-numeros-dos', es: 'dos', fr: 'deux', pos: 'num.', exampleEs: 'Quiero dos cafés.', exampleFr: 'Je veux deux cafés.' },
      { id: 'a1-numeros-tres', es: 'tres', fr: 'trois', pos: 'num.', exampleEs: 'Hay tres libros en la mesa.', exampleFr: 'Il y a trois livres sur la table.' },
      { id: 'a1-numeros-cuatro', es: 'cuatro', fr: 'quatre', pos: 'num.', exampleEs: 'La casa tiene cuatro habitaciones.', exampleFr: 'La maison a quatre chambres.' },
      { id: 'a1-numeros-cinco', es: 'cinco', fr: 'cinq', pos: 'num.', exampleEs: 'Son las cinco de la tarde.', exampleFr: "Il est cinq heures de l'après-midi." },
      { id: 'a1-numeros-seis', es: 'seis', fr: 'six', pos: 'num.', exampleEs: 'Tengo seis años de experiencia.', exampleFr: "J'ai six ans d'expérience." },
      { id: 'a1-numeros-siete', es: 'siete', fr: 'sept', pos: 'num.', exampleEs: 'La semana tiene siete días.', exampleFr: 'La semaine a sept jours.' },
      { id: 'a1-numeros-ocho', es: 'ocho', fr: 'huit', pos: 'num.', exampleEs: 'El tren sale a las ocho.', exampleFr: 'Le train part à huit heures.' },
      { id: 'a1-numeros-nueve', es: 'nueve', fr: 'neuf', pos: 'num.', exampleEs: 'Mi hermano tiene nueve años.', exampleFr: 'Mon frère a neuf ans.' },
      { id: 'a1-numeros-diez', es: 'diez', fr: 'dix', pos: 'num.', exampleEs: 'Cuesta diez euros.', exampleFr: 'Ça coûte dix euros.' },
      { id: 'a1-numeros-veinte', es: 'veinte', fr: 'vingt', pos: 'num.', exampleEs: 'En la clase hay veinte alumnos.', exampleFr: 'Dans la classe il y a vingt élèves.' },
      { id: 'a1-numeros-cien', es: 'cien', fr: 'cent', pos: 'num.', exampleEs: 'El billete es de cien euros.', exampleFr: 'Le billet est de cent euros.' },
    ],
  },
];
