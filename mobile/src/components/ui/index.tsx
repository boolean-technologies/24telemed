import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

export { Button } from './Button';
export { Avatar } from './Avatar';
export { ScreenHeader } from './ScreenHeader';
export { Calendar } from './Calendar';

/** Shared id so every TextField shares one "Done" keyboard bar (iOS). */
export const DONE_ACCESSORY_ID = 'kb-done';

/**
 * A "Done" bar shown above the iOS keyboard (number/phone pads have no return
 * key). Render once on any screen that has form inputs.
 */
export function KeyboardDoneBar() {
  const styles = useThemedStyles(makeStyles);
  if (Platform.OS !== 'ios') return null;
  return (
    <InputAccessoryView nativeID={DONE_ACCESSORY_ID}>
      <View style={styles.accessory}>
        <Pressable onPress={() => Keyboard.dismiss()} hitSlop={10}>
          <Text style={styles.accessoryDone}>Done</Text>
        </Pressable>
      </View>
    </InputAccessoryView>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  const styles = useThemedStyles(makeStyles);
  return <View style={[styles.card, style]}>{children}</View>;
}

export function TextField({
  label,
  style,
  ...props
}: TextInputProps & { label?: string }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        inputAccessoryViewID={
          Platform.OS === 'ios' ? DONE_ACCESSORY_ID : undefined
        }
        {...props}
      />
    </View>
  );
}

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  Completed: { bg: '#e7f8ec', fg: '#1e9e4a' },
  'In Progress': { bg: '#e6f0ff', fg: '#2f6bff' },
  Initiated: { bg: '#fff4e0', fg: '#c47f17' },
  Declined: { bg: '#fdeaea', fg: '#d3493c' },
  Failed: { bg: '#fdeaea', fg: '#d3493c' },
  Busy: { bg: '#f3e8ff', fg: '#8b3ddb' },
};

export function StatusBadge({ status }: { status?: string }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const c = STATUS_COLORS[status ?? ''] ?? { bg: colors.border, fg: colors.textMuted };
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]}>{status ?? '—'}</Text>
    </View>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  accessory: {
    backgroundColor: '#f1f2f4',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'flex-end',
  },
  accessoryDone: { color: colors.link, fontSize: 16, fontWeight: '700' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  fieldWrap: { marginBottom: spacing.md },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.xs + 2,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
});
