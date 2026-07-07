import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * A compact month calendar. Days before `minDate` or after `maxDate` are
 * disabled. Selecting a day calls `onSelect` with that date (at midnight).
 */
export function Calendar({
  value,
  onSelect,
  minDate,
  maxDate,
}: {
  value: Date;
  onSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1)
  );

  const min = minDate ? startOfDay(minDate) : undefined;
  const max = maxDate ? startOfDay(maxDate) : undefined;

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build a grid of cells (null for leading/trailing blanks), then chunk into
  // weeks of exactly 7 so each row lays out with fixed columns.
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  function shiftMonth(delta: number) {
    setVisibleMonth(new Date(year, month + delta, 1));
  }

  const canGoPrev =
    !min || new Date(year, month, 1) > new Date(min.getFullYear(), min.getMonth(), 1);
  const canGoNext =
    !max || new Date(year, month, 1) < new Date(max.getFullYear(), max.getMonth(), 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Pressable
          onPress={() => canGoPrev && shiftMonth(-1)}
          disabled={!canGoPrev}
          hitSlop={8}
          style={[styles.navBtn, !canGoPrev && styles.navDisabled]}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.monthLabel}>
          {MONTHS[month]} {year}
        </Text>
        <Pressable
          onPress={() => canGoNext && shiftMonth(1)}
          disabled={!canGoNext}
          hitSlop={8}
          style={[styles.navBtn, !canGoNext && styles.navDisabled]}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((d, i) => (
          <View key={i} style={styles.cell}>
            <Text style={styles.weekday}>{d}</Text>
          </View>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} style={styles.weekRow}>
          {week.map((date, di) => {
            if (!date) return <View key={`b${wi}-${di}`} style={styles.cell} />;
            const disabled =
              (min && date < min) || (max && date > max) ? true : false;
            const selected = sameDay(date, value);
            return (
              <View key={date.toISOString()} style={styles.cell}>
                <Pressable
                  onPress={() => !disabled && onSelect(startOfDay(date))}
                  disabled={disabled}
                  style={[styles.day, selected && styles.daySelected]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      disabled && styles.dayDisabled,
                      selected && styles.dayTextSelected,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    wrap: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    navBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    navDisabled: { opacity: 0.35 },
    monthLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
    weekRow: { flexDirection: 'row' },
    cell: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 3,
    },
    weekday: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
    day: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
    daySelected: { backgroundColor: colors.primary },
    dayText: { fontSize: 14, color: colors.text, fontWeight: '600' },
    dayTextSelected: { color: colors.white, fontWeight: '800' },
    dayDisabled: { color: colors.border },
  });
