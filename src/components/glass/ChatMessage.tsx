import { User, Bot, Lock } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/lib/glass/types';
import { AI_PROVIDERS } from '@/lib/glass/aiProviders';
import { MaskPreview } from './MaskPreview';
import { WhatAISawPanel } from './WhatAISawPanel';
import { InlineReveal } from './InlineReveal';
import { LeakageWarning } from './LeakageWarning';
import { LeakageWarning as LeakageWarningType } from '@/lib/glass/leakageDetector';

interface ChatMessageProps {
  message: ChatMessageType;
  leakageWarnings?: LeakageWarningType[];
}

export function ChatMessage({ message, leakageWarnings = [] }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const provider = message.providerId 
    ? AI_PROVIDERS.find(p => p.id === message.providerId)
    : null;
  
  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
        ${isUser ? 'bg-primary/20 border border-primary/30' : 'glass-card'}
      `}>
        {isUser ? (
          <User className="w-4 h-4 text-primary" />
        ) : message.isLoading ? (
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        ) : (
          <Bot className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[85%] ${isUser ? 'items-end' : ''}`}>
        {!isUser && provider && (
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-muted-foreground">
              via {provider.name}
            </span>
          </div>
        )}
        
        <div className={`
          rounded-2xl px-4 py-3
          ${isUser 
            ? 'bg-primary/10 border border-primary/20 rounded-tr-sm' 
            : 'glass-card rounded-tl-sm'
          }
        `}>
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Thinking</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          ) : isUser ? (
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          ) : message.maskedItems && message.maskedItems.length > 0 ? (
            <InlineReveal 
              text={message.content} 
              maskedItems={message.maskedItems}
              className="text-sm"
            />
          ) : (
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          )}
        </div>
        
        {/* Leakage warning for AI responses */}
        {!isUser && leakageWarnings.length > 0 && (
          <div className="mt-2">
            <LeakageWarning warnings={leakageWarnings} />
          </div>
        )}
        
        {/* User message: show mask preview and what AI saw */}
        {isUser && message.maskedItems && message.maskedItems.length > 0 && (
          <div className="mt-2 space-y-2">
            <MaskPreview maskedItems={message.maskedItems} />
            {message.maskedContent && (
              <WhatAISawPanel 
                maskedPrompt={message.maskedContent}
                maskedItemCount={message.maskedItems.length}
              />
            )}
          </div>
        )}
        
        <div className={`flex items-center gap-2 mt-1.5 ${isUser ? 'justify-end' : ''}`}>
          <span className="text-xs text-muted-foreground font-mono">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && message.maskedItems && message.maskedItems.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <Lock className="w-3 h-3" />
              Protected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
