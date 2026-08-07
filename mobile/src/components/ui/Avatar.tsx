import { useState } from 'react';
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
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(uri) && !failed;

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      {/* Initials render immediately and act as a placeholder until the photo
          loads (or if it fails). */}
      <Text style={[styles.initials, { fontSize: size * 0.36 }]}>
        {initials(name).toUpperCase()}
      </Text>
      {showImage ? (
        <Image
          source={{ uri: uri as string, cache: 'force-cache' }}
          style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: { color: colors.white, fontWeight: '700' },
});
