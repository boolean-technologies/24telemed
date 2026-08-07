import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Button } from '@/components/ui';
import type { Doctor } from '@/api';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

/**
 * Full-screen searchable picker for choosing a provider (doctor/nurse). The
 * caller supplies the list; selection is confirmed before closing so the
 * booking form stays compact.
 */
export function ProviderPickerModal({
  visible,
  onClose,
  onConfirm,
  providers,
  selectedId,
  prefix,
  noun,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  providers: Doctor[];
  selectedId: string | null;
  prefix: string;
  noun: string;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [pending, setPending] = useState<string | null>(selectedId);

  // Re-sync the highlighted row each time the sheet opens.
  useEffect(() => {
    if (visible) {
      setPending(selectedId);
      setQuery('');
    }
  }, [visible, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((d) =>
      `${d.first_name ?? ''} ${d.last_name ?? ''} ${d.specialty ?? ''}`
        .toLowerCase()
        .includes(q)
    );
  }, [providers, query]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.safe}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Choose a {noun}</Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
              <Ionicons name="close" size={24} color={colors.white} />
            </Pressable>
          </View>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={colors.white} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${noun}s by name or specialty`}
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {query ? (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.8)" />
              </Pressable>
            ) : null}
          </View>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(d) => String(d.id)}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.empty}>
              {providers.length === 0
                ? `No ${noun}s are available yet.`
                : `No ${noun}s match “${query}”.`}
            </Text>
          }
          renderItem={({ item }) => {
            const active = pending === item.id;
            return (
              <Pressable
                onPress={() => setPending(item.id as string)}
                style={[styles.row, active && styles.rowActive]}
              >
                <Avatar
                  name={`${item.first_name} ${item.last_name}`}
                  uri={item.photo}
                  size={46}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>
                    {prefix} {item.first_name} {item.last_name}
                  </Text>
                  <Text style={styles.spec}>{item.specialty || 'General'}</Text>
                </View>
                <Ionicons
                  name={active ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={active ? colors.primary : colors.border}
                />
              </Pressable>
            );
          }}
        />

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Button
            title="Confirm selection"
            disabled={!pending}
            onPress={() => {
              if (pending) {
                onConfirm(pending);
                onClose();
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      backgroundColor: colors.primary,
      borderBottomLeftRadius: radius.lg,
      borderBottomRightRadius: radius.lg,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: { color: colors.white, fontSize: 20, fontWeight: '800' },
    close: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.md,
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      height: 44,
    },
    searchInput: { flex: 1, color: colors.white, fontSize: 15 },
    list: { padding: spacing.lg, flexGrow: 1 },
    empty: {
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    rowActive: { borderColor: colors.primary, backgroundColor: colors.tint },
    name: { fontSize: 15, fontWeight: '700', color: colors.text },
    spec: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
    footer: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
  });
