import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { Button, Card, ScreenHeader } from '@/components/ui';
import { useWalletTransactions } from '@/features/wallet/hooks';
import { formatNaira } from '@/features/wallet/format';
import { Transaction } from '@/api';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

export default function WalletScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { user, refreshUser } = useAuth();
  const { data, isLoading, refetch, isRefetching } = useWalletTransactions();
  const [refreshingUser, setRefreshingUser] = useState(false);

  const wallet = user?.wallet;
  const sessions = wallet?.call_session ?? 0;

  const onRefresh = useCallback(() => {
    setRefreshingUser(true);
    refetch();
    refreshUser().finally(() => setRefreshingUser(false));
  }, [refetch, refreshUser]);

  return (
    <View style={styles.safe}>
      <ScreenHeader title="Wallet" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching || refreshingUser}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={styles.balanceValue}>{formatNaira(wallet?.balance)}</Text>
          <View style={[styles.sessionsPill, sessions === 0 && styles.sessionsPillLow]}>
            <Ionicons
              name="videocam"
              size={14}
              color={sessions === 0 ? colors.danger : colors.primary}
            />
            <Text
              style={[
                styles.sessionsText,
                { color: sessions === 0 ? colors.danger : colors.primary },
              ]}
            >
              {sessions} call session{sessions === 1 ? '' : 's'} available
            </Text>
          </View>
          {wallet?.call_unit_cost ? (
            <Text style={styles.unitCost}>
              {formatNaira(wallet.call_unit_cost)} per call session
            </Text>
          ) : null}
          <Button
            title="Fund wallet"
            onPress={() => router.push('/(patient)/wallet/fund')}
            style={{ marginTop: spacing.md }}
          />
        </Card>

        <Text style={styles.sectionTitle}>Transaction history</Text>
        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
        ) : (data?.results ?? []).length === 0 ? (
          <Text style={styles.empty}>No transactions yet.</Text>
        ) : (
          (data?.results ?? []).map((t) => <TransactionRow key={t.id} transaction={t} />)
        )}
      </ScrollView>
    </View>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const styles = useThemedStyles(makeStyles);
  const { colors } = useTheme();
  const isDeposit = transaction.transaction_type === Transaction.transaction_type.DEPOSIT;
  const sign = isDeposit ? '+' : '-';
  const color = isDeposit ? colors.success : colors.text;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.rowIcon,
          { backgroundColor: isDeposit ? colors.tint : colors.border },
        ]}
      >
        <Ionicons
          name={isDeposit ? 'arrow-down' : 'arrow-up'}
          size={16}
          color={isDeposit ? colors.primary : colors.textMuted}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {transaction.description || (isDeposit ? 'Wallet top-up' : 'Call session')}
        </Text>
        <Text style={styles.rowSub}>
          {transaction.created_at
            ? new Date(transaction.created_at).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })
            : ''}
          {transaction.status && transaction.status !== Transaction.status.SUCCESSFUL
            ? ` · ${transaction.status}`
            : ''}
        </Text>
      </View>
      <Text style={[styles.rowAmount, { color }]}>
        {sign}
        {formatNaira(transaction.amount)}
      </Text>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    body: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
    balanceCard: { alignItems: 'flex-start' },
    balanceLabel: { color: colors.textMuted, fontSize: 13 },
    balanceValue: { color: colors.text, fontSize: 32, fontWeight: '900', marginTop: 4 },
    sessionsPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: spacing.sm,
      backgroundColor: colors.tint,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      borderRadius: 999,
    },
    sessionsPillLow: { backgroundColor: '#fdeaea' },
    sessionsText: { fontSize: 13, fontWeight: '700' },
    unitCost: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    empty: { color: colors.textMuted },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    rowIcon: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowTitle: { color: colors.text, fontWeight: '700', fontSize: 14 },
    rowSub: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
    rowAmount: { fontWeight: '800', fontSize: 14 },
  });
