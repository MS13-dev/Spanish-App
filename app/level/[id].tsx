import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, Stack } from 'expo-router';
import { getLevel } from '@/data/levels';
import { useProgress } from '@/store/progress';
import { colors, levelColors, radius, spacing, typography, shadow } from '@/lib/theme';
import { ProgressBar } from '@/components/ProgressBar';

export default function LevelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { ready, dueCount, learnedCount } = useProgress();
  const level = getLevel(id);

  if (!level) {
    return (
      <View style={styles.center}>
        <Text style={styles.levelSubtitle}>Niveau introuvable.</Text>
      </View>
    );
  }

  const lc = levelColors[level.id];

  return (
    <>
      <Stack.Screen options={{ title: level.id }} />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + spacing.xxl,
          paddingHorizontal: spacing.lg,
        }}
      >
        <Text style={styles.title}>{level.title}</Text>
        <Text style={styles.subtitle}>Choisis un thème à réviser</Text>
        <View style={{ height: spacing.md }} />

        {level.decks.map((deck) => {
          const ids = deck.cards.map((c) => c.id);
          const learned = ready ? learnedCount(ids) : 0;
          const due = ready ? dueCount(ids) : 0;
          return (
            <Link key={deck.id} href={`/review/${deck.id}?level=${level.id}`} asChild>
              <Pressable>
                <View style={[styles.card, shadow.soft]}>
                  <Text style={styles.emoji}>{deck.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deckTitle}>{deck.title}</Text>
                    <Text style={styles.levelSubtitle}>
                      {deck.cards.length} cartes · {learned} apprises
                    </Text>
                    <View style={{ marginTop: spacing.sm }}>
                      <ProgressBar
                        value={deck.cards.length ? learned / deck.cards.length : 0}
                        color={lc.main}
                        height={8}
                      />
                    </View>
                  </View>
                  {due > 0 && (
                    <View style={[styles.dueChip, { backgroundColor: lc.main }]}>
                      <Text style={styles.dueText}>{due}</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            </Link>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSoft, marginTop: spacing.xs },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  emoji: { fontSize: 34 },
  deckTitle: { ...typography.heading, color: colors.text },
  levelSubtitle: { ...typography.caption, color: colors.textSoft, marginTop: 2 },
  dueChip: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueText: { ...typography.caption, color: colors.textOnColor, fontWeight: '800' },
});
