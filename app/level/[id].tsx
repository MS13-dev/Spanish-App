import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { getLevel, levelCardIds } from '@/data/levels';
import { useApp } from '@/store/app';
import { colors, levelColors, radius, spacing, typography, shadow } from '@/lib/theme';
import { ProgressBar } from '@/components/ProgressBar';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function LevelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { ready, levelCounts } = useApp();
  const level = getLevel(id);

  if (!level) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Niveau introuvable.</Text>
      </View>
    );
  }

  const ids = levelCardIds(level);
  const total = ids.length;
  const c = ready ? levelCounts(ids) : null;
  const lc = levelColors[level.id];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + spacing.xl, paddingTop: spacing.md }]}>
      <Stack.Screen options={{ title: level.id }} />

      <View>
        <Text style={styles.title}>{level.title}</Text>
        <Text style={styles.subtitle}>{level.subtitle}</Text>

        <View style={[styles.statsCard, shadow.card]}>
          <View style={styles.statRow}>
            <Stat value={c ? c.today : 0} label="à réviser" color={lc.main} />
            <Stat value={c ? c.mastered : 0} label="maîtrisées" color={colors.good} />
            <Stat value={total} label="au total" color={colors.textSoft} />
          </View>
          <View style={{ marginTop: spacing.md }}>
            <ProgressBar value={c && total ? c.mastered / total : 0} color={lc.main} />
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <PrimaryButton
        label={c && c.today > 0 ? `Commencer (${c.today})` : 'Réviser maintenant'}
        onPress={() => router.push(`/review/${level.id}`)}
        color={lc.main}
      />
      <Pressable onPress={() => router.push(`/review/${level.id}?all=1`)} style={styles.secondary}>
        <Text style={styles.secondaryText}>Tout revoir ({total} cartes)</Text>
      </Pressable>
      <Text style={styles.hint}>
        Les cartes s'enchaînent dans le meilleur ordre pour mémoriser.
      </Text>
    </View>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  muted: { ...typography.body, color: colors.textSoft },
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSoft, marginTop: spacing.xs },
  statsCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 30, fontWeight: '800' },
  statLabel: { ...typography.caption, color: colors.textSoft, marginTop: 2 },
  secondary: { paddingVertical: spacing.md, alignItems: 'center' },
  secondaryText: { ...typography.body, color: colors.textSoft, fontWeight: '700', textDecorationLine: 'underline' },
  hint: { ...typography.caption, color: colors.textSoft, textAlign: 'center', marginTop: spacing.xs },
});
