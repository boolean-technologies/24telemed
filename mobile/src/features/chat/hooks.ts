import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ChatApi,
  type ChatMessage,
  type SendMessageInput,
} from './api';

export function useConversations() {
  return useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: ChatApi.list,
    refetchInterval: 10_000,
  });
}

export function useMessages(conversationId?: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['chat', 'messages', conversationId],
    queryFn: async () => {
      const messages = await ChatApi.messages(conversationId as string);
      queryClient.setQueryData(
        ['chat', 'conversations'],
        (current: Awaited<ReturnType<typeof ChatApi.list>> | undefined) =>
          current?.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, unread_count: 0 }
              : conversation
          )
      );
      return messages;
    },
    enabled: Boolean(conversationId),
    refetchInterval: 5_000,
  });
}

export function useUnreadMessageCount() {
  const { data = [] } = useConversations();
  return data.reduce(
    (total, conversation) => total + conversation.unread_count,
    0
  );
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SendMessageInput) =>
      ChatApi.send(conversationId, input),
    onSuccess: (message) => {
      queryClient.setQueryData(
        ['chat', 'messages', conversationId],
        (current: unknown) => {
          const messages = Array.isArray(current) ? current : [];
          return messages.some((item) => item.id === message.id)
            ? messages
            : [...messages, message];
        }
      );
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    },
  });
}

export function useReactToMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      emoji,
    }: {
      messageId: string;
      emoji: string;
    }) => ChatApi.react(conversationId, messageId, emoji),
    onSuccess: (updated) => {
      queryClient.setQueryData<ChatMessage[]>(
        ['chat', 'messages', conversationId],
        (current) =>
          current?.map((message) =>
            message.id === updated.id ? updated : message
          )
      );
    },
  });
}
