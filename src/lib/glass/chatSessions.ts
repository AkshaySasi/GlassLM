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
    return {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: 'New Chat',
        messages: [],
        providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export function generateChatTitle(messages: ChatMessageType[]): string {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (!firstUserMessage) return 'New Chat';

    const title = firstUserMessage.content.trim();
    return title.length > 40 ? title.substring(0, 40) + '...' : title;
}

export function loadSessionsFromStorage(): ChatSession[] {
    const saved = sessionStorage.getItem('glasslm_chat_sessions');
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return parsed.map((session: any) => ({
        ...session,
        messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        })),
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
    }));
}

export function saveSessionsToStorage(sessions: ChatSession[]) {
    sessionStorage.setItem('glasslm_chat_sessions', JSON.stringify(sessions));
}

export function loadActiveSessionId(): string | null {
    return sessionStorage.getItem('glasslm_active_session_id');
}

export function saveActiveSessionId(sessionId: string) {
    sessionStorage.setItem('glasslm_active_session_id', sessionId);
}
