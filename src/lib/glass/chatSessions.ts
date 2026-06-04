import { ChatMessage as ChatMessageType } from './types';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessageType[];
  providerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function createNewSession(providerId: string | null = null): ChatSession {
  const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  return {
    id,
    title: 'New Chat',
    messages: [],
    providerId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function generateChatTitle(messages: ChatMessageType[]): string {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'New Chat';
  const title = first.content.trim();
  return title.length > 40 ? `${title.substring(0, 40)}...` : title;
}

export function loadSessionsFromStorage(): ChatSession[] {
  try {
    const raw = sessionStorage.getItem('glasslm_chat_sessions');
    if (!raw) return [];
    const parsed: unknown[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((s: unknown) => {
      const session = s as Record<string, unknown>;
      return {
        ...session,
        messages: (Array.isArray(session.messages) ? session.messages : []).map((m: unknown) => {
          const msg = m as Record<string, unknown>;
          return { ...msg, timestamp: new Date(msg.timestamp as string) };
        }),
        createdAt: new Date(session.createdAt as string),
        updatedAt: new Date(session.updatedAt as string),
      } as ChatSession;
    });
  } catch {
    // Corrupted storage — start fresh
    sessionStorage.removeItem('glasslm_chat_sessions');
    return [];
  }
}

export function saveSessionsToStorage(sessions: ChatSession[]): void {
  sessionStorage.setItem('glasslm_chat_sessions', JSON.stringify(sessions));
}

export function loadActiveSessionId(): string | null {
  return sessionStorage.getItem('glasslm_active_session_id');
}

export function saveActiveSessionId(sessionId: string): void {
  sessionStorage.setItem('glasslm_active_session_id', sessionId);
}
