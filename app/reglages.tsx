import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useApp } from '@/store/app';
import { DirectionSetting, GradingMode } from '@/lib/types';
import { colors, spacing, typography, radius, shadow } from '@/lib/theme';

export default function ReglagesScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useApp();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
    >
      <Section title="Apprentissage">
        <Stepper
          label="Nouvelles cartes par jour"
          help="Pour ne pas être submergé·e."
          value={settings.newCardsPerDay}
          onChange={(v) => updateSettings({ newCardsPerDay: v })}
          min={5}
          max={40}
          step={5}
        />
        <Stepper
          label="Objectif quotidien"
          help="Nombre de cartes à réviser chaque jour."
          value={settings.dailyGoal}
          onChange={(v) => updateSettings({ dailyGoal: v })}
          min={5}
          max={100}
          step={5}
        />
      </Section>

      <Section title="Révision">
        <Segmented<GradingMode>
          label="Façon de noter"
          value={settings.gradingMode}
          onChange={(v) => updateSettings({ gradingMode: v })}
          options={[
            { value: 'simple', label: 'Simple (2 choix)' },
            { value: 'detailed', label: 'Détaillée (4 choix)' },
          ]}
        />
        <Segmented<DirectionSetting>
          label="Sens des cartes"
          value={settings.direction}
          onChange={(v) => updateSettings({ direction: v })}
          options={[
            { value: 'recognition', label: 'ES → FR' },
            { value: 'production', label: 'FR → ES' },
            { value: 'mixed', label: 'Mixte' },
          ]}
        />
        <Toggle
          label="Prononciation automatique"
          help="Lit le mot espagnol quand on retourne la carte."
          value={settings.autoPlayAudio}
          onChange={(v) => updateSettings({ autoPlayAudio: v })}
        />
      </Section>

      <Section title="Affichage">
        <Segmented<number>
          label="Taille du texte"
          value={settings.textScale}
          onChange={(v) => updateSettings({ textScale: v })}
          options={[
            { value: 0.9, label: 'Petit' },
            { value: 1, label: 'Normal' },
            { value: 1.2, label: 'Grand' },
            { value: 1.4, label: 'Très grand' },
          ]}
        />
      </Section>

      <Section title="Mes données">
        <LinkRow href="/profils" emoji="👥" label="Gérer les profils" />
        <LinkRow href="/sauvegarde" emoji="💾" label="Sauvegarder / Restaurer" />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={[styles.card, shadow.soft]}>{children}</View>
    </View>
  );
}

function Stepper({
  label, help, value, onChange, min, max, step,
}: { label: string; help?: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {help ? <Text style={styles.rowHelp}>{help}</Text> : null}
      </View>
      <View style={styles.stepper}>
        <Pressable style={styles.stepBtn} onPress={() => onChange(Math.max(min, value - step))} hitSlop={6}>
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable style={styles.stepBtn} onPress={() => onChange(Math.min(max, value + step))} hitSlop={6}>
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Segmented<T extends string | number>({
  label, value, onChange, options,
}: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <View style={styles.rowCol}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.segment}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={String(o.value)}
              onPress={() => onChange(o.value)}
              style={[styles.segBtn, active && styles.segBtnActive]}
            >
              <Text style={[styles.segText, active && styles.segTextActive]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Toggle({ label, help, value, onChange }: { label: string; help?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {help ? <Text style={styles.rowHelp}>{help}</Text> : null}
      </View>
      <Pressable
        onPress={() => onChange(!value)}
        style={[styles.toggle, { backgroundColor: value ? colors.good : colors.border }]}
      >
        <View style={[styles.knob, { alignSelf: value ? 'flex-end' : 'flex-start' }]} />
      </Pressable>
    </View>
  );
}

function LinkRow({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <Link href={href as any} asChild>
      <Pressable style={styles.row}>
        <Text style={{ fontSize: 22, marginRight: spacing.sm }}>{emoji}</Text>
        <Text style={[styles.rowLabel, { flex: 1 }]}>{label}</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...typography.caption, color: colors.textSoft, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm, marginLeft: spacing.xs },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, paddingHorizontal: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowCol: { paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  rowLabel: { ...typography.body, color: colors.text },
  rowHelp: { ...typography.caption, color: colors.textSoft, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 22, fontWeight: '800', color: colors.terracotta },
  stepValue: { ...typography.heading, color: colors.text, minWidth: 32, textAlign: 'center' },
  segment: { flexDirection: 'row', backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, padding: 4, marginTop: spacing.sm },
  segBtn: { flex: 1, paddingVertical: 8, borderRadius: radius.pill, alignItems: 'center' },
  segBtnActive: { backgroundColor: colors.terracotta },
  segText: { ...typography.caption, color: colors.textSoft },
  segTextActive: { color: colors.textOnColor, fontWeight: '800' },
  toggle: { width: 56, height: 32, borderRadius: 16, padding: 3, justifyContent: 'center' },
  knob: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.surface, ...shadow.soft },
  chevron: { fontSize: 26, color: colors.textSoft },
});
