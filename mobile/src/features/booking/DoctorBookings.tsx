import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ScreenHeader } from '@/components/ui';
import { BookingApi } from './api';
import { BookingCard } from './BookingCard';
import { useDoctorBookings, useConfirmBooking, useDeclineBooking } from './hooks';
import { bookingTiming } from './timing';
import { spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

export function DoctorBookings() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { data, isLoading, refetch, isRefetching } = useDoctorBookings();
  const confirm = useConfirmBooking();
  const decline = useDeclineBooking();

  async function startNow(id: string) {
    const res = await BookingApi.doctorStart(id);
    router.push(`/(doctor)/meeting/${res.call_log_id}`);
  }

  return (
    <View style={styles.safe}>
      <ScreenHeader title="Bookings" subtitle="Requested consultations" />

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
            <Text style={styles.empty}>No booking requests yet.</Text>
          }
          renderItem={({ item }) => {
            const { isMissed } = bookingTiming(item);
            return (
              <BookingCard
                booking={item}
                counterpartyRole="personnel"
                actions={
                  item.status === 'Completed' && item.call_log_id ? (
                    <Button
                      title="View consultation"
                      variant="outline"
                      onPress={() =>
                        router.push(`/(doctor)/consultation/${item.call_log_id}`)
                      }
                      style={{ flex: 1 }}
                    />
                  ) : item.status === 'Pending' ? (
                    isMissed ? (
                      <Button
                        title="Dismiss"
                        variant="outline"
                        loading={decline.isPending}
                        onPress={() => decline.mutate({ id: item.id })}
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <>
                        <Button
                          title="Decline"
                          variant="outline"
                          loading={decline.isPending}
                          onPress={() => decline.mutate({ id: item.id })}
                          style={{ flex: 1 }}
                        />
                        <Button
                          title="Confirm"
                          variant="secondary"
                          loading={confirm.isPending}
                          onPress={() => confirm.mutate(item.id)}
                          style={{ flex: 1 }}
                        />
                      </>
                    )
                  ) : item.status === 'Confirmed' ? (
                    <Button
                      title={isMissed ? 'Call time passed' : 'Start call'}
                      onPress={() => startNow(item.id)}
                      disabled={isMissed}
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
  list: { padding: spacing.lg },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
