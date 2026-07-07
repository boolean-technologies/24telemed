import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, ScreenHeader } from '@/components/ui';
import { useAuth } from '@/auth/AuthContext';
import { DeliveryTicks } from './MessageBubble';
import { useConversations } from './hooks';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

function fullName(user: {
  first_name?: string;
  last_name?: string;
  username?: string;
}) {
  return (
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.username ||
    'Unknown'
  );
}

export function ChatList() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { role } = useAuth();
  const { data = [], isLoading, refetch } = useConversations();
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const routeRole = role === 'doctor' ? 'doctor' : 'patient';

  async function refreshFromPull() {
    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  }

  return (
    <View style={styles.safe}>
      <ScreenHeader title="Messages" subtitle="Your doctors and patients" />
      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={isPullRefreshing}
          onRefresh={refreshFromPull}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Conversations appear here after a booking or consultation.
            </Text>
          }
          renderItem={({ item }) => {
            const name = fullName(item.counterpart);
            return (
              <Pressable
                style={styles.row}
                onPress={() =>
                  router.push(`/${`(${routeRole})`}/chat/${item.id}`)
                }
              >
                <Avatar name={name} uri={item.counterpart.photo} size={50} />
                <View style={styles.main}>
                  <Text style={styles.name} numberOfLines={1}>
                    {role === 'patient' ? 'Dr. ' : ''}
                    {name}
                  </Text>
                  <View style={styles.previewRow}>
                    {item.last_message ? (
                      <DeliveryTicks
                        message={item.last_message}
                        color={colors.textMuted}
                        readColor={colors.text}
                        size={14}
                      />
                    ) : null}
                    <Text style={styles.preview} numberOfLines={1}>
                      {item.last_message?.body ||
                        (item.last_message?.attachments.length
                          ? 'Attachment'
                          : 'Start a conversation')}
                    </Text>
                  </View>
                </View>
                <View style={styles.right}>
                  {item.last_message ? (
                    <Text style={styles.time}>
                      {new Date(item.last_message.created_at).toLocaleTimeString(
                        undefined,
                        { hour: 'numeric', minute: '2-digit' }
                      )}
                    </Text>
                  ) : null}
                  {item.unread_count > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.unread_count}</Text>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loader: { marginTop: spacing.xl },
  list: { padding: spacing.lg, flexGrow: 1 },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 21,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  main: { flex: 1 },
  name: { fontSize: 15, fontWeight: '800', color: colors.text },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  preview: { flexShrink: 1, fontSize: 13, color: colors.textMuted },
  right: { alignItems: 'flex-end', gap: spacing.xs },
  time: { fontSize: 11, color: colors.textMuted },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
});
