import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

/**
 * A teal header band that paints the status-bar area so the system clock /
 * battery stay legible on every screen (they render in light/white). Renders
 * the title block, an optional back button and an optional trailing node.
 */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  /** Custom content rendered below the title row (e.g. a status pill). */
  children?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.band, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={10} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>
        ) : null}
        <View style={styles.titleWrap}>
          {title ? (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right ?? null}
      </View>
      {children}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    band: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomLeftRadius: radius.lg,
      borderBottomRightRadius: radius.lg,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    back: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: -6,
    },
    titleWrap: { flex: 1 },
    title: { color: colors.white, fontSize: 22, fontWeight: '800' },
    subtitle: {
      color: colors.white,
      opacity: 0.9,
      fontSize: 13,
      marginTop: 2,
    },
  });
