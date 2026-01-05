import { useState } from 'react';
import { Eye, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatAISawPanelProps {
  maskedPrompt: string;
  maskedItemCount: number;
  className?: string;
}

export function WhatAISawPanel({
  maskedPrompt,
  maskedItemCount,
  className = '',
}: WhatAISawPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(maskedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`glass-surface rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-foreground">
            What AI actually received
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {maskedItemCount > 0
              ? `${maskedItemCount} item${maskedItemCount !== 1 ? 's' : ''} masked`
              : 'No masking applied'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border px-4 py-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Exact payload sent
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 text-xs gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 font-mono text-xs text-foreground whitespace-pre-wrap break-words max-h-48 overflow-auto">
            {maskedPrompt}
          </div>

          <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
            This is the exact text sent to the AI. No modifications were made to
            the response. Original values were restored locally in your browser.
          </p>
        </div>
      )}
    </div>
  );
}
