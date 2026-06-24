import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/store/app';
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
  const { activeProfile, activeData, replaceActiveData } = useApp();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [pending, setPending] = useState<ParsedImport | null>(null);

  const savedCount = Object.keys(activeData.progress).length;

  const onExport = () => {
    try {
      downloadFile(exportFileName(activeProfile), serializeExport(activeProfile, activeData));
      setStatus({ kind: 'success', text: 'Sauvegarde téléchargée ✅' });
    } catch (e) {
      setStatus({ kind: 'error', text: (e as Error).message });
    }
  };

  const onPickRestore = async () => {
    setStatus({ kind: 'idle' });
    try {
      const text = await pickFile();
      setPending(parseImport(text));
    } catch (e) {
      setStatus({ kind: 'error', text: (e as Error).message });
    }
  };

  const confirmRestore = () => {
    if (!pending) return;
    replaceActiveData(pending.data);
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
      <Text style={styles.intro}>
        Sauvegarde de <Text style={{ fontWeight: '800' }}>{activeProfile.name}</Text>. Garde une copie
        dans un fichier pour ne rien perdre si tu changes de navigateur ou vides le cache.
      </Text>

      <View style={[styles.infoCard, shadow.soft]}>
        <Text style={styles.infoNumber}>{savedCount}</Text>
        <Text style={styles.infoLabel}>élément(s) de progression enregistré(s)</Text>
      </View>

      {!supported && (
        <View style={[styles.warn, shadow.soft]}>
          <Text style={styles.warnText}>
            ℹ️ La sauvegarde dans un fichier fonctionne dans la version web (navigateur).
          </Text>
        </View>
      )}

      <View style={{ height: spacing.lg }} />

      <PrimaryButton label="💾  Sauvegarder ma progression" onPress={onExport} />
      <View style={{ height: spacing.md }} />
      <PrimaryButton label="📂  Restaurer une sauvegarde" onPress={onPickRestore} color={colors.olive} />

      {pending && (
        <View style={[styles.confirm, shadow.card]}>
          <Text style={styles.confirmTitle}>Remplacer la progression de {activeProfile.name} ?</Text>
          <Text style={styles.confirmText}>
            Cette sauvegarde contient {pending.cardCount} carte{pending.cardCount > 1 ? 's' : ''}.
            La progression actuelle de ce profil sera remplacée.
          </Text>
          <View style={styles.confirmRow}>
            <PrimaryButton label="Annuler" onPress={() => setPending(null)} color={colors.textSoft} style={{ flex: 1 }} />
            <View style={{ width: spacing.sm }} />
            <PrimaryButton label="Oui, restaurer" onPress={confirmRestore} color={colors.terracotta} style={{ flex: 1 }} />
          </View>
        </View>
      )}

      {status.kind !== 'idle' && (
        <View style={[styles.status, { backgroundColor: status.kind === 'success' ? colors.good : colors.again }]}>
          <Text style={styles.statusText}>{status.text}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.textSoft, marginTop: spacing.sm, lineHeight: 22 },
  infoCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', marginTop: spacing.lg },
  infoNumber: { fontSize: 40, fontWeight: '800', color: colors.terracotta },
  infoLabel: { ...typography.caption, color: colors.textSoft, marginTop: spacing.xs },
  warn: { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  warnText: { ...typography.body, color: colors.text, lineHeight: 22 },
  confirm: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  confirmTitle: { ...typography.heading, color: colors.text },
  confirmText: { ...typography.body, color: colors.textSoft, marginTop: spacing.sm, lineHeight: 22 },
  confirmRow: { flexDirection: 'row', marginTop: spacing.lg },
  status: { borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  statusText: { ...typography.body, color: colors.textOnColor, fontWeight: '700', textAlign: 'center' },
});
