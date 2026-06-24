import { Deck } from '@/lib/types';

/**
 * Niveau A2 — élémentaire.
 * Vocabulaire de la vie quotidienne, regroupé par thèmes (organisation interne).
 * Chaque carte : mot espagnol + traduction française + phrase de contexte (ES/FR).
 */
export const a2Decks: Deck[] = [
  {
    id: 'a2-ciudad',
    title: 'En ville',
    emoji: '🏙️',
    cards: [
      { id: 'a2-ciudad-calle', es: 'la calle', fr: 'la rue', pos: 'nom', exampleEs: 'Vivo en una calle tranquila.', exampleFr: 'J\'habite dans une rue tranquille.' },
      { id: 'a2-ciudad-tienda', es: 'la tienda', fr: 'le magasin', pos: 'nom', exampleEs: 'La tienda abre a las nueve.', exampleFr: 'Le magasin ouvre à neuf heures.' },
      { id: 'a2-ciudad-mercado', es: 'el mercado', fr: 'le marché', pos: 'nom', exampleEs: 'Compro verduras en el mercado.', exampleFr: 'J\'achète des légumes au marché.' },
      { id: 'a2-ciudad-estacion', es: 'la estación', fr: 'la gare / station', pos: 'nom', exampleEs: 'La estación está al final de la calle.', exampleFr: 'La gare est au bout de la rue.' },
      { id: 'a2-ciudad-plaza', es: 'la plaza', fr: 'la place', pos: 'nom', exampleEs: 'Nos vemos en la plaza mayor.', exampleFr: 'On se retrouve sur la grand-place.' },
      { id: 'a2-ciudad-banco', es: 'el banco', fr: 'la banque', pos: 'nom', exampleEs: 'Tengo que ir al banco esta tarde.', exampleFr: 'Je dois aller à la banque cet après-midi.' },
      { id: 'a2-ciudad-izquierda', es: 'a la izquierda', fr: 'à gauche', pos: 'expr.', exampleEs: 'Gira a la izquierda en la esquina.', exampleFr: 'Tourne à gauche au coin.' },
      { id: 'a2-ciudad-derecha', es: 'a la derecha', fr: 'à droite', pos: 'expr.', exampleEs: 'El museo está a la derecha.', exampleFr: 'Le musée est à droite.' },
    ],
  },
  {
    id: 'a2-restaurante',
    title: 'Au restaurant',
    emoji: '🍷',
    cards: [
      { id: 'a2-restaurante-carta', es: 'la carta', fr: 'le menu', pos: 'nom', exampleEs: '¿Nos trae la carta, por favor?', exampleFr: 'Vous nous apportez le menu ?' },
      { id: 'a2-restaurante-cuenta', es: 'la cuenta', fr: 'l\'addition', pos: 'nom', exampleEs: 'La cuenta, por favor.', exampleFr: 'L\'addition, s\'il vous plaît.' },
      { id: 'a2-restaurante-camarero', es: 'el camarero', fr: 'le serveur', pos: 'nom', exampleEs: 'El camarero es muy amable.', exampleFr: 'Le serveur est très aimable.' },
      { id: 'a2-restaurante-plato', es: 'el plato', fr: 'le plat / l\'assiette', pos: 'nom', exampleEs: 'Este plato está delicioso.', exampleFr: 'Ce plat est délicieux.' },
      { id: 'a2-restaurante-bebida', es: 'la bebida', fr: 'la boisson', pos: 'nom', exampleEs: '¿Qué bebida quieres?', exampleFr: 'Quelle boisson veux-tu ?' },
      { id: 'a2-restaurante-postre', es: 'el postre', fr: 'le dessert', pos: 'nom', exampleEs: 'De postre, un helado.', exampleFr: 'Comme dessert, une glace.' },
      { id: 'a2-restaurante-probar', es: 'probar', fr: 'goûter / essayer', pos: 'verbe', exampleEs: 'Quiero probar la paella.', exampleFr: 'Je veux goûter la paella.' },
      { id: 'a2-restaurante-rico', es: 'rico', fr: 'délicieux', pos: 'adj.', exampleEs: '¡Qué rico está el pan!', exampleFr: 'Qu\'est-ce qu\'il est bon, ce pain !' },
    ],
  },
  {
    id: 'a2-ropa',
    title: 'Les vêtements',
    emoji: '👕',
    cards: [
      { id: 'a2-ropa-camisa', es: 'la camisa', fr: 'la chemise', pos: 'nom', exampleEs: 'Llevo una camisa blanca.', exampleFr: 'Je porte une chemise blanche.' },
      { id: 'a2-ropa-pantalon', es: 'el pantalón', fr: 'le pantalon', pos: 'nom', exampleEs: 'Este pantalón me queda bien.', exampleFr: 'Ce pantalon me va bien.' },
      { id: 'a2-ropa-zapatos', es: 'los zapatos', fr: 'les chaussures', pos: 'nom', exampleEs: 'Necesito zapatos nuevos.', exampleFr: 'J\'ai besoin de nouvelles chaussures.' },
      { id: 'a2-ropa-abrigo', es: 'el abrigo', fr: 'le manteau', pos: 'nom', exampleEs: 'Hace frío, ponte el abrigo.', exampleFr: 'Il fait froid, mets ton manteau.' },
      { id: 'a2-ropa-vestido', es: 'el vestido', fr: 'la robe', pos: 'nom', exampleEs: 'Lleva un vestido muy bonito.', exampleFr: 'Elle porte une très belle robe.' },
      { id: 'a2-ropa-llevar', es: 'llevar', fr: 'porter (un vêtement)', pos: 'verbe', exampleEs: 'Siempre lleva gafas de sol.', exampleFr: 'Il porte toujours des lunettes de soleil.' },
      { id: 'a2-ropa-talla', es: 'la talla', fr: 'la taille', pos: 'nom', exampleEs: '¿Qué talla usa?', exampleFr: 'Quelle taille faites-vous ?' },
    ],
  },
  {
    id: 'a2-viajes',
    title: 'Voyages & transports',
    emoji: '✈️',
    cards: [
      { id: 'a2-viajes-billete', es: 'el billete', fr: 'le billet', pos: 'nom', exampleEs: 'Compré un billete de tren.', exampleFr: 'J\'ai acheté un billet de train.' },
      { id: 'a2-viajes-avion', es: 'el avión', fr: 'l\'avion', pos: 'nom', exampleEs: 'El avión sale a las seis.', exampleFr: 'L\'avion part à six heures.' },
      { id: 'a2-viajes-maleta', es: 'la maleta', fr: 'la valise', pos: 'nom', exampleEs: 'Mi maleta es muy pesada.', exampleFr: 'Ma valise est très lourde.' },
      { id: 'a2-viajes-hotel', es: 'el hotel', fr: 'l\'hôtel', pos: 'nom', exampleEs: 'El hotel está cerca de la playa.', exampleFr: 'L\'hôtel est près de la plage.' },
      { id: 'a2-viajes-coche', es: 'el coche', fr: 'la voiture', pos: 'nom', exampleEs: 'Vamos en coche o en tren.', exampleFr: 'On y va en voiture ou en train.' },
      { id: 'a2-viajes-llegar', es: 'llegar', fr: 'arriver', pos: 'verbe', exampleEs: 'Llegamos mañana por la mañana.', exampleFr: 'Nous arrivons demain matin.' },
      { id: 'a2-viajes-salir', es: 'salir', fr: 'sortir / partir', pos: 'verbe', exampleEs: 'El autobús sale en cinco minutos.', exampleFr: 'Le bus part dans cinq minutes.' },
    ],
  },
  {
    id: 'a2-verbos',
    title: 'Verbes A2',
    emoji: '⚡',
    cards: [
      { id: 'a2-verbos-empezar', es: 'empezar', fr: 'commencer', pos: 'verbe', exampleEs: 'La película empieza ahora.', exampleFr: 'Le film commence maintenant.' },
      { id: 'a2-verbos-terminar', es: 'terminar', fr: 'finir / terminer', pos: 'verbe', exampleEs: 'Termino de trabajar a las seis.', exampleFr: 'Je finis de travailler à six heures.' },
      { id: 'a2-verbos-comprar', es: 'comprar', fr: 'acheter', pos: 'verbe', exampleEs: 'Voy a comprar el pan.', exampleFr: 'Je vais acheter le pain.' },
      { id: 'a2-verbos-pagar', es: 'pagar', fr: 'payer', pos: 'verbe', exampleEs: '¿Puedo pagar con tarjeta?', exampleFr: 'Je peux payer par carte ?' },
      { id: 'a2-verbos-encontrar', es: 'encontrar', fr: 'trouver', pos: 'verbe', exampleEs: 'No encuentro mi teléfono.', exampleFr: 'Je ne trouve pas mon téléphone.' },
      { id: 'a2-verbos-pensar', es: 'pensar', fr: 'penser', pos: 'verbe', exampleEs: 'Pienso que tienes razón.', exampleFr: 'Je pense que tu as raison.' },
      { id: 'a2-verbos-dormir', es: 'dormir', fr: 'dormir', pos: 'verbe', exampleEs: 'Duermo ocho horas cada noche.', exampleFr: 'Je dors huit heures chaque nuit.' },
      { id: 'a2-verbos-sentir', es: 'sentir', fr: 'sentir / ressentir', pos: 'verbe', exampleEs: 'Lo siento mucho.', exampleFr: 'Je suis vraiment désolé.' },
    ],
  },
  {
    id: 'a2-tiempo',
    title: 'Temps & météo',
    emoji: '🌤️',
    cards: [
      { id: 'a2-tiempo-sol', es: 'hace sol', fr: 'il y a du soleil', pos: 'expr.', exampleEs: 'Hoy hace sol y calor.', exampleFr: 'Aujourd\'hui il y a du soleil et il fait chaud.' },
      { id: 'a2-tiempo-lluvia', es: 'la lluvia', fr: 'la pluie', pos: 'nom', exampleEs: 'No me gusta la lluvia.', exampleFr: 'Je n\'aime pas la pluie.' },
      { id: 'a2-tiempo-frio', es: 'hace frío', fr: 'il fait froid', pos: 'expr.', exampleEs: 'En invierno hace mucho frío.', exampleFr: 'En hiver il fait très froid.' },
      { id: 'a2-tiempo-viento', es: 'el viento', fr: 'le vent', pos: 'nom', exampleEs: 'Hoy hay mucho viento.', exampleFr: 'Aujourd\'hui il y a beaucoup de vent.' },
      { id: 'a2-tiempo-verano', es: 'el verano', fr: 'l\'été', pos: 'nom', exampleEs: 'En verano vamos a la playa.', exampleFr: 'En été nous allons à la plage.' },
      { id: 'a2-tiempo-invierno', es: 'el invierno', fr: 'l\'hiver', pos: 'nom', exampleEs: 'El invierno es muy largo aquí.', exampleFr: 'L\'hiver est très long ici.' },
      { id: 'a2-tiempo-temprano', es: 'temprano', fr: 'tôt', pos: 'adv.', exampleEs: 'Me levanto temprano los lunes.', exampleFr: 'Je me lève tôt le lundi.' },
      { id: 'a2-tiempo-tarde', es: 'tarde', fr: 'tard', pos: 'adv.', exampleEs: 'Anoche me acosté tarde.', exampleFr: 'Hier soir je me suis couché tard.' },
    ],
  },
  {
    id: 'a2-adjetivos',
    title: 'Adjectifs utiles',
    emoji: '🌈',
    cards: [
      { id: 'a2-adjetivos-grande', es: 'grande', fr: 'grand', pos: 'adj.', exampleEs: 'Viven en una casa grande.', exampleFr: 'Ils vivent dans une grande maison.' },
      { id: 'a2-adjetivos-pequeno', es: 'pequeño', fr: 'petit', pos: 'adj.', exampleEs: 'Tengo un coche pequeño.', exampleFr: 'J\'ai une petite voiture.' },
      { id: 'a2-adjetivos-caro', es: 'caro', fr: 'cher', pos: 'adj.', exampleEs: 'Este reloj es muy caro.', exampleFr: 'Cette montre est très chère.' },
      { id: 'a2-adjetivos-barato', es: 'barato', fr: 'bon marché', pos: 'adj.', exampleEs: 'La fruta está barata hoy.', exampleFr: 'Les fruits sont bon marché aujourd\'hui.' },
      { id: 'a2-adjetivos-facil', es: 'fácil', fr: 'facile', pos: 'adj.', exampleEs: 'El examen fue fácil.', exampleFr: 'L\'examen était facile.' },
      { id: 'a2-adjetivos-dificil', es: 'difícil', fr: 'difficile', pos: 'adj.', exampleEs: 'El español no es difícil.', exampleFr: 'L\'espagnol n\'est pas difficile.' },
      { id: 'a2-adjetivos-cansado', es: 'cansado', fr: 'fatigué', pos: 'adj.', exampleEs: 'Estoy muy cansado hoy.', exampleFr: 'Je suis très fatigué aujourd\'hui.' },
      { id: 'a2-adjetivos-contento', es: 'contento', fr: 'content', pos: 'adj.', exampleEs: 'Estoy contento con el resultado.', exampleFr: 'Je suis content du résultat.' },
    ],
  },
  {
    id: 'a2-expresiones',
    title: 'Expressions courantes',
    emoji: '💬',
    cards: [
      { id: 'a2-expresiones-claro', es: '¡claro!', fr: 'bien sûr !', pos: 'expr.', exampleEs: '—¿Vienes? —¡Claro!', exampleFr: '— Tu viens ? — Bien sûr !' },
      { id: 'a2-expresiones-vale', es: 'vale', fr: 'd\'accord / ok', pos: 'expr.', exampleEs: 'Nos vemos a las ocho, ¿vale?', exampleFr: 'On se voit à huit heures, d\'accord ?' },
      { id: 'a2-expresiones-quiza', es: 'quizá', fr: 'peut-être', pos: 'adv.', exampleEs: 'Quizá llueva mañana.', exampleFr: 'Il pleuvra peut-être demain.' },
      { id: 'a2-expresiones-tambien', es: 'también', fr: 'aussi', pos: 'adv.', exampleEs: 'Yo también quiero ir.', exampleFr: 'Moi aussi je veux y aller.' },
      { id: 'a2-expresiones-tampoco', es: 'tampoco', fr: 'non plus', pos: 'adv.', exampleEs: 'Yo tampoco lo sé.', exampleFr: 'Moi non plus je ne le sais pas.' },
      { id: 'a2-expresiones-deprisa', es: 'deprisa', fr: 'vite', pos: 'adv.', exampleEs: 'Come deprisa, llegamos tarde.', exampleFr: 'Mange vite, on est en retard.' },
      { id: 'a2-expresiones-acuerdo', es: 'de acuerdo', fr: 'd\'accord', pos: 'expr.', exampleEs: 'Estoy de acuerdo contigo.', exampleFr: 'Je suis d\'accord avec toi.' },
    ],
  },
];
