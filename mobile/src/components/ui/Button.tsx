import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const isDisabled = disabled || loading;

  const variantStyles: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.cta },
    secondary: { backgroundColor: colors.primary },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    danger: { backgroundColor: colors.danger },
  };
  const textColor: Record<Variant, string> = {
    primary: colors.ctaText,
    secondary: colors.white,
    outline: colors.text,
    danger: colors.white,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} />
      ) : (
        <Text style={[styles.text, { color: textColor[variant] }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const makeStyles = (_colors: Palette) =>
  StyleSheet.create({
    base: {
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
    },
    text: { fontSize: 16, fontWeight: '700' },
    pressed: { opacity: 0.85 },
    disabled: { opacity: 0.5 },
  });
