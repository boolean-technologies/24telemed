import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { env } from '@/config/env';
import { colors, spacing } from '@/theme';

type PaystackResult =
  | { status: 'success'; reference: string }
  | { status: 'closed' };

function buildCheckoutHtml(opts: {
  email: string;
  amountKobo: number;
  reference: string;
  publicKey: string;
}) {
  // Loads Paystack's own hosted popup script (the same one react-paystack
  // wraps on web) so card details never touch our app or backend.
  return `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;background:#fff;">
<script src="https://js.paystack.co/v1/inline.js"></script>
<script>
  function post(data) {
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
  }
  function onDone(response) {
    post({ status: 'success', reference: (response && response.reference) || '${opts.reference}' });
  }
  try {
    var handler = PaystackPop.setup({
      key: '${opts.publicKey}',
      email: '${opts.email}',
      amount: ${opts.amountKobo},
      currency: 'NGN',
      ref: '${opts.reference}',
      callback: onDone,
      onSuccess: onDone,
      onClose: function () { post({ status: 'closed' }); }
    });
    handler.openIframe();
  } catch (e) {
    post({ status: 'closed' });
  }
</script>
</body>
</html>`;
}

/**
 * Full-screen Paystack checkout. Hosts Paystack's own popup script in a
 * WebView so we never handle card data directly — mirrors the web app's
 * react-paystack flow, just without a DOM to mount into.
 */
export function PaystackCheckout({
  visible,
  email,
  amountNaira,
  onSuccess,
  onClose,
}: {
  visible: boolean;
  email: string;
  amountNaira: number;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  // Regenerate the reference each time the sheet opens so a cancelled/retried
  // payment never reuses one Paystack has already seen.
  const reference = useMemo(
    () => `24tm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible]
  );
  const html = useMemo(
    () =>
      buildCheckoutHtml({
        email,
        amountKobo: Math.round(amountNaira * 100),
        reference,
        publicKey: env.paystackPublicKey,
      }),
    [email, amountNaira, reference]
  );

  function handleMessage(event: WebViewMessageEvent) {
    let data: PaystackResult;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch {
      onClose();
      return;
    }
    if (data.status === 'success') {
      onSuccess(data.reference);
    } else {
      onClose();
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={onClose} hitSlop={10}>
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
      </View>
      {visible ? (
        <WebView
          source={{ html }}
          onMessage={handleMessage}
          style={styles.webview}
        />
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  webview: { flex: 1 },
});
