import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Card, Direction } from '@/lib/types';
import { colors, radius, typography, shadow, spacing } from '@/lib/theme';

interface Props {
  card: Card;
  /** Sens : recognition = espagnol au recto ; production = français au recto. */
  direction: Direction;
  /** Réinitialise la face visible quand la carte change. */
  resetKey: string | number;
  onFlip?: (flipped: boolean) => void;
  /** Facteur de taille du texte (accessibilité). */
  textScale?: number;
}

/**
 * Carte qui se retourne au toucher.
 * - recognition : recto = mot espagnol, verso = traduction française
 * - production  : recto = mot français, verso = mot espagnol (à produire)
 * La phrase de contexte (ES + FR) s'affiche toujours au verso.
 */
export function Flashcard({ card, direction, resetKey, onFlip, textScale = 1 }: Props) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = 0;
  }, [resetKey, progress]);

  const flip = () => {
    const next = progress.value < 0.5 ? 1 : 0;
    progress.value = withTiming(next, { duration: 420 });
    onFlip?.(next === 1);
  };

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
    opacity: progress.value < 0.5 ? 1 : 0,
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${interpolate(progress.value, [0, 1], [180, 360])}deg` }],
    opacity: progress.value < 0.5 ? 0 : 1,
  }));

  const frontWord = direction === 'recognition' ? card.es : card.fr;
  const backWord = direction === 'recognition' ? card.fr : card.es;
  const s = textScale;

  return (
    <Pressable onPress={flip} style={styles.wrapper}>
      <Animated.View style={[styles.card, styles.front, frontStyle]}>
        {card.pos ? <Text style={styles.pos}>{card.pos}</Text> : null}
        <Text style={[styles.word, { fontSize: 40 * s }]}>{frontWord}</Text>
        <Text style={[styles.hint, { fontSize: 13 * s }]}>
          Touchez pour voir {direction === 'recognition' ? 'la traduction' : "le mot espagnol"}
        </Text>
      </Animated.View>

      <Animated.View style={[styles.card, styles.back, backStyle]}>
        <Text style={[styles.translation, { fontSize: 32 * s }]}>{backWord}</Text>
        <View style={styles.divider} />
        <Text style={[styles.exampleEs, { fontSize: 19 * s }]}>« {card.exampleEs} »</Text>
        <Text style={[styles.exampleFr, { fontSize: 16 * s }]}>{card.exampleFr}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', height: 340 },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    ...shadow.card,
  },
  front: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border },
  back: { backgroundColor: colors.terracotta },
  pos: {
    ...typography.caption,
    color: colors.textSoft,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  word: { fontWeight: '800', color: colors.text, textAlign: 'center' },
  hint: { color: colors.textSoft, marginTop: spacing.lg, fontWeight: '600' },
  translation: { fontWeight: '800', color: colors.textOnColor, textAlign: 'center', marginBottom: spacing.md },
  divider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginVertical: spacing.md,
  },
  exampleEs: { color: colors.textOnColor, textAlign: 'center', fontStyle: 'italic', marginBottom: spacing.sm, fontWeight: '700' },
  exampleFr: { color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontWeight: '500' },
});
