import { useState, useRef, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { ChatMessage as ChatMessageType, NetworkRequest, MaskedItem } from '@/lib/glass/types';
import { ConnectedProvider, AI_PROVIDERS } from '@/lib/glass/aiProviders';
import { autoMask, unmask } from '@/lib/glass/masker';
import { detectLeakage, LeakageWarning } from '@/lib/glass/leakageDetector';
import { registerMaskedItems } from '@/lib/glass/placeholderRegistry';
import { MaskingRules, DEFAULT_MASKING_RULES } from '@/lib/glass/maskingRules';
import { ChatHeader } from '@/components/glass/ChatHeader';
import { ChatMessage } from '@/components/glass/ChatMessage';
import { ChatInput } from '@/components/glass/ChatInput';
import { WelcomeScreen } from '@/components/glass/WelcomeScreen';
import { NetworkInspector } from '@/components/glass/NetworkInspector';
import { AIProviderModal } from '@/components/glass/AIProviderModal';
import { MobileMenuDrawer } from '@/components/glass/MobileMenuDrawer';
import { FAQ } from '@/components/glass/FAQ';
import { Footer } from '@/components/glass/Footer';
import { ChatSidebar } from '@/components/glass/ChatSidebar';
import {
  ChatSession,
  createNewSession,
  generateChatTitle,
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadActiveSessionId,
  saveActiveSessionId
} from '@/lib/glass/chatSessions';

// Store leakage warnings per message
type MessageLeakageMap = Record<string, LeakageWarning[]>;

const Index = () => {
  // Multi-chat session management
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const sessions = loadSessionsFromStorage();
    if (sessions.length === 0) {
      const newSession = createNewSession();
      return [newSession];
    }
    return sessions;
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const savedId = loadActiveSessionId();
    if (savedId) return savedId;
    return chatSessions[0]?.id || '';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageLeakage, setMessageLeakage] = useState<MessageLeakageMap>({});
  const [maskingRules, setMaskingRules] = useState<MaskingRules>(DEFAULT_MASKING_RULES);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const faqSectionRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [isFaqVisible, setIsFaqVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Session-level storage for masked items (for unmasking AI responses)
  const [sessionMaskedItems, setSessionMaskedItems] = useState<MaskedItem[]>([]);

  // AI Provider state (persisted in sessionStorage - cleared on tab close)
  const [connectedProviders, setConnectedProviders] = useState<ConnectedProvider[]>(() => {
    const saved = sessionStorage.getItem('glasslm_connected_providers');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(() => {
    return sessionStorage.getItem('glasslm_selected_provider_id');
  });
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatInputExpanded, setIsChatInputExpanded] = useState(false);

  // Get active session
  const activeSession = chatSessions.find(s => s.id === activeSessionId) || chatSessions[0];
  const messages = activeSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Monitor FAQ section visibility
  useEffect(() => {
    if (!faqSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFaqVisible(entry.isIntersecting && entry.intersectionRatio > 0.3);
      },
      { threshold: [0, 0.3, 0.5, 1] }
    );

    observer.observe(faqSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Monitor Footer visibility
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0, 0.2, 0.5, 1] }
    );

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);


  // Helper function to update messages in active session
  const updateSessionMessages = (updater: (messages: ChatMessageType[]) => ChatMessageType[]) => {
    setChatSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        const updatedMessages = updater(session.messages);
        const updatedSession = {
          ...session,
          messages: updatedMessages,
          title: updatedMessages.length > 0 ? generateChatTitle(updatedMessages) : 'New Chat',
          updatedAt: new Date(),
        };
        return updatedSession;
      }
      return session;
    }));
  };

  // Persist chat sessions to sessionStorage
  useEffect(() => {
    saveSessionsToStorage(chatSessions);
  }, [chatSessions]);

  // Persist active session ID
  useEffect(() => {
    if (activeSessionId) {
      saveActiveSessionId(activeSessionId);
    }
  }, [activeSessionId]);

  // Persist connected providers to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('glasslm_connected_providers', JSON.stringify(connectedProviders));
  }, [connectedProviders]);

  // Persist selected provider ID to sessionStorage
  useEffect(() => {
    if (selectedProviderId) {
      sessionStorage.setItem('glasslm_selected_provider_id', selectedProviderId);
    } else {
      sessionStorage.removeItem('glasslm_selected_provider_id');
    }
  }, [selectedProviderId]);

  // Session management handlers
  const handleNewChat = () => {
    const newSession = createNewSession(selectedProviderId);
    setChatSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    setMessageLeakage({});
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setMessageLeakage({});
  };

  const handleDeleteSession = (sessionId: string) => {
    if (chatSessions.length === 1) {
      // Don't delete the last session, just clear it
      const newSession = createNewSession(selectedProviderId);
      setChatSessions([newSession]);
      setActiveSessionId(newSession.id);
    } else {
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        const remaining = chatSessions.filter(s => s.id !== sessionId);
        setActiveSessionId(remaining[0].id);
      }
    }
    setMessageLeakage({});
  };

  const handleConnectProvider = (providerId: string, apiKey: string) => {
    setConnectedProviders(prev => [
      ...prev.filter(p => p.providerId !== providerId),
      { providerId, apiKey, connectedAt: new Date() }
    ]);
    // Auto-select if it's the first provider
    if (connectedProviders.length === 0) {
      setSelectedProviderId(providerId);
    }
  };

  const handleDisconnectProvider = (providerId: string) => {
    setConnectedProviders(prev => prev.filter(p => p.providerId !== providerId));
    if (selectedProviderId === providerId) {
      setSelectedProviderId(connectedProviders.length > 1
        ? connectedProviders.find(p => p.providerId !== providerId)?.providerId ?? null
        : null
      );
    }
  };

  const handleSend = async (content: string, providerId: string) => {
    // Step 1: Auto-mask the user's message
    const { maskedText, maskedItems } = autoMask(content);

    // Create user message
    const userMessage: ChatMessageType = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: content, // Show original to user
      maskedContent: maskedText,
      maskedItems,
      timestamp: new Date(),
    };

    updateSessionMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add loading message
    const loadingMessage: ChatMessageType = {
      id: `msg_${Date.now()}_loading`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      providerId,
      isLoading: true,
    };
    updateSessionMessages(prev => [...prev, loadingMessage]);

    const provider = AI_PROVIDERS.find(p => p.id === providerId);
    const connectedProvider = connectedProviders.find(p => p.providerId === providerId);

    if (!connectedProvider) {
      updateSessionMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== loadingMessage.id);
        return [...withoutLoading, {
          id: `msg_${Date.now()}_error`,
          role: 'assistant' as const,
          content: 'Error: No API key connected for this provider.',
          timestamp: new Date(),
          providerId,
        }];
      });
      setIsLoading(false);
      return;
    }

    // Build conversation history with masked content
    const conversationHistory = messages
      .filter(m => !m.isLoading)
      .map(m => ({
        role: m.role,
        content: m.role === 'user' ? (m.maskedContent || m.content) : m.content
      }));

    // Add current masked message
    conversationHistory.push({ role: 'user', content: maskedText });

    // Determine API endpoint and headers based on provider
    let apiUrl = '';
    let headers: Record<string, string> = {};
    let body: any = {};

    switch (providerId) {
      case 'openai':
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${connectedProvider.apiKey}`,
          'Content-Type': 'application/json',
        };
        body = {
          model: 'gpt-4o-mini',
          messages: conversationHistory,
        };
        break;
      case 'anthropic':
        apiUrl = 'https://api.anthropic.com/v1/messages';
        headers = {
          'x-api-key': connectedProvider.apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        };
        body = {
          model: 'claude-3-haiku-20240307',
          max_tokens: 4096,
          messages: conversationHistory.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          })),
        };
        break;
      case 'google':
        // Default to the stable Gemini model name (no preview suffix)
        const googleModel = (connectedProvider as any).preferredModel || 'gemini-2.5-flash';
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${googleModel}:generateContent?key=${connectedProvider.apiKey}`;
        headers = {
          'Content-Type': 'application/json',
        };
        body = {
          contents: conversationHistory.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
        };
        break;
      case 'grok':
        apiUrl = 'https://api.x.ai/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${connectedProvider.apiKey}`,
          'Content-Type': 'application/json',
        };
        body = {
          model: 'grok-beta',
          messages: conversationHistory,
        };
        break;
      case 'deepseek':
        apiUrl = 'https://api.deepseek.com/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${connectedProvider.apiKey}`,
          'Content-Type': 'application/json',
        };
        body = {
          model: 'deepseek-chat',
          messages: conversationHistory,
        };
        break;
      case 'mistral':
        apiUrl = 'https://api.mistral.ai/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${connectedProvider.apiKey}`,
          'Content-Type': 'application/json',
        };
        body = {
          model: 'mistral-small-latest',
          messages: conversationHistory,
        };
        break;
      default:
        throw new Error('Unknown provider');
    }

    // Log the network request for transparency
    const request: NetworkRequest = {
      id: `req_${Date.now()}`,
      timestamp: new Date(),
      method: 'POST',
      url: apiUrl.split('?')[0], // Don't show API key in URL
      payloadSize: new Blob([JSON.stringify(body)]).size,
      payloadPreview: JSON.stringify({
        message: maskedText.length > 300 ? maskedText.slice(0, 300) + '...' : maskedText,
        note: maskedItems.length > 0 ? `${maskedItems.length} items masked` : 'No sensitive data detected'
      }, null, 2),
      status: 0,
    };
    setNetworkRequests(prev => [...prev, request]);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      // Update request status
      setNetworkRequests(prev => prev.map(r =>
        r.id === request.id ? { ...r, status: response.status } : r
      ));

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // Extract response based on provider
      let aiResponseText = '';
      switch (providerId) {
        case 'openai':
        case 'grok':
        case 'deepseek':
        case 'mistral':
          aiResponseText = data.choices?.[0]?.message?.content || 'No response received';
          break;
        case 'anthropic':
          aiResponseText = data.content?.[0]?.text || 'No response received';
          break;
        case 'google':
          aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';
          break;
      }

      // Step 5: Unmask the response locally
      const unmaskedResponse = unmask(aiResponseText, maskedItems);

      // Step 6: Check for potential leakage
      const leakageWarnings = detectLeakage(aiResponseText, maskedItems);
      const responseId = `msg_${Date.now()}_response`;

      if (leakageWarnings.length > 0) {
        setMessageLeakage(prev => ({
          ...prev,
          [responseId]: leakageWarnings
        }));
      }

      // Remove loading message and add real response with masked items for InlineReveal
      updateSessionMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== loadingMessage.id);
        return [...withoutLoading, {
          id: responseId,
          role: 'assistant' as const,
          content: unmaskedResponse,
          maskedItems: maskedItems, // Pass for InlineReveal to use
          timestamp: new Date(),
          providerId,
        }];
      });
    } catch (error) {
      console.error('AI API Error:', error);

      // Parse error for user-friendly message
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response from AI';
      let friendlyMessage = '';

      const dataNotSent = '\n\n✅ **Your data was not sent.** No information left your browser.';

      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
        friendlyMessage = `⏳ Rate limit reached for ${provider?.name || 'this provider'}. Please wait a moment and try again, or switch to a different AI provider.${dataNotSent}`;
      } else if (errorMessage.includes('401') || errorMessage.includes('UNAUTHENTICATED') || errorMessage.includes('invalid')) {
        friendlyMessage = `🔑 Invalid API key for ${provider?.name || 'this provider'}. Please check your API key and reconnect.${dataNotSent}`;
      } else if (errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED')) {
        friendlyMessage = `🚫 Access denied. Your API key may not have permission for this model, or the API may be restricted in your region.${dataNotSent}`;
      } else if (errorMessage.includes('404') || errorMessage.includes('NOT_FOUND')) {
        friendlyMessage = `❓ Model not found. The AI model may have been deprecated or renamed.${dataNotSent}`;
      } else if (errorMessage.includes('500') || errorMessage.includes('503') || errorMessage.includes('INTERNAL')) {
        friendlyMessage = `🔧 ${provider?.name || 'The AI provider'} is experiencing issues. Please try again later.${dataNotSent}`;
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
        friendlyMessage = `📡 Network error. Please check your internet connection and try again.${dataNotSent}`;
      } else {
        friendlyMessage = `Something went wrong with ${provider?.name || 'the AI'}. Please try again or switch providers.${dataNotSent}`;
      }

      updateSessionMessages(prev => {
        const withoutLoading = prev.filter(m => m.id !== loadingMessage.id);
        return [...withoutLoading, {
          id: `msg_${Date.now()}_error`,
          role: 'assistant' as const,
          content: friendlyMessage,
          timestamp: new Date(),
          providerId,
        }];
      });
    }

    setIsLoading(false);
  };

  const handleFileUpload = async (file: File) => {
    // Read file content
    const text = await file.text();

    // Create a message showing file was uploaded
    const { maskedText, maskedItems } = autoMask(text);

    const fileMessage = `I've uploaded a document: ${file.name}\n\n---\n\n${text}`;

    if (selectedProviderId) {
      handleSend(fileMessage, selectedProviderId);
    }
  };

  // Handle going home (create new chat session)
  const handleGoHome = () => {
    const newSession = createNewSession();
    setChatSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false);
  };

  const hasMessages = messages.length > 0;
  const hasProviders = connectedProviders.length > 0;

  return (
    <div className="min-h-screen h-screen overflow-hidden bg-background flex">
      {/* Chat Sidebar */}
      <ChatSidebar
        sessions={chatSessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 h-screen overflow-hidden">
        <ChatHeader
          connectedProviders={connectedProviders}
          onConnectAIClick={() => setIsAIModalOpen(true)}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onGoHome={handleGoHome}
        />

        <main ref={mainRef} className="flex-1 w-full px-3 md:px-6 pt-16 md:pt-20 pb-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full">
            {!hasMessages ? (
              <WelcomeScreen
                hasProviders={hasProviders}
              />
            ) : (
              <div className="max-w-3xl mx-auto py-8 space-y-6">
                {/* New Chat button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      const newSession = createNewSession(selectedProviderId);
                      setChatSessions(prev => [...prev, newSession]);
                      setActiveSessionId(newSession.id);
                      setMessageLeakage({});
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    New Chat
                  </button>
                </div>

                {messages.map(message => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    leakageWarnings={messageLeakage[message.id] || []}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* FAQ Section - Only on Welcome Screen */}
            {!hasMessages && (
              <div ref={faqSectionRef}>
                <FAQ />
              </div>
            )}

            {/* Footer */}
            <div ref={footerRef}>
              <Footer />
            </div>
          </div>
        </main>

        {/* Chat Input - Visible by default, minimizes when scrolled to FAQ or Footer */}
        {!hasMessages && (isFaqVisible || isFooterVisible) ? (
          // Floating icon when scrolled to FAQ
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group glass-card p-4 rounded-full hover:scale-110 transition-all duration-300 shadow-lg border-2 border-primary/30 hover:border-primary/60"
              aria-label="Back to top"
            >
              <div className="relative">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
            </button>
          </div>
        ) : (
          // Normal chat input (welcome screen or chat view)
          <div className="fixed bottom-10 md:bottom-12 left-0 right-0 px-3 md:px-6 pb-3 md:pb-4 transition-all duration-300">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSend={handleSend}
                onFileUpload={handleFileUpload}
                connectedProviders={connectedProviders}
                selectedProviderId={selectedProviderId}
                onSelectProvider={setSelectedProviderId}
                onConnectAIClick={() => setIsAIModalOpen(true)}
                isLoading={isLoading}
                maskingRules={maskingRules}
                onMaskingRulesChange={setMaskingRules}
              />
            </div>
          </div>
        )}
      </div>

      <AIProviderModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        connectedProviders={connectedProviders}
        onConnect={handleConnectProvider}
        onDisconnect={handleDisconnectProvider}
      />

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onConnectAI={() => setIsAIModalOpen(true)}
      />
    </div>
  );
};

export default Index;

