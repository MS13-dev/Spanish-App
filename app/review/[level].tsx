import { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { getLevel } from '@/data/levels';
import { useApp } from '@/store/app';
import { formatInterval } from '@/lib/srs';
import { QueueItem } from '@/lib/scheduler';
import { Grade } from '@/lib/types';
import { speak, speechSupported } from '@/lib/speech';
import { Flashcard } from '@/components/Flashcard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Encouragement } from '@/components/Encouragement';
import { colors, spacing, typography, radius, shadow } from '@/lib/theme';

const DETAILED: { grade: Grade; label: string; color: string }[] = [
  { grade: 'again', label: 'À revoir', color: colors.again },
  { grade: 'hard', label: 'Difficile', color: colors.hard },
  { grade: 'good', label: 'Correct', color: colors.good },
  { grade: 'easy', label: 'Facile', color: colors.easy },
];

const SIMPLE: { grade: Grade; label: string; color: string }[] = [
  { grade: 'again', label: 'Je ne savais pas', color: colors.again },
  { grade: 'good', label: 'Je savais', color: colors.good },
];

export default function ReviewScreen() {
  const { level: levelId, all } = useLocalSearchParams<{ level: string; all?: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { buildLevelQueue, gradeCard, getProgress, settings } = useApp();

  const level = getLevel(levelId ?? '');
  const reviewAll = all === '1';

  // File figée à l'entrée.
  const initialQueue = useMemo<QueueItem[]>(() => {
    const cards = level?.decks.flatMap((d) => d.cards) ?? [];
    return buildLevelQueue(cards, reviewAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId, reviewAll]);

  const [list, setList] = useState<QueueItem[]>(initialQueue);
  const [index, setIndex] = useState(0);
  const [failures, setFailures] = useState<QueueItem[]>([]);
  const [phase, setPhase] = useState<'main' | 'errors'>('main');
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [goodStreak, setGoodStreak] = useState(0);

  const item = list[index];

  const onFlip = useCallback(
    (isFlipped: boolean) => {
      setFlipped(isFlipped);
      if (isFlipped && settings.autoPlayAudio && item) speak(item.card.es);
    },
    [settings.autoPlayAudio, item]
  );

  // Réinitialise quand la file de départ change.
  useEffect(() => {
    setList(initialQueue);
    setIndex(0);
    setFailures([]);
    setPhase('main');
  }, [initialQueue]);

  // Fin d'une liste : enchaîne sur la reprise des erreurs s'il y en a.
  useEffect(() => {
    if (list.length > 0 && index >= list.length && failures.length > 0) {
      setList(failures);
      setFailures([]);
      setIndex(0);
      setPhase('errors');
      setFlipped(false);
    }
  }, [index, list.length, failures]);

  if (!level || list.length === 0) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: level?.id ?? '' }} />
        <Text style={styles.celebrate}>Rien à réviser ! 🎉</Text>
        <Text style={styles.muted}>
          Tu es à jour pour aujourd'hui. Reviens demain, ou choisis « Tout revoir ».
        </Text>
        <View style={{ height: spacing.lg }} />
        <PrimaryButton label="Retour" onPress={() => router.back()} />
      </View>
    );
  }

  // Fin d'une liste.
  if (index >= list.length) {
    if (failures.length > 0) {
      // La transition vers la reprise des erreurs est gérée par l'effet ci-dessus.
      return null;
    }
    return (
      <View style={[styles.center, { padding: spacing.lg }]}>
        <Stack.Screen options={{ title: level.id }} />
        <Text style={styles.celebrate}>¡Muy bien! 🎉</Text>
        <Text style={styles.summary}>
          Tu as révisé {reviewed} carte{reviewed > 1 ? 's' : ''} en {level.id}.
        </Text>
        <Text style={styles.muted}>Toutes les erreurs ont été reprises et validées.</Text>
        <View style={{ height: spacing.xl }} />
        <PrimaryButton label="Terminer" onPress={() => router.back()} />
      </View>
    );
  }

  const buttons = settings.gradingMode === 'simple' ? SIMPLE : DETAILED;

  const onGrade = (g: Grade) => {
    gradeCard(item.card.id, item.direction, g);
    setReviewed((n) => n + 1);
    if (g === 'good' || g === 'easy') setGoodStreak((s) => s + 1);
    if (g === 'again') setFailures((f) => [...f, item]);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <View style={[styles.container, { paddingTop: spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>
      <Stack.Screen options={{ title: level.id }} />

      <View style={styles.header}>
        <Text style={styles.counter}>
          {phase === 'errors' ? 'Reprise des erreurs · ' : ''}
          {index + 1} / {list.length}
        </Text>
        <ProgressBar value={index / list.length} />
      </View>

      <View style={styles.cardArea}>
        <Flashcard
          card={item.card}
          direction={item.direction}
          resetKey={`${phase}-${index}-${item.card.id}`}
          onFlip={onFlip}
          textScale={settings.textScale}
        />
        <Encouragement trigger={goodStreak} />
      </View>

      <View style={styles.footer}>
        {speechSupported && (
          <Pressable onPress={() => speak(item.card.es)} style={styles.audioBtn} hitSlop={8}>
            <Text style={styles.audioIcon}>🔊</Text>
            <Text style={styles.audioLabel}>Écouter</Text>
          </Pressable>
        )}

        {!flipped ? (
          <Text style={styles.tapHint}>Touche la carte pour la retourner</Text>
        ) : (
          <View style={styles.grades}>
            {buttons.map(({ grade: g, label, color }) => (
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
                <Text style={styles.gradeInterval}>
                  {formatInterval(g, getProgress(item.card.id, item.direction))}
                </Text>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  muted: { ...typography.body, color: colors.textSoft, textAlign: 'center', marginTop: spacing.sm },
  header: { marginBottom: spacing.lg, gap: spacing.sm },
  counter: { ...typography.caption, color: colors.textSoft, textAlign: 'center' },
  cardArea: { flex: 1, justifyContent: 'center' },
  footer: { minHeight: 140, justifyContent: 'flex-end', gap: spacing.md },
  audioBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    ...shadow.soft,
  },
  audioIcon: { fontSize: 18 },
  audioLabel: { ...typography.caption, color: colors.text },
  tapHint: { ...typography.body, color: colors.textSoft, textAlign: 'center', paddingBottom: spacing.lg },
  grades: { flexDirection: 'row', gap: spacing.sm },
  gradeBtn: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  gradeLabel: { ...typography.caption, color: colors.textOnColor, fontWeight: '800', textAlign: 'center' },
  gradeInterval: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  celebrate: { ...typography.display, color: colors.terracotta, textAlign: 'center' },
  summary: { ...typography.body, color: colors.text, textAlign: 'center', marginTop: spacing.md },
});
