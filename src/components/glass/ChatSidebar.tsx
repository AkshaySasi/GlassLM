import { useState } from 'react';
import { PanelLeftClose, PanelLeft, Plus, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from './ConfirmDialog';

interface ChatSession {
    id: string;
    title: string;
    messages: any[];
    providerId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface ChatSidebarProps {
    sessions: ChatSession[];
    activeSessionId: string;
    onSelectSession: (sessionId: string) => void;
    onNewChat: () => void;
    onDeleteSession: (sessionId: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export function ChatSidebar({
    sessions,
    activeSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    isOpen,
    onToggle,
}: ChatSidebarProps) {
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sessionId: string | null }>({ isOpen: false, sessionId: null });

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed md:relative inset-y-0 left-0 z-50
          w-64 glass-surface border-r border-border/30
          transition-all duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${!isOpen && 'md:w-0 md:border-0 md:overflow-hidden md:opacity-0 md:pointer-events-none'}
        `}
            >
                <div className="flex flex-col h-full pt-16 md:pt-20">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 border-b border-border/30">
                        <h2 className="font-mono text-sm font-semibold text-foreground">Your Chats</h2>
                        <button
                            onClick={onToggle}
                            className="p-1.5 hover:bg-primary/20 rounded-lg transition-colors text-primary"
                            aria-label="Collapse sidebar"
                        >
                            <PanelLeftClose className="w-4 h-4" />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <div className="p-3">
                        <Button
                            onClick={onNewChat}
                            className="w-full gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl"
                            size="sm"
                        >
                            <Plus className="w-4 h-4" />
                            New Chat
                        </Button>
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
                        {sessions.length === 0 ? (
                            <div className="text-center py-8 px-4">
                                <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                                <p className="text-xs text-muted-foreground">No chats yet</p>
                            </div>
                        ) : (
                            sessions
                                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                .map((session) => (
                                    <div
                                        key={session.id}
                                        className={`
                      group relative rounded-lg transition-all duration-200
                      ${session.id === activeSessionId
                                                ? 'bg-primary/10 border border-primary/30'
                                                : 'hover:bg-muted/30 border border-transparent'
                                            }
                    `}
                                    >
                                        <button
                                            onClick={() => onSelectSession(session.id)}
                                            className="w-full text-left p-3 pr-10"
                                        >
                                            <div className="flex items-start gap-2 mb-1">
                                                <MessageSquare className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                                                <p className="text-sm font-medium line-clamp-2 flex-1">
                                                    {session.title}
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground font-mono ml-5">
                                                {formatDate(new Date(session.updatedAt))}
                                            </p>
                                        </button>

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirm({ isOpen: true, sessionId: session.id });
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md
                        opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive
                        transition-all duration-200"
                                            aria-label="Delete chat"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </aside>

            {/* Toggle Button (when sidebar is closed) */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed left-4 top-14 md:bottom-auto md:top-20 z-40 p-2.5 md:p-2 glass-card rounded-xl
            hover:scale-105 transition-transform duration-200"
                    aria-label="Open sidebar"
                >
                    <PanelLeft className="w-5 h-5 text-primary" />
                </button>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Delete Chat?"
                message="Are you sure you want to delete this chat? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={() => {
                    if (deleteConfirm.sessionId) {
                        onDeleteSession(deleteConfirm.sessionId);
                    }
                }}
                onCancel={() => setDeleteConfirm({ isOpen: false, sessionId: null })}
            />
        </>
    );
}
