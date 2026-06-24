import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { levels, levelCardIds } from '@/data/levels';
import { useApp } from '@/store/app';
import { colors, levelColors, radius, spacing, typography, shadow } from '@/lib/theme';
import { ProgressBar } from '@/components/ProgressBar';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { ready, activeProfile, levelCounts, streak, reviewedToday, settings } = useApp();

  const goal = settings.dailyGoal;
  const goalPct = goal > 0 ? Math.min(1, reviewedToday / goal) : 0;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.md,
        paddingBottom: insets.bottom + spacing.xxl,
        paddingHorizontal: spacing.lg,
      }}
    >
      {/* Barre du haut : profil + réglages */}
      <View style={styles.topRow}>
        <Link href="/profils" asChild>
          <Pressable style={styles.profileChip} hitSlop={8}>
            <Text style={styles.profileEmoji}>{activeProfile?.emoji}</Text>
            <Text style={styles.profileName}>{activeProfile?.name}</Text>
          </Pressable>
        </Link>
        <Link href="/reglages" asChild>
          <Pressable style={styles.gear} hitSlop={12}>
            <Text style={styles.gearIcon}>⚙️</Text>
          </Pressable>
        </Link>
      </View>

      <Text style={styles.kicker}>¡Hola! 🇪🇸</Text>
      <Text style={styles.title}>Apprends l'espagnol</Text>

      {/* Objectif du jour + série */}
      <View style={[styles.goalCard, shadow.card]}>
        <View style={styles.goalRow}>
          <View>
            <Text style={styles.goalLabel}>Objectif du jour</Text>
            <Text style={styles.goalValue}>
              {ready ? reviewedToday : 0} / {goal} cartes
            </Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakNum}>{ready ? streak : 0}</Text>
            <Text style={styles.streakLabel}>jour{streak > 1 ? 's' : ''}</Text>
          </View>
        </View>
        <View style={{ marginTop: spacing.md }}>
          <ProgressBar value={goalPct} color={colors.sun} />
        </View>
        {ready && reviewedToday >= goal && goal > 0 && (
          <Text style={styles.goalDone}>Objectif atteint, bravo ! 🎉</Text>
        )}
      </View>

      {/* Accès rapides */}
      <View style={styles.quickRow}>
        <QuickLink href="/progression" emoji="📊" label="Progression" />
        <QuickLink href="/difficiles" emoji="🎯" label="À renforcer" />
      </View>

      <Text style={styles.sectionTitle}>Niveaux</Text>

      {levels.map((level) => {
        const ids = levelCardIds(level);
        const total = ids.length;
        const c = ready && total ? levelCounts(ids) : null;
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
                {available
                  ? `${c ? c.mastered : 0}/${total} maîtrisées`
                  : level.subtitle}
              </Text>
              {available && (
                <View style={{ marginTop: spacing.sm }}>
                  <ProgressBar value={c && total ? c.mastered / total : 0} color={lc.main} />
                </View>
              )}
            </View>
            {available && c && c.today > 0 && (
              <View style={[styles.dueChip, { backgroundColor: lc.main }]}>
                <Text style={styles.dueText}>{c.today}</Text>
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

function QuickLink({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <Link href={href as any} asChild>
      <Pressable style={[styles.quick, shadow.soft]}>
        <Text style={styles.quickEmoji}>{emoji}</Text>
        <Text style={styles.quickLabel}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    ...shadow.soft,
  },
  profileEmoji: { fontSize: 18 },
  profileName: { ...typography.caption, color: colors.text },
  gear: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  gearIcon: { fontSize: 20 },
  kicker: { ...typography.heading, color: colors.terracotta, marginTop: spacing.lg },
  title: { ...typography.display, color: colors.text, marginTop: spacing.xs },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  goalLabel: { ...typography.caption, color: colors.textSoft },
  goalValue: { ...typography.title, color: colors.text, marginTop: 2 },
  streakBadge: { alignItems: 'center' },
  streakFire: { fontSize: 22 },
  streakNum: { ...typography.heading, color: colors.terracotta },
  streakLabel: { ...typography.caption, color: colors.textSoft },
  goalDone: { ...typography.caption, color: colors.good, marginTop: spacing.sm, fontWeight: '800' },
  quickRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  quick: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  quickEmoji: { fontSize: 22 },
  quickLabel: { ...typography.caption, color: colors.text },
  sectionTitle: { ...typography.heading, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
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
  badge: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  badgeText: { ...typography.title, color: colors.textOnColor },
  levelTitle: { ...typography.heading, color: colors.text },
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
