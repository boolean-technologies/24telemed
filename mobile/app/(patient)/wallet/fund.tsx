import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/AuthContext';
import { UsersService } from '@/api';
import { Button, Card, ScreenHeader, TextField } from '@/components/ui';
import { PaystackCheckout } from '@/features/wallet/PaystackCheckout';
import { formatNaira } from '@/features/wallet/format';
import { spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

const MIN_CUSTOM_NAIRA = 100;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function FundWalletScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { user, refreshUser } = useAuth();
  const [mode, setMode] = useState<'sessions' | 'custom'>('sessions');
  const [sessions, setSessions] = useState(1);
  const [customAmount, setCustomAmount] = useState('');
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const unitCost = user?.wallet?.call_unit_cost || 0;
  const startingSessions = user?.wallet?.call_session ?? 0;
  const customNaira = Number(customAmount) || 0;
  const totalNaira = mode === 'sessions' ? sessions * unitCost : customNaira;
  const isCustomValid = customNaira >= MIN_CUSTOM_NAIRA;
  const canPay = mode === 'sessions' ? unitCost > 0 : isCustomValid;

  async function handlePaymentSuccess() {
    setCheckoutVisible(false);
    setConfirming(true);
    // Crediting happens server-side via the Paystack webhook, which can lag a
    // few seconds behind the popup closing — poll the API directly (not just
    // component state, which won't reflect refreshUser() inside this closure)
    // rather than assume it's already landed.
    let latestSessions = startingSessions;
    for (let attempt = 0; attempt < 6; attempt++) {
      await wait(2000);
      try {
        const me = await UsersService.usersCurrentUser();
        latestSessions = me.wallet?.call_session ?? latestSessions;
        if (latestSessions > startingSessions) break;
      } catch {
        // Transient network error — keep polling.
      }
    }
    await refreshUser();
    setConfirming(false);
    if (latestSessions > startingSessions) {
      Alert.alert('Wallet funded', 'Your balance has been updated.');
    } else {
      Alert.alert(
        'Payment received',
        "We're still confirming your payment with Paystack. Your balance will update automatically in a few minutes — no need to pay again."
      );
    }
    router.back();
  }

  return (
    <View style={styles.safe}>
      <ScreenHeader title="Fund wallet" onBack={() => router.back()} />
      <View style={styles.body}>
        <Card>
          <View style={styles.modeRow}>
            <Pressable
              style={[styles.modeBtn, mode === 'sessions' && styles.modeBtnActive]}
              onPress={() => setMode('sessions')}
            >
              <Text style={[styles.modeText, mode === 'sessions' && styles.modeTextActive]}>
                Call sessions
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modeBtn, mode === 'custom' && styles.modeBtnActive]}
              onPress={() => setMode('custom')}
            >
              <Text style={[styles.modeText, mode === 'custom' && styles.modeTextActive]}>
                Custom amount
              </Text>
            </Pressable>
          </View>

          {mode === 'sessions' ? (
            <>
              <Text style={styles.label}>Number of call sessions</Text>
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setSessions((s) => Math.max(1, s - 1))}
                >
                  <Ionicons name="remove" size={20} color={colors.text} />
                </Pressable>
                <Text style={styles.stepValue}>{sessions}</Text>
                <Pressable style={styles.stepBtn} onPress={() => setSessions((s) => s + 1)}>
                  <Ionicons name="add" size={20} color={colors.text} />
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <TextField
                label={`Amount to fund (min ${formatNaira(MIN_CUSTOM_NAIRA)})`}
                keyboardType="number-pad"
                placeholder="e.g. 5000"
                value={customAmount}
                onChangeText={setCustomAmount}
              />
              {customAmount && !isCustomValid ? (
                <Text style={styles.errorText}>
                  Minimum funding amount is {formatNaira(MIN_CUSTOM_NAIRA)}.
                </Text>
              ) : unitCost > 0 && customNaira > 0 ? (
                <Text style={styles.hintText}>
                  ≈ {(customNaira / unitCost).toFixed(2)} call session
                  {customNaira / unitCost === 1 ? '' : 's'}
                </Text>
              ) : null}
            </>
          )}

          <View style={styles.divider} />

          {mode === 'sessions' ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Per session</Text>
              <Text style={styles.summaryValue}>{formatNaira(unitCost)}</Text>
            </View>
          ) : null}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelBold}>Total</Text>
            <Text style={styles.summaryValueBold}>{formatNaira(totalNaira)}</Text>
          </View>

          <Button
            title={confirming ? 'Confirming payment…' : 'Pay with Paystack'}
            onPress={() => setCheckoutVisible(true)}
            loading={confirming}
            disabled={!canPay}
            style={{ marginTop: spacing.lg }}
          />
        </Card>
      </View>

      {user?.email ? (
        <PaystackCheckout
          visible={checkoutVisible}
          email={user.email}
          amountNaira={totalNaira}
          onSuccess={handlePaymentSuccess}
          onClose={() => setCheckoutVisible(false)}
        />
      ) : null}
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    body: { padding: spacing.lg },
    modeRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    modeBtn: {
      flex: 1,
      paddingVertical: spacing.sm + 2,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    modeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    modeText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
    modeTextActive: { color: colors.white },
    errorText: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
    hintText: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
    label: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.lg,
      marginTop: spacing.md,
    },
    stepBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepValue: { fontSize: 24, fontWeight: '900', color: colors.text, minWidth: 40, textAlign: 'center' },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    summaryLabel: { color: colors.textMuted, fontSize: 14 },
    summaryValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
    summaryLabelBold: { color: colors.text, fontSize: 15, fontWeight: '800' },
    summaryValueBold: { color: colors.text, fontSize: 15, fontWeight: '800' },
  });
