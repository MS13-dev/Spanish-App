import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/store/app';
import { getCardById } from '@/data/levels';
import { colors, spacing, typography, radius, shadow } from '@/lib/theme';

/** Seuil : en dessous de cette facilité, la carte a été ratée plusieurs fois. */
const HARD_EASE = 2.3;

export default function DifficilesScreen() {
  const insets = useSafeAreaInsets();
  const { activeData } = useApp();

  // Regroupe par carte la facilité minimale observée (tous sens confondus).
  const hardest = new Map<string, number>();
  for (const [key, p] of Object.entries(activeData.progress)) {
    if (!p || p.lastReviewed === 0) continue;
    const cardId = key.slice(0, key.lastIndexOf(':'));
    const prev = hardest.get(cardId);
    if (prev === undefined || p.ease < prev) hardest.set(cardId, p.ease);
  }

  const list = [...hardest.entries()]
    .filter(([, ease]) => ease < HARD_EASE)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 40)
    .map(([id]) => getCardById(id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
    >
      <Text style={styles.intro}>
        Les mots que tu rates le plus souvent, tous niveaux confondus. Ils reviendront plus
        souvent dans tes révisions.
      </Text>

      {list.length === 0 ? (
        <View style={[styles.empty, shadow.soft]}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyText}>
            Aucune carte difficile pour l'instant. Continue tes révisions !
          </Text>
        </View>
      ) : (
        list.map((card) => (
          <View key={card.id} style={[styles.row, shadow.soft]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.es}>{card.es}</Text>
              <Text style={styles.fr}>{card.fr}</Text>
            </View>
            <Text style={styles.tag}>à renforcer</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.textSoft, marginTop: spacing.sm, marginBottom: spacing.md, lineHeight: 22 },
  empty: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center' },
  emptyEmoji: { fontSize: 36 },
  emptyText: { ...typography.body, color: colors.textSoft, textAlign: 'center', marginTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm },
  es: { ...typography.heading, color: colors.text },
  fr: { ...typography.caption, color: colors.textSoft, marginTop: 2 },
  tag: { ...typography.caption, color: colors.hard, fontWeight: '800' },
});
