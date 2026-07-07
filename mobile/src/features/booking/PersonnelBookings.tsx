import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, ScreenHeader } from '@/components/ui';
import { BookingApi } from './api';
import { BookingCard } from './BookingCard';
import { usePersonnelBookings, useCancelBooking } from './hooks';
import { bookingTiming } from './timing';
import { spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

export function PersonnelBookings() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { data, isLoading, refetch, isRefetching } = usePersonnelBookings();
  const cancel = useCancelBooking();

  async function startNow(id: string) {
    const res = await BookingApi.personnelStart(id);
    router.push(`/(patient)/meeting/${res.call_log_id}`);
  }

  return (
    <View style={styles.safe}>
      <ScreenHeader
        title="Bookings"
        right={
          <Pressable
            style={styles.newBtn}
            onPress={() => router.push('/(patient)/bookings/new')}
          >
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={styles.newBtnText}>New</Text>
          </Pressable>
        }
      />

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(b) => b.id}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No bookings yet. Open a patient and tap “Schedule a booking”.
            </Text>
          }
          renderItem={({ item }) => {
            const { isMissed } = bookingTiming(item);
            return (
              <BookingCard
                booking={item}
                counterpartyRole="doctor"
                actions={
                  item.status === 'Completed' && item.call_log_id ? (
                    <Button
                      title="View consultation"
                      variant="outline"
                      onPress={() =>
                        router.push(`/(patient)/consultation/${item.call_log_id}`)
                      }
                      style={{ flex: 1 }}
                    />
                  ) : item.status === 'Confirmed' ? (
                    <Button
                      title={isMissed ? 'Call time passed' : 'Start call'}
                      onPress={() => startNow(item.id)}
                      disabled={isMissed}
                      style={{ flex: 1 }}
                    />
                  ) : item.status === 'Pending' ? (
                    <Button
                      title="Cancel"
                      variant="outline"
                      loading={cancel.isPending}
                      onPress={() => cancel.mutate(item.id)}
                      style={{ flex: 1 }}
                    />
                  ) : null
                }
              />
            );
          }}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  newBtnText: { color: colors.white, fontWeight: '700' },
  list: { padding: spacing.lg },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl, lineHeight: 22 },
});
