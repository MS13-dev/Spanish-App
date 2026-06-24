import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { levels, levelCardIds } from '@/data/levels';
import { useApp } from '@/store/app';
import { colors, levelColors, spacing, typography, radius, shadow } from '@/lib/theme';
import { ProgressBar } from '@/components/ProgressBar';

export default function ProgressionScreen() {
  const insets = useSafeAreaInsets();
  const { levelCounts, streak, longestStreak, reviewedToday, successRate7d } = useApp();

  const rate = successRate7d === null ? '—' : `${Math.round(successRate7d * 100)} %`;

  // Totaux globaux.
  let totalMastered = 0;
  let totalCards = 0;
  for (const level of levels) {
    const ids = levelCardIds(level);
    if (ids.length === 0) continue;
    totalMastered += levelCounts(ids).mastered;
    totalCards += ids.length;
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
    >
      <View style={styles.statsGrid}>
        <Tile value={`${streak}`} label={`série (record ${longestStreak})`} emoji="🔥" />
        <Tile value={`${reviewedToday}`} label="révisées aujourd'hui" emoji="📅" />
        <Tile value={rate} label="réussite (7 j)" emoji="🎯" />
        <Tile value={`${totalMastered}`} label="cartes maîtrisées" emoji="🏆" />
      </View>

      <Text style={styles.sectionTitle}>Maîtrise par niveau</Text>
      <Text style={styles.help}>
        Une carte est « maîtrisée » quand tu la retiens depuis au moins 21 jours.
      </Text>

      {levels.map((level) => {
        const ids = levelCardIds(level);
        const total = ids.length;
        if (total === 0) {
          return (
            <View key={level.id} style={[styles.levelRow, shadow.soft, { opacity: 0.5 }]}>
              <Text style={styles.levelId}>{level.id}</Text>
              <Text style={styles.soon}>Bientôt disponible</Text>
            </View>
          );
        }
        const mastered = levelCounts(ids).mastered;
        const pct = Math.round((mastered / total) * 100);
        const lc = levelColors[level.id];
        return (
          <View key={level.id} style={[styles.levelRow, shadow.soft]}>
            <Text style={styles.levelId}>{level.id}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.levelTop}>
                <Text style={styles.levelName}>{level.title}</Text>
                <Text style={[styles.pct, { color: lc.main }]}>{pct} %</Text>
              </View>
              <ProgressBar value={mastered / total} color={lc.main} height={10} />
              <Text style={styles.levelSub}>{mastered}/{total} cartes</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

function Tile({ value, label, emoji }: { value: string; label: string; emoji: string }) {
  return (
    <View style={[styles.tile, shadow.soft]}>
      <Text style={styles.tileEmoji}>{emoji}</Text>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  tile: { width: '47%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center' },
  tileEmoji: { fontSize: 24 },
  tileValue: { fontSize: 28, fontWeight: '800', color: colors.text, marginTop: spacing.xs },
  tileLabel: { ...typography.caption, color: colors.textSoft, textAlign: 'center', marginTop: 2 },
  sectionTitle: { ...typography.heading, color: colors.text, marginTop: spacing.xl },
  help: { ...typography.caption, color: colors.textSoft, marginTop: spacing.xs, marginBottom: spacing.md },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  levelId: { ...typography.title, color: colors.text, width: 44 },
  levelTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  levelName: { ...typography.caption, color: colors.text, flex: 1 },
  pct: { ...typography.heading, fontWeight: '800' },
  levelSub: { ...typography.caption, color: colors.textSoft, marginTop: spacing.xs },
  soon: { ...typography.caption, color: colors.textSoft },
});
