import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { usePersonnelCallLogs, useOnlineDoctors } from '@/hooks';
import { usePersonnelBookings } from '@/features/booking/hooks';
import { bookingTiming } from '@/features/booking/timing';
import { usePersonnelCall } from '@/realtime';
import { CallDoctorSheet } from '@/features/personnel/CallDoctorSheet';
import { Avatar, StatusBadge } from '@/components/ui';
import {
  CONSULT_OPTIONS,
  consultationTypeLabel,
  type ConsultOption,
} from '@/features/consult/types';
import type { Doctor, FullCallLog } from '@/api';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

export default function PatientHome() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const { availableDoctors, isOpen } = usePersonnelCall();
  const { data: onlineDoctors = [] } = useOnlineDoctors(availableDoctors);
  const { data: logs } = usePersonnelCallLogs(1, 4);
  const { data: bookings } = usePersonnelBookings();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeConsult, setActiveConsult] = useState<ConsultOption>(CONSULT_OPTIONS[0]);

  function startConsult(option: ConsultOption) {
    setActiveConsult(option);
    setSheetOpen(true);
  }

  const name = user?.first_name || user?.username || 'there';
  const patientId = user?.patient_id;
  const hasProfile = Boolean(patientId);

  const upcoming = (bookings ?? [])
    .filter(
      (b) =>
        (b.status === 'Confirmed' || b.status === 'Pending') &&
        !bookingTiming(b).isMissed
    )
    .sort((a, b) => +new Date(a.scheduled_time) - +new Date(b.scheduled_time))[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.hi}>Hello {name} 👋</Text>
              <Text style={styles.headline}>How are you feeling today?</Text>
            </View>
            <Avatar name={name} uri={user?.photo} size={52} />
          </View>
          <View style={styles.statusPill}>
            <View style={[styles.dot, { backgroundColor: isOpen ? colors.success : '#ffd25e' }]} />
            <Text style={styles.statusText}>
              {isOpen
                ? `${availableDoctors.length} doctor${availableDoctors.length === 1 ? '' : 's'} available now`
                : 'Connecting…'}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {!hasProfile ? (
            <View style={styles.setupCard}>
              <Ionicons name="pulse" size={28} color={colors.primary} />
              <Text style={styles.setupTitle}>Complete your medical records</Text>
              <Text style={styles.setupText}>
                Add your details so a doctor can review them during a
                consultation. You'll be able to call or book once it's done.
              </Text>
              <Pressable style={styles.setupBtn} onPress={() => router.push('/(patient)/(tabs)/records')}>
                <Text style={styles.setupBtnText}>Set up records</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Consultation options */}
              <Text style={styles.helpTitle}>How can we help?</Text>
              <View style={styles.consultList}>
                {CONSULT_OPTIONS.map((o) => (
                  <Pressable key={o.key} style={styles.consultCard} onPress={() => startConsult(o)}>
                    <View style={styles.consultIcon}>
                      <Ionicons name={o.icon} size={22} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.consultLabel}>{o.label}</Text>
                      <Text style={styles.consultDesc}>{o.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </Pressable>
                ))}
              </View>

              {/* Book for later */}
              <Pressable style={styles.bookRow} onPress={() => router.push('/(patient)/bookings/new')}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={styles.bookText}>Book an appointment for later</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>

              {/* Upcoming appointment */}
              {upcoming ? (
                <Pressable style={styles.upcoming} onPress={() => router.push('/(patient)/(tabs)/bookings')}>
                  <View style={styles.upcomingIcon}>
                    <Ionicons name="time" size={20} color={colors.white} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.upcomingLabel}>Upcoming appointment</Text>
                    <Text style={styles.upcomingDr}>
                      Dr. {upcoming.doctor_detail?.first_name} {upcoming.doctor_detail?.last_name}
                    </Text>
                    <Text style={styles.upcomingTime}>
                      {new Date(upcoming.scheduled_time).toLocaleString(undefined, {
                        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <StatusBadge status={upcoming.status} />
                </Pressable>
              ) : null}

              {/* Available doctors */}
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Available now</Text>
              </View>
              {onlineDoctors.length === 0 ? (
                <View style={styles.emptyDoctors}>
                  <Ionicons name="medkit-outline" size={20} color={colors.textMuted} />
                  <Text style={styles.empty}>No doctors are online right now. You can still book for later.</Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.docRow}>
                  {onlineDoctors.map((d: Doctor) => (
                    <Pressable key={d.id} style={styles.docCard} onPress={() => startConsult(CONSULT_OPTIONS[0])}>
                      <Avatar name={`${d.first_name} ${d.last_name}`} uri={d.photo} size={56} />
                      <Text style={styles.docName} numberOfLines={1}>Dr. {d.last_name || d.first_name}</Text>
                      <Text style={styles.docSpec} numberOfLines={1}>{d.specialty || 'General'}</Text>
                      <View style={styles.onlineBadge}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>Online</Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              {/* Recent consultations */}
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Recent consultations</Text>
              </View>
              {(logs?.results ?? []).length === 0 ? (
                <Text style={styles.empty}>No consultations yet.</Text>
              ) : (
                (logs?.results ?? []).map((log: FullCallLog) => (
                  <Pressable
                    key={log.id}
                    style={styles.row}
                    onPress={() =>
                      router.push(`/(patient)/consultation/${log.id}`)
                    }
                  >
                    <Avatar
                      name={`${log.doctor?.first_name ?? ''} ${log.doctor?.last_name ?? ''}`}
                      uri={log.doctor?.photo}
                      size={42}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rowName}>Dr. {log.doctor?.first_name} {log.doctor?.last_name}</Text>
                      <Text style={styles.rowType}>
                        {consultationTypeLabel((log as { consultation_type?: string }).consultation_type)}
                      </Text>
                      <Text style={styles.rowSub}>
                        {log.start_time
                          ? new Date(log.start_time).toLocaleString(undefined, {
                              month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                            })
                          : ''}
                      </Text>
                    </View>
                    <StatusBadge status={log.status} />
                  </Pressable>
                ))
              )}

              {/* Tip */}
              <View style={styles.tip}>
                <Ionicons name="bulb-outline" size={18} color={colors.primary} />
                <Text style={styles.tipText}>
                  Keep your medical records up to date so doctors can give you the best advice.
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {patientId ? (
        <CallDoctorSheet
          visible={sheetOpen}
          onClose={() => setSheetOpen(false)}
          patientId={patientId}
          consultationType={activeConsult.key}
          providerRole={activeConsult.providerRole}
          title={activeConsult.label}
        />
      ) : null}
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  page: { backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  hi: { color: colors.white, fontSize: 15, opacity: 0.95 },
  headline: { color: colors.white, fontSize: 23, fontWeight: '900', marginTop: spacing.xs },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start',
    paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: 999,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  body: { padding: spacing.lg },
  helpTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  consultList: { gap: spacing.sm },
  consultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  consultIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultLabel: { fontSize: 15, fontWeight: '800', color: colors.text },
  consultDesc: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.tint,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  bookText: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.tintText },
  setupCard: {
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, padding: spacing.lg, alignItems: 'flex-start', gap: spacing.sm,
  },
  setupTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  setupText: { fontSize: 14, color: colors.textMuted, lineHeight: 21 },
  setupBtn: { marginTop: spacing.sm, backgroundColor: colors.cta, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md },
  setupBtnText: { color: colors.white, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: spacing.md },
  action: { flex: 1, borderRadius: radius.md, padding: spacing.md, minHeight: 128, justifyContent: 'space-between' },
  callAction: { backgroundColor: colors.primary },
  bookAction: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  actionIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  actionText: { color: colors.white, fontSize: 16, fontWeight: '800', marginTop: spacing.sm },
  actionSub: { color: colors.white, opacity: 0.9, fontSize: 12, marginTop: 2 },
  upcoming: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg,
    backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md,
  },
  upcomingIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  upcomingLabel: { fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  upcomingDr: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 2 },
  upcomingTime: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  sectionHead: { marginTop: spacing.xl, marginBottom: spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  docRow: { gap: spacing.md, paddingRight: spacing.lg },
  docCard: {
    width: 120, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1,
    borderColor: colors.border, padding: spacing.md, alignItems: 'center', gap: 2,
  },
  docName: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  docSpec: { fontSize: 12, color: colors.textMuted },
  onlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  onlineText: { fontSize: 11, color: colors.success, fontWeight: '600' },
  emptyDoctors: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  empty: { color: colors.textMuted, flex: 1 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm,
  },
  rowName: { fontSize: 15, fontWeight: '700', color: colors.text },
  rowType: { fontSize: 12, color: colors.primary, fontWeight: '600', marginTop: 1 },
  rowSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  tip: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', marginTop: spacing.lg,
    backgroundColor: colors.tint, borderRadius: radius.md, padding: spacing.md,
  },
  tipText: { flex: 1, color: colors.tintText, fontSize: 13, lineHeight: 19 },
});
