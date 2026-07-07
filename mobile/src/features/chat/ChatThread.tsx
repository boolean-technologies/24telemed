import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useConversations,
  useMessages,
  useReactToMessage,
  useSendMessage,
} from './hooks';
import type { ChatMessage, PendingChatFile } from './api';
import { MessageBubble } from './MessageBubble';
import { getErrorMessage } from '@/api/errors';
import { radius, spacing, type Palette } from '@/theme';
import { useTheme, useThemedStyles } from '@/theme/ThemeContext';

export function ChatThread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const [body, setBody] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [files, setFiles] = useState<PendingChatFile[]>([]);
  const [reactionTarget, setReactionTarget] = useState<ChatMessage | null>(null);
  const { data: conversations = [] } = useConversations();
  const { data: messages = [] } = useMessages(id);
  const send = useSendMessage(id);
  const react = useReactToMessage(id);
  const conversation = conversations.find((item) => item.id === id);
  const name = conversation
    ? [conversation.counterpart.first_name, conversation.counterpart.last_name]
        .filter(Boolean)
        .join(' ') || conversation.counterpart.username
    : 'Conversation';

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [messages.length]);

  async function submit() {
    const value = body.trim();
    if ((!value && files.length === 0) || send.isPending) return;
    try {
      await send.mutateAsync({
        body: value,
        replyTo: replyingTo?.id,
        files,
      });
      setBody('');
      setFiles([]);
      setReplyingTo(null);
    } catch (e) {
      Alert.alert(
        'Could not send',
        getErrorMessage(e, {
          fallback: 'Please check your connection and try again.',
        })
      );
    }
  }

  function addFiles(selected: PendingChatFile[]) {
    if (files.length + selected.length > 5) {
      Alert.alert('Too many files', 'You can attach up to 5 files at once.');
      return;
    }
    const oversized = selected.find(
      (file) => (file.size ?? 0) > 10 * 1024 * 1024
    );
    if (oversized) {
      Alert.alert('File too large', `${oversized.name} is larger than 10 MB.`);
      return;
    }
    setFiles((current) => [...current, ...selected]);
  }

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
      type: '*/*',
    });
    if (result.canceled) return;
    const selected = result.assets.map((asset) => ({
      uri: asset.uri,
      name: asset.name,
      mimeType: asset.mimeType,
      size: asset.size,
    }));
    addFiles(selected);
  }

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Photo access needed',
        'Allow photo access to attach a picture.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (result.canceled) return;
    addFiles(
      result.assets.map((asset, index) => ({
        uri: asset.uri,
        name: asset.fileName || `photo-${Date.now()}-${index}.jpg`,
        mimeType: asset.mimeType || 'image/jpeg',
        size: asset.fileSize,
      }))
    );
  }

  function chooseAttachment() {
    Alert.alert('Add attachment', 'What would you like to send?', [
      { text: 'Picture', onPress: () => void pickPhoto() },
      { text: 'File', onPress: () => void pickFile() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  function startReply(message: ChatMessage) {
    setReplyingTo(message);
    setReactionTarget(null);
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  function chooseReaction(emoji: string) {
    if (!reactionTarget || react.isPending) return;
    react.mutate({ messageId: reactionTarget.id, emoji });
    setReactionTarget(null);
  }

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.header} edges={['top']}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>{name}</Text>
            <View style={styles.encRow}>
              <Ionicons name="lock-closed" size={11} color={colors.white} />
              <Text style={styles.subtitle}>End-to-end encrypted</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.flex}>
        <LinearGradient
          colors={[colors.tint, colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.flex}
          contentContainerStyle={styles.messages}
          keyboardDismissMode="interactive"
          removeClippedSubviews={false}
          ListHeaderComponent={
              <View style={styles.encNotice}>
                <Ionicons name="lock-closed" size={13} color={colors.tintText} />
                <Text style={styles.encNoticeText}>
                  Messages in this chat are secured with end-to-end encryption.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
            <MessageBubble
              message={item}
              onReply={() => startReply(item)}
              onReactionMenu={() =>
                setReactionTarget((current) =>
                  current?.id === item.id ? null : item
                )
              }
              showReactionPicker={reactionTarget?.id === item.id}
              onChooseReaction={chooseReaction}
              onReact={(emoji) =>
                react.mutate({ messageId: item.id, emoji })
              }
            />
          )}
        />
      </View>

      <SafeAreaView style={styles.composerArea} edges={['bottom']}>
        {replyingTo ? (
            <View style={styles.replyPreview}>
              <View style={styles.replyContent}>
                <Text style={styles.replyLabel}>Replying to message</Text>
                <Text style={styles.replyBody} numberOfLines={1}>
                  {replyingTo.body ||
                    replyingTo.attachments[0]?.original_name ||
                    'Attachment'}
                </Text>
              </View>
              <Pressable onPress={() => setReplyingTo(null)} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          ) : null}
          {files.length ? (
            <View style={styles.pendingFiles}>
              {files.map((file, index) => (
                <View key={`${file.uri}-${index}`} style={styles.pendingFile}>
                  <Ionicons
                    name="document-attach"
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={styles.pendingFileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Pressable
                    onPress={() =>
                      setFiles((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index)
                      )
                    }
                  >
                    <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null}
          <View style={styles.composer}>
            <Pressable style={styles.attach} onPress={chooseAttachment}>
              <Ionicons name="add" size={26} color={colors.primary} />
            </Pressable>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Write a message…"
              placeholderTextColor={colors.textMuted}
              value={body}
              onChangeText={setBody}
              multiline
              maxLength={4000}
            />
            <Pressable
              style={[
                styles.send,
                ((!body.trim() && files.length === 0) || send.isPending) &&
                  styles.disabled,
              ]}
              onPress={submit}
              disabled={
                (!body.trim() && files.length === 0) || send.isPending
              }
            >
              <Ionicons name="send" size={20} color={colors.white} />
            </Pressable>
          </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  back: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -4,
  },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontWeight: '800', color: colors.white },
  encRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  subtitle: { fontSize: 12, color: colors.white, opacity: 0.9 },
  encNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.tint,
    maxWidth: '90%',
  },
  encNoticeText: {
    color: colors.tintText,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  messages: { padding: spacing.md, flexGrow: 1, justifyContent: 'flex-end' },
  composerArea: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
  },
  attach: {
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 22,
    backgroundColor: colors.background,
    color: colors.text,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  disabled: { opacity: 0.45 },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  replyContent: { flex: 1 },
  replyLabel: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  replyBody: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  pendingFiles: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  pendingFile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  pendingFileName: { flex: 1, color: colors.text, fontSize: 12 },
});
