import { useState } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/store/app';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing, typography, radius, shadow } from '@/lib/theme';

const EMOJIS = ['🙂', '😎', '🌸', '🦊', '🐱', '🌟', '🚀', '🦉', '🍀', '🎈'];

export default function ProfilsScreen() {
  const insets = useSafeAreaInsets();
  const { profiles, activeProfile, switchProfile, addProfile, renameProfile, deleteProfile } = useApp();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const submit = () => {
    const n = name.trim();
    if (!n) return;
    if (editingId) {
      renameProfile(editingId, n, emoji);
    } else {
      addProfile(n, emoji);
    }
    setName('');
    setEmoji(EMOJIS[0]);
    setEditingId(null);
  };

  const startEdit = (id: string, currentName: string, currentEmoji: string) => {
    setEditingId(id);
    setName(currentName);
    setEmoji(currentEmoji);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl, paddingHorizontal: spacing.lg, paddingTop: spacing.md }}
    >
      <Text style={styles.intro}>Chaque profil a sa propre progression. Touche un profil pour l'utiliser.</Text>

      {profiles.map((p) => {
        const active = p.id === activeProfile.id;
        return (
          <View key={p.id} style={[styles.row, shadow.soft, active && styles.rowActive]}>
            <Pressable style={styles.rowMain} onPress={() => switchProfile(p.id)}>
              <Text style={styles.emoji}>{p.emoji}</Text>
              <Text style={styles.name}>{p.name}</Text>
              {active && <Text style={styles.activeTag}>actif</Text>}
            </Pressable>
            <Pressable onPress={() => startEdit(p.id, p.name, p.emoji)} hitSlop={8} style={styles.iconBtn}>
              <Text style={styles.icon}>✏️</Text>
            </Pressable>
            {profiles.length > 1 && (
              <Pressable onPress={() => deleteProfile(p.id)} hitSlop={8} style={styles.iconBtn}>
                <Text style={styles.icon}>🗑️</Text>
              </Pressable>
            )}
          </View>
        );
      })}

      <View style={[styles.form, shadow.card]}>
        <Text style={styles.formTitle}>{editingId ? 'Renommer le profil' : 'Nouveau profil'}</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Prénom (ex. Maman)"
          placeholderTextColor={colors.textSoft}
          style={styles.input}
          maxLength={20}
        />
        <View style={styles.emojiRow}>
          {EMOJIS.map((e) => (
            <Pressable key={e} onPress={() => setEmoji(e)} style={[styles.emojiPick, emoji === e && styles.emojiPickActive]}>
              <Text style={styles.emojiPickText}>{e}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton label={editingId ? 'Enregistrer' : 'Créer le profil'} onPress={submit} />
        {editingId && (
          <Pressable onPress={() => { setEditingId(null); setName(''); }} style={styles.cancel}>
            <Text style={styles.cancelText}>Annuler</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  intro: { ...typography.body, color: colors.textSoft, marginTop: spacing.sm, marginBottom: spacing.md, lineHeight: 22 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  rowActive: { borderWidth: 2, borderColor: colors.terracotta },
  rowMain: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.sm },
  emoji: { fontSize: 26 },
  name: { ...typography.heading, color: colors.text },
  activeTag: { ...typography.caption, color: colors.terracotta, fontWeight: '800', marginLeft: spacing.sm },
  iconBtn: { padding: spacing.sm },
  icon: { fontSize: 18 },
  form: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.md },
  formTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.md },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  emojiPick: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  emojiPickActive: { borderWidth: 2, borderColor: colors.terracotta },
  emojiPickText: { fontSize: 22 },
  cancel: { alignItems: 'center', paddingVertical: spacing.md },
  cancelText: { ...typography.body, color: colors.textSoft },
});
