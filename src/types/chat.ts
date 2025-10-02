// Chat-related TypeScript interfaces for real-time messaging

export interface Conversation {
  conversation_id: number;
  ticket_id: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  message_id: number;
  conversation_id: number;
  user_id: number;
  message_content: string;
  message_type: MessageType;
  message_attachment: string[];
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';

export interface MessageWithUser extends Message {
  user: {
    user_firstname: string;
    user_lastname: string;
    user_role: string;
  };
}

export interface ConversationWithMessages extends Conversation {
  messages: MessageWithUser[];
  ticket: {
    ticket_id: number;
    reference_number: string;
    ticket_concern: string;
    ticket_status: string;
  };
}

// Real-time event types
export interface RealtimeMessageEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: MessageWithUser;
  old?: MessageWithUser;
}

export interface TypingIndicator {
  user_id: number;
  conversation_id: number;
  is_typing: boolean;
  timestamp: string;
}

export interface OnlineStatus {
  user_id: number;
  is_online: boolean;
  last_seen: string;
}

// Chat context types
export interface ChatContextType {
  conversations: ConversationWithMessages[];
  currentConversation: ConversationWithMessages | null;
  messages: MessageWithUser[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, type?: MessageType) => Promise<void>;
  markAsRead: (messageId: number) => Promise<void>;
  setCurrentConversation: (conversationId: number) => void;
  subscribeToMessages: (conversationId: number) => void;
  unsubscribeFromMessages: () => void;
}

// Message sending types
export interface SendMessageParams {
  conversationId: number;
  content: string;
  type?: MessageType;
  attachments?: string[];
}

// Real-time subscription types
export interface RealtimeSubscription {
  channel: string;
  callback: (payload: any) => void;
  unsubscribe: () => void;
}
