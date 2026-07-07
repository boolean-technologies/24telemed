import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors, type Palette } from '@/theme';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = '@24telemed/theme-preference';

type ThemeContextValue = {
  /** Active palette (already resolved for light/dark). */
  colors: Palette;
  /** Whether the resolved scheme is dark. */
  isDark: boolean;
  /** The user's stored choice ('system' follows the OS). */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Load the saved preference once on mount.
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (active && (value === 'light' || value === 'dark' || value === 'system')) {
          setPreferenceState(value);
        }
      })
      .catch(() => {
        // Ignore — fall back to 'system'.
      });
    return () => {
      active = false;
    };
  }, []);

  // Track OS-level appearance changes while following the system.
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      // Persisting is best-effort.
    });
  }, []);

  const isDark =
    preference === 'dark' || (preference === 'system' && systemScheme === 'dark');

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
      preference,
      setPreference,
    }),
    [isDark, preference, setPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback so components used outside the provider still render.
    return {
      colors: lightColors,
      isDark: false,
      preference: 'system',
      setPreference: () => {},
    };
  }
  return ctx;
}

/**
 * Build a memoised StyleSheet from the active palette. Pass a module-level
 * factory: `const makeStyles = (colors: Palette) => StyleSheet.create({...})`.
 */
export function useThemedStyles<T>(factory: (colors: Palette) => T): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [factory, colors]);
}
