import { useState } from 'react';
import { Lock, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { MaskedItem } from '@/lib/glass/types';
import { getMaskedItemsByType } from '@/lib/glass/masker';
import { Button } from '@/components/ui/button';

interface MaskPreviewProps {
  maskedItems: MaskedItem[];
  className?: string;
}

const TYPE_LABELS: Record<string, string> = {
  name: 'Names',
  email: 'Emails',
  phone: 'Phone Numbers',
  ssn: 'SSN',
  credit_card: 'Credit Cards',
  id: 'IDs',
  address: 'Addresses',
};

export function MaskPreview({ maskedItems, className = '' }: MaskPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOriginals, setShowOriginals] = useState(false);
  
  if (maskedItems.length === 0) return null;
  
  const groupedItems = getMaskedItemsByType(maskedItems);
  
  return (
    <div className={`glass-surface rounded-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-foreground">
            {maskedItems.length} sensitive item{maskedItems.length !== 1 ? 's' : ''} masked
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">View details</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="border-t border-border px-4 py-3 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              Original → Masked
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOriginals(!showOriginals)}
              className="text-xs gap-1.5 h-7"
            >
              {showOriginals ? (
                <>
                  <EyeOff className="w-3 h-3" />
                  Hide Originals
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" />
                  Show Originals
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-3">
            {Object.entries(groupedItems).map(([type, items]) => (
              <div key={type} className="space-y-1.5">
                <span className="text-xs text-muted-foreground font-medium">
                  {TYPE_LABELS[type] || type}
                </span>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 text-sm font-mono bg-muted/30 rounded px-3 py-1.5"
                    >
                      <span className={showOriginals ? 'text-foreground' : 'text-muted-foreground blur-sm select-none'}>
                        {item.original}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-primary">{item.placeholder}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
            Only masked placeholders are sent to the AI. Originals stay in your browser.
          </p>
        </div>
      )}
    </div>
  );
}
