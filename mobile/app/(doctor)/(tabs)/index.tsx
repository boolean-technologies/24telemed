import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/auth/AuthContext';
import { useDoctorCallStats, useDoctorCallLogs } from '@/hooks';
import { useDoctorCall } from '@/realtime';
import { Avatar, Card, StatusBadge } from '@/components/ui';
import type { FullCallLog } from '@/api';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

function minutesToHrs(total?: number) {
  if (!total) return '0 min';
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? `${h} hr ${m} min` : `${m} min`;
}

export default function DoctorHome() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { isOpen } = useDoctorCall();
  const { data: stats } = useDoctorCallStats();
  const { data: logs } = useDoctorCallLogs(1, 5);

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Doctor';

  const cards = [
    { label: 'Total Call Time', value: minutesToHrs(stats?.total_call_time), icon: 'time-outline' as const },
    { label: 'Total Completed', value: String(stats?.total_completed ?? 0), icon: 'headset-outline' as const },
    { label: 'Total Busy', value: String(stats?.total_busy ?? 0), icon: 'hourglass-outline' as const },
    { label: 'Total Failed', value: String(stats?.total_failed ?? 0), icon: 'sad-outline' as const },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.hi}>Welcome back,</Text>
            <Text style={styles.name}>Dr. {name}</Text>
            <View style={styles.statusPill}>
              <View style={[styles.dot, { backgroundColor: isOpen ? colors.success : colors.textMuted }]} />
              <Text style={styles.statusText}>{isOpen ? 'Available for calls' : 'Connecting…'}</Text>
            </View>
          </View>
          <Avatar name={name} uri={user?.photo} size={60} />
        </View>

        <View style={styles.body}>
          {(user as { is_verified?: boolean })?.is_verified === false ? (
            <View style={styles.pending}>
              <Ionicons name="time-outline" size={20} color="#c47f17" />
              <Text style={styles.pendingText}>
                Your account is awaiting admin approval. You won't appear to
                patients or receive calls until it's verified.
              </Text>
            </View>
          ) : null}

          <View style={styles.statsGrid}>
            {cards.map((c) => (
              <Card key={c.label} style={styles.statCard}>
                <Ionicons name={c.icon} size={22} color={colors.primary} />
                <Text style={styles.statValue}>{c.value}</Text>
                <Text style={styles.statLabel}>{c.label}</Text>
              </Card>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recent consultations</Text>
          {(logs?.results ?? []).length === 0 ? (
            <Text style={styles.empty}>No consultations yet.</Text>
          ) : (
            (logs?.results ?? []).map((log: FullCallLog) => {
              const p = log.health_care_assistant;
              return (
                <View key={log.id} style={styles.row}>
                  <Avatar
                    name={[p?.first_name, p?.last_name].filter(Boolean).join(' ')}
                    uri={p?.photo || log.patient?.photo}
                    size={42}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName}>
                      {[p?.first_name, p?.last_name].filter(Boolean).join(' ') || p?.username}
                    </Text>
                    <Text style={styles.rowSub}>
                      Patient: {log.patient?.first_name} {log.patient?.last_name}
                    </Text>
                  </View>
                  <StatusBadge status={log.status} />
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  page: { backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  body: { padding: spacing.lg },
  pending: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#fff4e0',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  pendingText: { flex: 1, color: '#8a5a12', fontSize: 13, lineHeight: 19 },
  hi: { color: colors.white, fontSize: 15, opacity: 0.95 },
  name: { color: colors.white, fontSize: 24, fontWeight: '800' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: { width: '47%', flexGrow: 1, gap: spacing.xs },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  statLabel: { fontSize: 13, color: colors.textMuted },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  empty: { color: colors.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowName: { fontSize: 15, fontWeight: '700', color: colors.text },
  rowSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
});
