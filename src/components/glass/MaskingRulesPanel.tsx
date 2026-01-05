import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MaskingRules, MaskingRuleType, RULE_LABELS, RULE_DESCRIPTIONS } from '@/lib/glass/maskingRules';

interface MaskingRulesPanelProps {
  rules: MaskingRules;
  onRulesChange: (rules: MaskingRules) => void;
}

export function MaskingRulesPanel({ rules, onRulesChange }: MaskingRulesPanelProps) {
  const handleToggle = (type: MaskingRuleType) => {
    onRulesChange({
      ...rules,
      [type]: !rules[type],
    });
  };

  const enabledCount = Object.values(rules).filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Settings2 className="w-3 h-3" />
          <span className="hidden sm:inline">Rules</span>
          <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
            {enabledCount}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-1">Masking Rules</h4>
            <p className="text-xs text-muted-foreground">
              Control which types of data are automatically masked
            </p>
          </div>
          
          <div className="space-y-3">
            {(Object.keys(rules) as MaskingRuleType[]).map((type) => (
              <div
                key={type}
                className="flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <label
                    htmlFor={`rule-${type}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {RULE_LABELS[type]}
                  </label>
                  <p className="text-xs text-muted-foreground truncate">
                    {RULE_DESCRIPTIONS[type]}
                  </p>
                </div>
                <Switch
                  id={`rule-${type}`}
                  checked={rules[type]}
                  onCheckedChange={() => handleToggle(type)}
                  className="shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
