import { StyleSheet, View } from 'react-native';
import { useDoctorCallLogs } from '@/hooks';
import { CallHistoryList } from '@/features/shared/CallHistoryList';
import { ScreenHeader } from '@/components/ui';
import { type Palette } from '@/theme';
import { useThemedStyles } from '@/theme/ThemeContext';
import { useRouter } from 'expo-router';

export default function DoctorHistory() {
  const router = useRouter();
  const styles = useThemedStyles(makeStyles);
  const { data, isLoading } = useDoctorCallLogs();
  return (
    <View style={styles.safe}>
      <ScreenHeader title="Call history" subtitle="Your past consultations" />
      <CallHistoryList
        logs={data?.results ?? []}
        role="doctor"
        loading={isLoading}
        onPress={(log) => {
          if (log.id) router.push(`/(doctor)/consultation/${log.id}`);
        }}
      />
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
  });
