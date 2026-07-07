import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { FullCallLog } from '@/api';
import { Avatar, StatusBadge } from '@/components/ui';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

type Role = 'doctor' | 'personnel';

function fullName(u?: { first_name?: string; last_name?: string; username?: string }) {
  if (!u) return 'Unknown';
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || 'Unknown';
}

function dayKey(iso?: string) {
  if (!iso) return 'Earlier';
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function time(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Grouped call history shared by the doctor and personnel areas. `role`
 * controls whose name to show as the call counterparty.
 */
export function CallHistoryList({
  logs,
  role,
  loading,
  ListHeaderComponent,
  onPress,
}: {
  logs: FullCallLog[];
  role: Role;
  loading?: boolean;
  ListHeaderComponent?: React.ReactElement;
  onPress?: (log: FullCallLog) => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const sections = useMemo(() => {
    const groups = new Map<string, FullCallLog[]>();
    for (const log of logs) {
      const key = dayKey(log.start_time);
      const arr = groups.get(key) ?? [];
      arr.push(log);
      groups.set(key, arr);
    }
    return Array.from(groups, ([title, data]) => ({ title, data }));
  }, [logs]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id ?? Math.random().toString()}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.content}
      stickySectionHeadersEnabled={false}
      ListEmptyComponent={
        <Text style={styles.empty}>No calls yet.</Text>
      }
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionHeader}>{section.title}</Text>
      )}
      renderItem={({ item }) => {
        const counterparty =
          role === 'doctor' ? item.health_care_assistant : item.doctor;
        return (
          <Pressable
            style={styles.row}
            onPress={onPress ? () => onPress(item) : undefined}
            disabled={!onPress}
          >
            <Avatar name={fullName(counterparty)} uri={counterparty?.photo} size={44} />
            <View style={styles.rowMain}>
              <Text style={styles.name} numberOfLines={1}>
                {fullName(counterparty)}
              </Text>
              <Text style={styles.sub} numberOfLines={1}>
                Patient: {fullName(item.patient)}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <StatusBadge status={item.status} />
              <Text style={styles.time}>{time(item.start_time)}</Text>
              <Text style={styles.duration}>
                {item.duration != null ? `${item.duration} min` : '—'}
              </Text>
            </View>
          </Pressable>
        );
      }}
    />
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  rowMain: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  rowRight: { alignItems: 'flex-end', gap: 2 },
  time: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  duration: { fontSize: 12, color: colors.textMuted },
});
