import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, ChevronDown, Cpu, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConnectedProvider, AI_PROVIDERS } from '@/lib/glass/aiProviders';
import { MaskingRules, DEFAULT_MASKING_RULES } from '@/lib/glass/maskingRules';
import { MaskingRulesPanel } from './MaskingRulesPanel';
import { MaskConfidenceIndicator } from './MaskConfidenceIndicator';
import { PrivacyTestPanel } from './PrivacyTestPanel';
import { autoMask } from '@/lib/glass/masker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatInputProps {
  onSend: (message: string, providerId: string) => void;
  onFileUpload: (file: File) => void;
  connectedProviders: ConnectedProvider[];
  selectedProviderId: string | null;
  onSelectProvider: (id: string) => void;
  onConnectAIClick: () => void;
  isLoading: boolean;
  maskingRules: MaskingRules;
  onMaskingRulesChange: (rules: MaskingRules) => void;
  offlineMode?: boolean;
  onOfflineModeChange?: (enabled: boolean) => void;
}

export function ChatInput({
  onSend,
  onFileUpload,
  connectedProviders,
  selectedProviderId,
  onSelectProvider,
  onConnectAIClick,
  isLoading,
  maskingRules,
  onMaskingRulesChange,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showPrivacyTest, setShowPrivacyTest] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedProvider = selectedProviderId
    ? AI_PROVIDERS.find(p => p.id === selectedProviderId)
    : null;

  const hasProviders = connectedProviders.length > 0;

  // Get masking preview for confidence indicator
  const { maskedItems } = input.trim() ? autoMask(input) : { maskedItems: [] };

  const handleSend = () => {
    if (!input.trim() || !selectedProviderId || isLoading) return;
    onSend(input.trim(), selectedProviderId);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <>
      <div className="glass-card rounded-xl md:rounded-2xl p-2 md:p-3">
        {/* Confidence indicator when there's input */}
        {input.trim() && (
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/30 gap-2">
            <MaskConfidenceIndicator
              maskedItems={maskedItems}
              originalText={input}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrivacyTest(true)}
              className="text-[10px] md:text-xs gap-1 md:gap-1.5 h-6 md:h-7 text-muted-foreground hover:text-primary px-2"
            >
              <FlaskConical className="w-3 h-3" />
              <span className="hidden sm:inline">Test Privacy</span>
            </Button>
          </div>
        )}

        <div className="flex items-end gap-1.5 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 text-muted-foreground hover:text-primary w-8 h-8 md:w-10 md:h-10"
            disabled={isLoading}
          >
            <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={hasProviders ? "Ask anything..." : "Connect AI to start..."}
            disabled={!hasProviders || isLoading}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-sm py-2 max-h-[200px]"
          />

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {hasProviders ? (
              <>
                <div className="hidden sm:block">
                  <MaskingRulesPanel
                    rules={maskingRules}
                    onRulesChange={onMaskingRulesChange}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 md:gap-1.5 text-[10px] md:text-xs font-mono text-muted-foreground hover:text-primary px-1.5 md:px-2"
                      disabled={isLoading}
                    >
                      <Cpu className="w-3 h-3" />
                      <span className="max-w-[50px] md:max-w-[80px] truncate">
                        {selectedProvider?.name || 'AI'}
                      </span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 glass-card border-border/50">
                    {connectedProviders.map(cp => {
                      const provider = AI_PROVIDERS.find(p => p.id === cp.providerId);
                      return provider ? (
                        <DropdownMenuItem
                          key={cp.providerId}
                          onClick={() => onSelectProvider(cp.providerId)}
                          className={`font-mono text-xs ${selectedProviderId === cp.providerId ? 'bg-primary/10 text-primary' : ''}`}
                        >
                          {provider.name}
                        </DropdownMenuItem>
                      ) : null;
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || !selectedProviderId || isLoading}
                  size="icon"
                  className="btn-crystal text-white rounded-lg md:rounded-xl w-8 h-8 md:w-10 md:h-10"
                >
                  <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={onConnectAIClick}
                size="sm"
                className="gap-1 md:gap-1.5 text-[10px] md:text-xs font-mono btn-crystal text-white rounded-lg md:rounded-xl px-2 md:px-3 h-8"
              >
                <Cpu className="w-3 h-3" />
                <span className="hidden sm:inline">Connect AI</span>
                <span className="sm:hidden">AI</span>
              </Button>
            )}
          </div>
        </div>

        {hasProviders && (
          <div className="hidden items-center justify-center gap-1.5 mt-2 pt-2 border-t border-border/30">
            <span className="text-[10px] text-muted-foreground/70 font-mono">
              Sensitive data is automatically masked before sending
            </span>
          </div>
        )}
      </div>

      <PrivacyTestPanel
        inputText={input}
        isOpen={showPrivacyTest}
        onClose={() => setShowPrivacyTest(false)}
      />
    </>
  );
}
