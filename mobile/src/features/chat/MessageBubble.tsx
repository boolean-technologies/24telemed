import { useMemo, useRef } from 'react';
import {
  Animated,
  Image,
  Linking,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ChatMessage } from './api';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

export function MessageBubble({
  message,
  onReply,
  onReactionMenu,
  showReactionPicker,
  onChooseReaction,
  onReact,
}: {
  message: ChatMessage;
  onReply: () => void;
  onReactionMenu: () => void;
  showReactionPicker: boolean;
  onChooseReaction: (emoji: string) => void;
  onReact: (emoji: string) => void;
}) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const translateX = useRef(new Animated.Value(0)).current;
  const leftHintOpacity = translateX.interpolate({
    inputRange: [0, 12, 32],
    outputRange: [0, 0.35, 1],
    extrapolate: 'clamp',
  });
  const rightHintOpacity = translateX.interpolate({
    inputRange: [-32, -12, 0],
    outputRange: [1, 0.35, 0],
    extrapolate: 'clamp',
  });
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 6 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.15,
        onPanResponderMove: (_, gesture) => {
          translateX.setValue(Math.min(Math.max(gesture.dx, -64), 64));
        },
        onPanResponderRelease: (_, gesture) => {
          if (
            Math.abs(gesture.dx) > 28 ||
            (Math.abs(gesture.dx) > 14 && Math.abs(gesture.vx) > 0.35)
          ) {
            onReply();
          }
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [onReply, translateX]
  );

  return (
    <View
      style={[
        styles.wrap,
        message.is_mine ? styles.wrapMine : styles.wrapTheirs,
        showReactionPicker && styles.activeWrap,
      ]}
    >
      <Animated.View
        style={[styles.replyHint, styles.replyHintLeft, { opacity: leftHintOpacity }]}
      >
        <Ionicons name="return-up-back" size={18} color={colors.textMuted} />
      </Animated.View>
      <Animated.View
        style={[
          styles.replyHint,
          styles.replyHintRight,
          { opacity: rightHintOpacity },
        ]}
      >
        <Ionicons name="return-up-forward" size={18} color={colors.textMuted} />
      </Animated.View>

      {showReactionPicker ? (
        <View
          style={[
            styles.reactionPicker,
            message.is_mine ? styles.pickerMine : styles.pickerTheirs,
          ]}
        >
          {['👍', '❤️', '😂', '😮', '😢', '🙏'].map((emoji) => (
            <Pressable
              key={emoji}
              style={styles.reactionOption}
              onPress={() => onChooseReaction(emoji)}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Animated.View
        {...panResponder.panHandlers}
        style={{ transform: [{ translateX }] }}
      >
        <Pressable
          delayLongPress={250}
          onLongPress={onReactionMenu}
          style={[
            styles.bubble,
            message.is_mine ? styles.mine : styles.theirs,
          ]}
        >
          {message.reply_to ? (
            <View
              style={[
                styles.quote,
                message.is_mine ? styles.quoteMine : styles.quoteTheirs,
              ]}
            >
              <Text
                style={[
                  styles.quoteText,
                  message.is_mine && styles.lightText,
                ]}
                numberOfLines={2}
              >
                {message.reply_to.body ||
                  message.reply_to.attachment_name ||
                  'Attachment'}
              </Text>
            </View>
          ) : null}

          {message.attachments.map((attachment) =>
            attachment.content_type.startsWith('image/') ? (
              <Pressable
                key={attachment.id}
                onPress={() => void Linking.openURL(attachment.url)}
              >
                <Image
                  source={{ uri: attachment.url }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </Pressable>
            ) : (
              <Pressable
                key={attachment.id}
                style={[
                  styles.file,
                  message.is_mine && styles.fileMine,
                ]}
                onPress={() => void Linking.openURL(attachment.url)}
              >
                <Ionicons
                  name="document-text"
                  size={24}
                  color={message.is_mine ? colors.white : colors.primary}
                />
                <View style={styles.fileText}>
                  <Text
                    style={[
                      styles.fileName,
                      message.is_mine && styles.lightText,
                    ]}
                    numberOfLines={1}
                  >
                    {attachment.original_name}
                  </Text>
                  <Text
                    style={[
                      styles.fileSize,
                      message.is_mine && styles.mineTime,
                    ]}
                  >
                    {formatSize(attachment.size)}
                  </Text>
                </View>
              </Pressable>
            )
          )}

          {message.body ? (
            <Text style={[styles.body, message.is_mine && styles.lightText]}>
              {message.body}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <Text style={[styles.time, message.is_mine && styles.mineTime]}>
              {new Date(message.created_at).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
            <DeliveryTicks
              message={message}
              color="rgba(255,255,255,0.85)"
              readColor="#052a25"
            />
          </View>
        </Pressable>
      </Animated.View>

      {message.reaction_summary.length ? (
        <View style={styles.reactions}>
          {message.reaction_summary.map((reaction) => (
            <Pressable
              key={reaction.emoji}
              style={[
                styles.reaction,
                reaction.reacted_by_me && styles.myReaction,
              ]}
              onPress={() => onReact(reaction.emoji)}
            >
              <Text style={styles.reactionText}>
                {reaction.emoji} {reaction.count}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/**
 * WhatsApp-style delivery ticks for the sender's own messages:
 *  • single tick  → sent (recipient not online yet)
 *  • double tick  → delivered (recipient's app has it)
 *  • double bold  → read (recipient opened the chat)
 *
 * `color` is used for the sent/delivered states, `readColor` for the bolder
 * "read" state, so the same component works on the teal bubble and on the
 * conversation-list row.
 */
export function DeliveryTicks({
  message,
  color,
  readColor,
  size = 15,
}: {
  message: Pick<ChatMessage, 'is_mine' | 'delivered_at' | 'read_at'>;
  color: string;
  readColor: string;
  size?: number;
}) {
  if (!message.is_mine) return null;
  const read = Boolean(message.read_at);
  const delivered = read || Boolean(message.delivered_at);
  return (
    <Ionicons
      name={delivered ? 'checkmark-done' : 'checkmark'}
      size={read ? size + 1 : size}
      color={read ? readColor : color}
      style={{ marginLeft: 3 }}
    />
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  wrap: { maxWidth: '82%', marginBottom: spacing.xs + 2 },
  wrapMine: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 2,
  },
  wrapTheirs: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 2,
  },
  activeWrap: { zIndex: 100, elevation: 10 },
  replyHint: {
    position: 'absolute',
    top: 16,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replyHintLeft: { left: -29 },
  replyHintRight: { right: -29 },
  bubble: {
    minWidth: 92,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  mine: { backgroundColor: colors.primary },
  theirs: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quote: {
    borderLeftWidth: 3,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
  },
  quoteMine: {
    borderLeftColor: colors.white,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  quoteTheirs: {
    borderLeftColor: colors.primary,
    backgroundColor: colors.background,
  },
  quoteText: { color: colors.textMuted, fontSize: 12, lineHeight: 16 },
  body: { color: colors.text, fontSize: 15, lineHeight: 20 },
  lightText: { color: colors.white },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  time: {
    fontSize: 10,
    color: colors.textMuted,
  },
  mineTime: { color: 'rgba(255,255,255,0.75)' },
  image: {
    width: 210,
    height: 150,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.border,
  },
  file: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 210,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  fileMine: { backgroundColor: 'rgba(255,255,255,0.14)' },
  fileText: { flex: 1 },
  fileName: { color: colors.text, fontWeight: '700', fontSize: 13 },
  fileSize: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: -4,
    paddingHorizontal: spacing.sm,
  },
  reaction: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  myReaction: { borderColor: colors.primary, backgroundColor: colors.tint },
  reactionText: { fontSize: 12, color: colors.text },
  reactionPicker: {
    position: 'absolute',
    top: -58,
    flexDirection: 'row',
    padding: 5,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    zIndex: 110,
  },
  pickerMine: { right: 0 },
  pickerTheirs: { left: 0 },
  reactionOption: { padding: 6 },
  reactionEmoji: { fontSize: 23 },
});
