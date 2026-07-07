import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

function initials(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

export function Avatar({
  name,
  uri,
  size = 48,
}: {
  name?: string;
  uri?: string | null;
  size?: number;
}) {
  const radius = size / 2;
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: radius }}
      />
    );
  }
  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
        {initials(name).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: colors.white, fontWeight: '700' },
});
