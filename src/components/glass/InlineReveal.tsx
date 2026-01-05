import { useState, Fragment } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';
import { MaskedItem } from '@/lib/glass/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InlineRevealProps {
  text: string;
  maskedItems: MaskedItem[];
  className?: string;
}

const TYPE_REASONS: Record<string, string> = {
  email: 'Detected as email address. Masked before sending to AI.',
  phone: 'Detected as phone number. Masked before sending to AI.',
  name: 'Detected as personal name. Masked before sending to AI.',
  ssn: 'Detected as Social Security Number. Masked before sending to AI.',
  credit_card: 'Detected as credit card number. Masked before sending to AI.',
  id: 'Detected as ID number. Masked before sending to AI.',
  address: 'Detected as address. Masked before sending to AI.',
};

export function InlineReveal({
  text,
  maskedItems,
  className = '',
}: InlineRevealProps) {
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [revealAll, setRevealAll] = useState(false);

  if (maskedItems.length === 0) {
    return <div className={`whitespace-pre-wrap ${className}`}>{text}</div>;
  }

  const toggleItem = (itemId: string) => {
    setRevealedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (revealAll) {
      setRevealedItems(new Set());
    } else {
      setRevealedItems(new Set(maskedItems.map((i) => i.id)));
    }
    setRevealAll(!revealAll);
  };

  // Parse text and replace sensitive items with interactive elements
  const renderContent = () => {
    const parts: (string | { item: MaskedItem; index: number })[] = [];
    let currentText = text;
    let keyIndex = 0;

    // Sort items by their position in text (find each original value)
    const sortedItems = [...maskedItems].sort((a, b) => {
      const posA = text.indexOf(a.original);
      const posB = text.indexOf(b.original);
      return posA - posB;
    });

    for (const item of sortedItems) {
      const idx = currentText.indexOf(item.original);
      if (idx === -1) continue;

      // Add text before this item
      if (idx > 0) {
        parts.push(currentText.slice(0, idx));
      }

      // Add the item marker
      parts.push({ item, index: keyIndex++ });

      // Continue with remaining text
      currentText = currentText.slice(idx + item.original.length);
    }

    // Add remaining text
    if (currentText) {
      parts.push(currentText);
    }

    return parts.map((part, i) => {
      if (typeof part === 'string') {
        return <Fragment key={i}>{part}</Fragment>;
      }

      const { item } = part;
      const isRevealed = revealedItems.has(item.id) || revealAll;

      return (
        <TooltipProvider key={`item-${item.id}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => toggleItem(item.id)}
                className={`
                  inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-sm font-mono
                  transition-all duration-200 cursor-pointer
                  ${isRevealed
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-muted text-muted-foreground border border-border hover:border-primary/50'}
                `}
              >
                {isRevealed ? item.original : `[${item.type}]`}
                <span className="opacity-60">
                  {isRevealed ? (
                    <EyeOff className="w-3 h-3" />
                  ) : (
                    <Eye className="w-3 h-3" />
                  )}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium mb-1">Why this was masked</p>
                  <p className="text-muted-foreground">
                    {TYPE_REASONS[item.type] || 'Detected as sensitive data. Masked before sending to AI.'}
                  </p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    });
  };

  return (
    <div className={className}>
      <div className="whitespace-pre-wrap leading-relaxed">{renderContent()}</div>
      
      {maskedItems.length > 1 && (
        <div className="mt-3 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAll}
            className="text-xs gap-1.5 h-7"
          >
            {revealAll ? (
              <>
                <EyeOff className="w-3 h-3" />
                Hide all
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                Reveal all ({maskedItems.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
