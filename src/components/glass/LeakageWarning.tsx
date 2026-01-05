import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { LeakageWarning as LeakageWarningType } from '@/lib/glass/leakageDetector';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LeakageWarningProps {
  warnings: LeakageWarningType[];
  className?: string;
}

export function LeakageWarning({ warnings, className = '' }: LeakageWarningProps) {
  if (warnings.length === 0) return null;

  const highSeverity = warnings.filter(w => w.severity === 'high');
  const mediumSeverity = warnings.filter(w => w.severity === 'medium');
  const lowSeverity = warnings.filter(w => w.severity === 'low');

  const primarySeverity = highSeverity.length > 0
    ? 'high'
    : mediumSeverity.length > 0
      ? 'medium'
      : 'low';

  const config = {
    high: {
      icon: ShieldAlert,
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      textColor: 'text-destructive',
      title: 'Potential data leak detected',
    },
    medium: {
      icon: AlertTriangle,
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      textColor: 'text-warning',
      title: 'AI response may indirectly reveal masked information',
    },
    low: {
      icon: Info,
      bgColor: 'bg-muted',
      borderColor: 'border-border',
      textColor: 'text-muted-foreground',
      title: 'Minor privacy concern detected',
    },
  };

  const { icon: Icon, bgColor, borderColor, textColor, title } = config[primarySeverity];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs
              ${bgColor} ${borderColor} border cursor-help
              ${className}
            `}
          >
            <Icon className={`w-4 h-4 ${textColor}`} />
            <span className={textColor}>{title}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm p-3">
          <div className="space-y-2">
            <p className="font-medium text-xs">Leakage Analysis</p>
            {warnings.map((warning, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span
                  className={`
                    w-1.5 h-1.5 rounded-full mt-1.5 shrink-0
                    ${warning.severity === 'high'
                      ? 'bg-destructive'
                      : warning.severity === 'medium'
                        ? 'bg-warning'
                        : 'bg-muted-foreground'}
                  `}
                />
                <div>
                  <p className="text-foreground">{warning.description}</p>
                  {warning.matchedText && (
                    <p className="text-muted-foreground mt-0.5">
                      Matched: "{warning.matchedText}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
