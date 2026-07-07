import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';

/**
 * Branded, animated splash shown over the app on launch. Replaces the static
 * logo splash with the platform tagline. Calls `onFinish` once it has animated
 * in, held briefly, and faded out.
 */
export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const container = useRef(new Animated.Value(1)).current; // overall fade-out
  const iconScale = useRef(new Animated.Value(0.6)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const line1 = useRef(new Animated.Value(0)).current;
  const divider = useRef(new Animated.Value(0)).current;
  const line2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rise = (v: Animated.Value, delay: number) =>
      Animated.timing(v, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(iconOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      rise(line1, 300),
      rise(divider, 550),
      rise(line2, 700),
    ]).start();

    // Gentle continuous pulse on the icon.
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Hold, then fade out and finish.
    const t = setTimeout(() => {
      Animated.timing(container, {
        toValue: 0,
        duration: 450,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2300);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });
  const ringScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.45],
  });
  const ringOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0],
  });

  const riseStyle = (v: Animated.Value) => ({
    opacity: v,
    transform: [
      {
        translateY: v.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }),
      },
    ],
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: container }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark, '#14625c']}
        style={styles.fill}
      >
        <View style={styles.center}>
          {/* Pulsing secure icon */}
          <View style={styles.iconWrap}>
            <Animated.View
              style={[
                styles.ring,
                { transform: [{ scale: ringScale }], opacity: ringOpacity },
              ]}
            />
            <Animated.View
              style={[
                styles.iconCircle,
                { opacity: iconOpacity, transform: [{ scale: Animated.multiply(iconScale, pulseScale) }] },
              ]}
            >
              <Ionicons name="shield-checkmark" size={44} color={colors.white} />
            </Animated.View>
          </View>

          <Animated.Text style={[styles.title, riseStyle(line1)]}>
            Secure telemedicine platform
          </Animated.Text>

          <Animated.View style={[styles.divider, { opacity: divider, transform: [{ scaleX: divider }] }]} />

          <Animated.Text style={[styles.subtitle, riseStyle(line2)]}>
            for specialists and patients
          </Animated.Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', paddingHorizontal: spacing.xl },
  iconWrap: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  ring: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: colors.white,
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  divider: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
    marginVertical: spacing.md,
  },
  subtitle: {
    color: colors.white,
    opacity: 0.92,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
