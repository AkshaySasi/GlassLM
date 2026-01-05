import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { MaskedItem } from '@/lib/glass/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MaskConfidenceIndicatorProps {
  maskedItems: MaskedItem[];
  originalText: string;
  className?: string;
}

type ConfidenceLevel = 'high' | 'medium' | 'low';

function calculateConfidence(
  maskedItems: MaskedItem[],
  originalText: string
): { level: ConfidenceLevel; details: string[] } {
  const details: string[] = [];
  
  if (maskedItems.length === 0) {
    // Check if text might contain undetected PII
    const hasAtSign = originalText.includes('@');
    const hasNumbers = /\d{3,}/.test(originalText);
    const hasCapitalizedWords = /[A-Z][a-z]+ [A-Z][a-z]+/.test(originalText);
    
    if (hasAtSign || hasNumbers || hasCapitalizedWords) {
      details.push('Text may contain undetected sensitive data');
      return { level: 'medium', details };
    }
    return { level: 'high', details: ['No sensitive data detected'] };
  }

  // High confidence types
  const highConfidenceTypes = ['email', 'ssn', 'credit_card', 'phone'];
  const mediumConfidenceTypes = ['name'];
  
  const highConfCount = maskedItems.filter(i => 
    highConfidenceTypes.includes(i.type)
  ).length;
  const mediumConfCount = maskedItems.filter(i => 
    mediumConfidenceTypes.includes(i.type)
  ).length;

  if (highConfCount > 0) {
    details.push(`${highConfCount} item(s) detected with high certainty`);
  }
  if (mediumConfCount > 0) {
    details.push(`${mediumConfCount} name(s) detected (pattern-based)`);
  }

  // Check for potential missed items
  const remainingText = originalText;
  const hasUnmaskedNumbers = /\b\d{5,}\b/.test(remainingText);
  
  if (hasUnmaskedNumbers) {
    details.push('Some number sequences may not be masked');
  }

  if (mediumConfCount > highConfCount && mediumConfCount > 0) {
    return { level: 'medium', details };
  }

  return { 
    level: highConfCount > 0 ? 'high' : 'medium', 
    details 
  };
}

export function MaskConfidenceIndicator({
  maskedItems,
  originalText,
  className = '',
}: MaskConfidenceIndicatorProps) {
  const { level, details } = calculateConfidence(maskedItems, originalText);

  const config = {
    high: {
      icon: CheckCircle,
      text: 'High confidence masking',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
    },
    medium: {
      icon: Info,
      text: 'Moderate confidence',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
    },
    low: {
      icon: AlertTriangle,
      text: 'Some data may not be masked',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
    },
  };

  const { icon: Icon, text, color, bgColor, borderColor } = config[level];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono
              ${bgColor} ${borderColor} border cursor-help
              ${className}
            `}
          >
            <Icon className={`w-3 h-3 ${color}`} />
            <span className={color}>{text}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium text-xs">Masking Analysis</p>
            {details.map((detail, i) => (
              <p key={i} className="text-xs text-muted-foreground">
                • {detail}
              </p>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
