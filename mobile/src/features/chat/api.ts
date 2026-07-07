import { OpenAPI } from '@/api';
import { request as __request } from '@/api/core/request';
import { getAccessToken } from '@/auth/storage';
import { API_BASE_URL } from '@/config/api';

export type ChatUser = {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo?: string | null;
  specialty?: string | null;
};

export type ChatAttachment = {
  id: string;
  url: string;
  original_name: string;
  content_type: string;
  size: number;
};

export type ChatReaction = {
  emoji: string;
  count: number;
  reacted_by_me: boolean;
};

export type ChatReply = {
  id: string;
  sender: string;
  body: string;
  attachment_name?: string | null;
};

export type ChatMessage = {
  id: string;
  sender: string;
  body: string;
  reply_to?: ChatReply | null;
  attachments: ChatAttachment[];
  reaction_summary: ChatReaction[];
  created_at: string;
  delivered_at?: string | null;
  read_at?: string | null;
  is_mine: boolean;
};

export type Conversation = {
  id: string;
  counterpart: ChatUser;
  last_message?: ChatMessage | null;
  unread_count: number;
  created_at: string;
  updated_at: string;
};

export type PendingChatFile = {
  uri: string;
  name: string;
  mimeType?: string | null;
  size?: number;
};

export type SendMessageInput = {
  body: string;
  replyTo?: string;
  files?: PendingChatFile[];
};

async function sendMultipartMessage(
  conversationId: string,
  input: SendMessageInput
) {
  const token = await getAccessToken();
  const form = new FormData();
  form.append('body', input.body);
  if (input.replyTo) form.append('reply_to', input.replyTo);
  for (const file of input.files ?? []) {
    form.append(
      'files',
      {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/octet-stream',
      } as unknown as Blob
    );
  }
  const response = await fetch(
    `${API_BASE_URL}/chat/conversations/${conversationId}/messages/`,
    {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || 'Could not send the message.');
  }
  return data as ChatMessage;
}

export const ChatApi = {
  list: () =>
    __request<Conversation[]>(OpenAPI, {
      method: 'GET',
      url: '/chat/conversations/',
    }),

  open: (participantId: string) =>
    __request<Conversation>(OpenAPI, {
      method: 'POST',
      url: '/chat/conversations/',
      body: { participant_id: participantId },
    }),

  messages: (conversationId: string) =>
    __request<ChatMessage[]>(OpenAPI, {
      method: 'GET',
      url: `/chat/conversations/${conversationId}/messages/`,
    }),

  send: (conversationId: string, input: SendMessageInput) =>
    input.files?.length
      ? sendMultipartMessage(conversationId, input)
      : __request<ChatMessage>(OpenAPI, {
          method: 'POST',
          url: `/chat/conversations/${conversationId}/messages/`,
          body: { body: input.body, reply_to: input.replyTo },
        }),

  react: (conversationId: string, messageId: string, emoji: string) =>
    __request<ChatMessage>(OpenAPI, {
      method: 'POST',
      url: `/chat/conversations/${conversationId}/messages/${messageId}/reaction/`,
      body: { emoji },
    }),
};
