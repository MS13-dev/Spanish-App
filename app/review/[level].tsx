import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { getLevel, getLevelCards } from '@/data/levels';
import { useProgress } from '@/store/progress';
import { isDue, formatInterval } from '@/lib/srs';
import { Grade, Card } from '@/lib/types';
import { Flashcard } from '@/components/Flashcard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, spacing, typography, radius, shadow } from '@/lib/theme';

const GRADES: { grade: Grade; label: string; color: string }[] = [
  { grade: 'again', label: 'À revoir', color: colors.again },
  { grade: 'hard', label: 'Difficile', color: colors.hard },
  { grade: 'good', label: 'Correct', color: colors.good },
  { grade: 'easy', label: 'Facile', color: colors.easy },
];

/** Mélange une copie du tableau (Fisher-Yates). */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ReviewScreen() {
  const { level: levelId } = useLocalSearchParams<{ level: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { map, grade, get } = useProgress();

  const level = getLevel(levelId ?? '');

  // File figée à l'entrée : cartes dues d'abord, puis les autres, le tout mélangé.
  const queue = useMemo<Card[]>(() => {
    const cards = getLevelCards(levelId ?? '');
    if (cards.length === 0) return [];
    const due = shuffle(cards.filter((c) => isDue(map[c.id])));
    return due.length > 0 ? due : shuffle(cards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(0);

  if (!level || queue.length === 0) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '' }} />
        <Text style={styles.muted}>Aucune carte à réviser pour ce niveau.</Text>
        <View style={{ height: spacing.lg }} />
        <PrimaryButton label="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  if (index >= queue.length) {
    return (
      <View style={[styles.center, { padding: spacing.lg }]}>
        <Stack.Screen options={{ title: level.id }} />
        <Text style={styles.celebrate}>¡Muy bien! 🎉</Text>
        <Text style={styles.summary}>
          Tu as révisé {done} carte{done > 1 ? 's' : ''} en {level.id}.
        </Text>
        <View style={{ height: spacing.xl }} />
        <PrimaryButton label="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  const card = queue[index];

  const onGrade = (g: Grade) => {
    grade(card.id, g);
    setDone((d) => d + 1);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <View style={[styles.container, { paddingTop: spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>
      <Stack.Screen options={{ title: level.id }} />

      <View style={styles.header}>
        <Text style={styles.counter}>
          {index + 1} / {queue.length}
        </Text>
        <ProgressBar value={index / queue.length} />
      </View>

      <View style={styles.cardArea}>
        <Flashcard card={card} resetKey={card.id} onFlip={setFlipped} />
      </View>

      <View style={styles.footer}>
        {!flipped ? (
          <Text style={styles.tapHint}>Touche la carte pour la retourner</Text>
        ) : (
          <View style={styles.grades}>
            {GRADES.map(({ grade: g, label, color }) => (
              <Pressable
                key={g}
                onPress={() => onGrade(g)}
                style={({ pressed }) => [
                  styles.gradeBtn,
                  { backgroundColor: color, opacity: pressed ? 0.85 : 1 },
                  shadow.soft,
                ]}
              >
                <Text style={styles.gradeLabel}>{label}</Text>
                <Text style={styles.gradeInterval}>{formatInterval(g, get(card.id))}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  muted: { ...typography.body, color: colors.textSoft, textAlign: 'center' },
  header: { marginBottom: spacing.lg, gap: spacing.sm },
  counter: { ...typography.caption, color: colors.textSoft, textAlign: 'center' },
  cardArea: { flex: 1, justifyContent: 'center' },
  footer: { minHeight: 96, justifyContent: 'center' },
  tapHint: { ...typography.body, color: colors.textSoft, textAlign: 'center' },
  grades: { flexDirection: 'row', gap: spacing.sm },
  gradeBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  gradeLabel: { ...typography.caption, color: colors.textOnColor, fontWeight: '800' },
  gradeInterval: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  celebrate: { ...typography.display, color: colors.terracotta, textAlign: 'center' },
  summary: { ...typography.body, color: colors.text, textAlign: 'center', marginTop: spacing.md },
});
