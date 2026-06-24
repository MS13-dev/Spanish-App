import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgress } from '@/store/progress';
import { serializeExport, exportFileName, parseImport, ParsedImport } from '@/lib/backup';
import { downloadFile, pickFile, supported } from '@/lib/backupIO';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing, typography, radius, shadow } from '@/lib/theme';

type Status =
  | { kind: 'idle' }
  | { kind: 'success'; text: string }
  | { kind: 'error'; text: string };

export default function SauvegardeScreen() {
  const insets = useSafeAreaInsets();
  const { map, replaceProgress } = useProgress();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [pending, setPending] = useState<ParsedImport | null>(null);

  const savedCount = Object.keys(map).length;

  const onExport = () => {
    try {
      downloadFile(exportFileName(), serializeExport(map));
      setStatus({ kind: 'success', text: 'Sauvegarde téléchargée ✅' });
    } catch (e) {
      setStatus({ kind: 'error', text: (e as Error).message });
    }
  };

  const onPickRestore = async () => {
    setStatus({ kind: 'idle' });
    try {
      const text = await pickFile();
      const parsed = parseImport(text);
      setPending(parsed); // demande de confirmation avant d'écraser
    } catch (e) {
      setStatus({ kind: 'error', text: (e as Error).message });
    }
  };

  const confirmRestore = () => {
    if (!pending) return;
    replaceProgress(pending.progress);
    setStatus({
      kind: 'success',
      text: `Progression restaurée ✅ (${pending.cardCount} carte${pending.cardCount > 1 ? 's' : ''})`,
    });
    setPending(null);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingBottom: insets.bottom + spacing.xxl,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
      }}
    >
      <Text style={styles.title}>Sauvegarde</Text>
      <Text style={styles.intro}>
        Garde une copie de ta progression dans un fichier. Tu pourras la restaurer si tu
        changes de navigateur ou si tu vides le cache.
      </Text>

      <View style={[styles.infoCard, shadow.soft]}>
        <Text style={styles.infoNumber}>{savedCount}</Text>
        <Text style={styles.infoLabel}>élément(s) de progression enregistré(s)</Text>
      </View>

      {!supported && (
        <View style={[styles.warn, shadow.soft]}>
          <Text style={styles.warnText}>
            ℹ️ La sauvegarde dans un fichier fonctionne dans la version web (navigateur).
            Ouvre l'app dans ton navigateur pour l'utiliser.
          </Text>
        </View>
      )}

      <View style={{ height: spacing.lg }} />

      <PrimaryButton label="💾  Sauvegarder ma progression" onPress={onExport} />
      <View style={{ height: spacing.md }} />
      <PrimaryButton
        label="📂  Restaurer une sauvegarde"
        onPress={onPickRestore}
        color={colors.olive}
      />

      {pending && (
        <View style={[styles.confirm, shadow.card]}>
          <Text style={styles.confirmTitle}>Remplacer ta progression actuelle ?</Text>
          <Text style={styles.confirmText}>
            Cette sauvegarde contient {pending.cardCount} carte
            {pending.cardCount > 1 ? 's' : ''}. Ta progression actuelle sera remplacée.
          </Text>
          <View style={styles.confirmRow}>
            <PrimaryButton
              label="Annuler"
              onPress={() => setPending(null)}
              color={colors.textSoft}
              style={{ flex: 1 }}
            />
            <View style={{ width: spacing.sm }} />
            <PrimaryButton
              label="Oui, restaurer"
              onPress={confirmRestore}
              color={colors.terracotta}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}

      {status.kind !== 'idle' && (
        <View
          style={[
            styles.status,
            { backgroundColor: status.kind === 'success' ? colors.good : colors.again },
          ]}
        >
          <Text style={styles.statusText}>{status.text}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  intro: { ...typography.body, color: colors.textSoft, marginTop: spacing.sm, lineHeight: 22 },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  infoNumber: { fontSize: 40, fontWeight: '800', color: colors.terracotta },
  infoLabel: { ...typography.caption, color: colors.textSoft, marginTop: spacing.xs },
  warn: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  warnText: { ...typography.body, color: colors.text, lineHeight: 22 },
  confirm: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  confirmTitle: { ...typography.heading, color: colors.text },
  confirmText: { ...typography.body, color: colors.textSoft, marginTop: spacing.sm, lineHeight: 22 },
  confirmRow: { flexDirection: 'row', marginTop: spacing.lg },
  status: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  statusText: { ...typography.body, color: colors.textOnColor, fontWeight: '700', textAlign: 'center' },
});
