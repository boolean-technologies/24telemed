import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';
import type { Booking } from './api';
import { bookingTiming } from './timing';

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  Pending: { bg: '#fff4e0', fg: '#c47f17' },
  Confirmed: { bg: '#e7f8ec', fg: '#1e9e4a' },
  Declined: { bg: '#fdeaea', fg: '#d3493c' },
  Cancelled: { bg: '#f0f0f0', fg: '#777' },
  Completed: { bg: '#e6f0ff', fg: '#2f6bff' },
  Missed: { bg: '#f0f0f0', fg: '#8a939b' },
};

function fullName(u?: { first_name?: string; last_name?: string; username?: string }) {
  if (!u) return 'Unknown';
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || 'Unknown';
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
  };
}

/** One booking row, with a slot for role-specific action buttons. */
export function BookingCard({
  booking,
  counterpartyRole,
  actions,
}: {
  booking: Booking;
  /** Whose name to show as the other party. */
  counterpartyRole: 'doctor' | 'personnel';
  actions?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const when = formatWhen(booking.scheduled_time);
  const { isMissed } = bookingTiming(booking);
  const displayStatus = isMissed ? 'Missed' : booking.status;
  const counterparty =
    counterpartyRole === 'doctor'
      ? booking.doctor_detail
      : booking.health_care_assistant_detail;
  const sc = STATUS_COLORS[displayStatus] ?? { bg: colors.border, fg: colors.textMuted };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.when}>
          <Ionicons name="calendar-outline" size={16} color={isMissed ? colors.textMuted : colors.primary} />
          <Text style={[styles.whenText, isMissed && styles.whenPast]}>{when.date}</Text>
          <Ionicons name="time-outline" size={16} color={isMissed ? colors.textMuted : colors.primary} />
          <Text style={[styles.whenText, isMissed && styles.whenPast]}>{when.time}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: sc.bg }]}>
          <Text style={[styles.badgeText, { color: sc.fg }]}>{displayStatus}</Text>
        </View>
      </View>

      <View style={styles.party}>
        <Avatar name={fullName(counterparty)} uri={counterparty?.photo} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {counterpartyRole === 'doctor' ? 'Dr. ' : ''}
            {fullName(counterparty)}
          </Text>
          <Text style={styles.sub}>
            Patient: {fullName(booking.patient_detail)}
          </Text>
        </View>
      </View>

      {booking.reason ? <Text style={styles.reason}>“{booking.reason}”</Text> : null}
      {booking.status === 'Declined' && booking.decline_note ? (
        <Text style={styles.declineNote}>Declined: {booking.decline_note}</Text>
      ) : null}
      {isMissed ? (
        <View style={styles.missedRow}>
          <Ionicons name="alert-circle-outline" size={15} color={colors.textMuted} />
          <Text style={styles.missedText}>
            This appointment&apos;s time has passed and the call did not take place.
          </Text>
        </View>
      ) : null}

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  when: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  whenText: { fontSize: 13, fontWeight: '700', color: colors.text },
  whenPast: { color: colors.textMuted, textDecorationLine: 'line-through' },
  badge: { paddingHorizontal: spacing.sm + 2, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  party: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  reason: { fontSize: 14, color: colors.textMuted, fontStyle: 'italic', marginTop: spacing.sm },
  declineNote: { fontSize: 13, color: colors.danger, marginTop: spacing.sm },
  missedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  missedText: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
