import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Card } from '@/lib/types';
import { colors, radius, typography, shadow, spacing } from '@/lib/theme';

interface Props {
  card: Card;
  /** Réinitialise la face visible quand la carte change. */
  resetKey: string | number;
  onFlip?: (flipped: boolean) => void;
}

/**
 * Carte qui se retourne au toucher (recto espagnol → verso français + contexte).
 * Animation de flip 3D fluide via Reanimated.
 */
export function Flashcard({ card, resetKey, onFlip }: Props) {
  const progress = useSharedValue(0); // 0 = recto, 1 = verso

  // Remet la carte sur le recto quand on passe à une nouvelle carte.
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

  return (
    <Pressable onPress={flip} style={styles.wrapper}>
      {/* Recto : mot espagnol */}
      <Animated.View style={[styles.card, styles.front, frontStyle]}>
        {card.pos ? <Text style={styles.pos}>{card.pos}</Text> : null}
        <Text style={styles.word}>{card.es}</Text>
        <Text style={styles.hint}>Touchez pour voir la traduction</Text>
      </Animated.View>

      {/* Verso : traduction + phrase de contexte */}
      <Animated.View style={[styles.card, styles.back, backStyle]}>
        <Text style={styles.translation}>{card.fr}</Text>
        <View style={styles.divider} />
        <Text style={styles.exampleEs}>« {card.exampleEs} »</Text>
        <Text style={styles.exampleFr}>{card.exampleFr}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 340,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    ...shadow.card,
  },
  front: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  back: {
    backgroundColor: colors.terracotta,
  },
  pos: {
    ...typography.caption,
    color: colors.textSoft,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  word: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  hint: {
    ...typography.caption,
    color: colors.textSoft,
    marginTop: spacing.lg,
  },
  translation: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textOnColor,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  divider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginVertical: spacing.md,
  },
  exampleEs: {
    ...typography.heading,
    color: colors.textOnColor,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  exampleFr: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
});
