import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { levels, levelCardIds } from '@/data/levels';
import { useProgress } from '@/store/progress';
import { colors, levelColors, radius, spacing, typography, shadow } from '@/lib/theme';
import { ProgressBar } from '@/components/ProgressBar';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { ready, dueCount, learnedCount } = useProgress();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: insets.bottom + spacing.xxl,
        paddingHorizontal: spacing.lg,
      }}
    >
      <Text style={styles.kicker}>¡Hola! 🇪🇸</Text>
      <Text style={styles.title}>Apprends l'espagnol</Text>
      <Text style={styles.subtitle}>
        Choisis un niveau et révise tes cartes chaque jour.
      </Text>

      <View style={{ height: spacing.lg }} />

      {levels.map((level) => {
        const ids = levelCardIds(level);
        const total = ids.length;
        const learned = ready ? learnedCount(ids) : 0;
        const due = ready ? dueCount(ids) : 0;
        const lc = levelColors[level.id];
        const available = total > 0;

        const inner = (
          <View style={[styles.card, shadow.card, !available && styles.cardDisabled]}>
            <View style={[styles.badge, { backgroundColor: lc.main }]}>
              <Text style={styles.badgeText}>{level.id}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.levelTitle}>{level.title}</Text>
              <Text style={styles.levelSubtitle}>
                {available ? `${total} cartes · ${learned} apprises` : level.subtitle}
              </Text>
              {available && (
                <View style={{ marginTop: spacing.sm }}>
                  <ProgressBar value={total ? learned / total : 0} color={lc.main} />
                </View>
              )}
            </View>
            {available && due > 0 && (
              <View style={styles.dueChip}>
                <Text style={styles.dueText}>{due}</Text>
              </View>
            )}
          </View>
        );

        return available ? (
          <Link key={level.id} href={`/level/${level.id}`} asChild>
            <Pressable>{inner}</Pressable>
          </Link>
        ) : (
          <View key={level.id}>{inner}</View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  kicker: { ...typography.heading, color: colors.terracotta },
  title: { ...typography.display, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSoft, marginTop: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  cardDisabled: { opacity: 0.55 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { ...typography.title, color: colors.textOnColor },
  levelTitle: { ...typography.heading, color: colors.text },
  levelSubtitle: { ...typography.caption, color: colors.textSoft, marginTop: 2 },
  dueChip: {
    minWidth: 32,
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.sun,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueText: { ...typography.caption, color: colors.text, fontWeight: '800' },
});
