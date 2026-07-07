import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';
import { PRIVACY_POLICY, TERMS_OF_USE } from '@/features/legal/content';
import { spacing, type Palette } from '@/theme';
import { useThemedStyles } from '@/theme/ThemeContext';

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const styles = useThemedStyles(makeStyles);
  const isPrivacy = doc === 'privacy';
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: isPrivacy ? 'Privacy Policy' : 'Terms of Use',
        }}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.body}>
          {isPrivacy ? PRIVACY_POLICY : TERMS_OF_USE}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  body: { fontSize: 14, color: colors.text, lineHeight: 22 },
});
