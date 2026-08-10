import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { Avatar, ScreenHeader } from '@/components/ui';
import { getErrorMessage } from '@/api/errors';
import { uploadProfilePhoto } from '@/account/profileApi';
import { formatNaira } from '@/features/wallet/format';
import { radius, spacing, type Palette } from '@/theme';
import {
  useTheme,
  useThemedStyles,
  type ThemePreference,
} from '@/theme/ThemeContext';

/**
 * Shared account screen for both roles. `editHref`/`editLabel` provide the
 * role-specific "edit my details" entry (records for patients, profile for
 * doctors).
 */
export function AccountScreen({
  editHref,
  editLabel,
  walletHref,
}: {
  editHref?: Href;
  editLabel?: string;
  /** Shown only for roles that use the wallet (patients). */
  walletHref?: Href;
}) {
  const { user, signOut, refreshUser } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const name =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.username ||
    '—';

  async function choosePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Photo access needed',
        'Allow photo access to choose a profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;

    setUploadingPhoto(true);
    try {
      await uploadProfilePhoto(result.assets[0]);
      await refreshUser();
    } catch (error) {
      Alert.alert(
        'Upload failed',
        getErrorMessage(error, { fallback: 'Could not upload the photo.' })
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  return (
    <View style={styles.safe}>
      <ScreenHeader title="Account" subtitle={user?.email || user?.username} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.profile}>
          <Pressable
            style={styles.avatarButton}
            onPress={choosePhoto}
            disabled={uploadingPhoto}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
          >
            <Avatar name={name} uri={user?.photo} size={80} />
            <View style={styles.cameraBadge}>
              <Ionicons
                name={uploadingPhoto ? 'hourglass-outline' : 'camera'}
                size={16}
                color={colors.white}
              />
            </View>
          </Pressable>
          <Text style={styles.photoHint}>
            {uploadingPhoto ? 'Uploading…' : 'Tap photo to change'}
          </Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.sub}>{user?.email || user?.username}</Text>
        </View>

        <Text style={styles.sectionLabel}>Appearance</Text>
        <View style={styles.card}>
          <ThemeToggle />
        </View>

        <Text style={styles.sectionLabel}>Settings</Text>
        <View style={styles.card}>
          {editHref ? (
            <ActionRow
              icon="create-outline"
              label={editLabel ?? 'Edit details'}
              onPress={() => router.push(editHref)}
            />
          ) : null}
          {walletHref ? (
            <ActionRow
              icon="wallet-outline"
              label="Wallet"
              sublabel={user?.wallet ? formatNaira(user.wallet.balance) : undefined}
              onPress={() => router.push(walletHref)}
            />
          ) : null}
          <ActionRow
            icon="key-outline"
            label="Change password"
            onPress={() => router.push('/change-password')}
          />
          <ActionRow
            icon="document-text-outline"
            label="Terms of Use"
            onPress={() => router.push('/legal/terms')}
          />
          <ActionRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => router.push('/legal/privacy')}
            last
          />
        </View>

        <View style={styles.card}>
          <ActionRow
            icon="log-out-outline"
            label="Sign out"
            danger
            onPress={signOut}
            last
          />
        </View>
      </ScrollView>
    </View>
  );
}

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
];

function ThemeToggle() {
  const { colors, preference, setPreference } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.segmentWrap}>
      {THEME_OPTIONS.map((opt) => {
        const active = preference === opt.value;
        return (
          <Pressable
            key={opt.value}
            style={[styles.segment, active && styles.segmentActive]}
            onPress={() => setPreference(opt.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Ionicons
              name={opt.icon}
              size={18}
              color={active ? colors.white : colors.textMuted}
            />
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ActionRow({
  icon,
  label,
  sublabel,
  onPress,
  last,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  onPress: () => void;
  last?: boolean;
  danger?: boolean;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable style={[styles.row, last && styles.rowLast]} onPress={onPress}>
      <Ionicons name={icon} size={22} color={danger ? colors.danger : colors.text} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, danger && { color: colors.danger }]}>{label}</Text>
        {sublabel ? <Text style={styles.rowSublabel}>{sublabel}</Text> : null}
      </View>
      {!danger ? (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      ) : null}
    </Pressable>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    body: { padding: spacing.lg },
    profile: { alignItems: 'center', marginBottom: spacing.lg },
    avatarButton: { position: 'relative' },
    cameraBadge: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.background,
    },
    photoHint: { fontSize: 12, color: colors.primary, marginTop: spacing.sm },
    name: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
    sub: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: spacing.sm,
      marginLeft: spacing.xs,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.lg,
    },
    segmentWrap: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingVertical: spacing.md,
    },
    segment: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: spacing.sm + 2,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    segmentActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    segmentText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
    segmentTextActive: { color: colors.white },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    rowLast: { borderBottomWidth: 0 },
    rowLabel: { color: colors.text, fontSize: 16 },
    rowSublabel: { color: colors.textMuted, fontSize: 12, marginTop: 1 },
  });
