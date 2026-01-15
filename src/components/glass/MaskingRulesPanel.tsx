import { Settings2, Zap, User, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  MaskingRules,
  MaskingRuleType,
  RULE_LABELS,
  RULE_DESCRIPTIONS,
  RULE_CATEGORIES,
  MASKING_PRESETS,
} from '@/lib/glass/maskingRules';
import { useState } from 'react';

interface MaskingRulesPanelProps {
  rules: MaskingRules;
  onRulesChange: (rules: MaskingRules) => void;
}

export function MaskingRulesPanel({ rules, onRulesChange }: MaskingRulesPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');

  const handleToggle = (type: MaskingRuleType) => {
    onRulesChange({
      ...rules,
      [type]: !rules[type],
    });
    setSelectedPreset('custom'); // Switch to custom when manually toggling
  };

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = MASKING_PRESETS[presetKey as keyof typeof MASKING_PRESETS];
    if (preset) {
      onRulesChange(preset.rules);
    }
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
      <PopoverContent align="end" className="w-80 p-0 max-h-[32rem] overflow-y-auto">
        <div className="sticky top-0 bg-background/95 backdrop-blur p-4 border-b border-border/50 z-10">
          <h4 className="font-medium text-sm mb-1">Masking Rules</h4>
          <p className="text-xs text-muted-foreground">
            Control which types of data are automatically masked
          </p>
        </div>

        {/* Presets */}
        <div className="p-4 border-b border-border/30">
          <h5 className="text-xs font-medium mb-2 text-muted-foreground">Quick Presets</h5>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(MASKING_PRESETS).slice(0, 3).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handlePresetChange(key)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors text-xs ${selectedPreset === key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground'
                  }`}
              >
                {key === 'developer' && <Zap className="w-4 h-4" />}
                {key === 'personal' && <User className="w-4 h-4" />}
                {key === 'enterprise' && <Building2 className="w-4 h-4" />}
                <span className="font-medium">{preset.name.replace(' Mode', '')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categorized Rules */}
        <div className="p-4 space-y-4">
          {Object.entries(RULE_CATEGORIES).map(([category, types]) => (
            <div key={category}>
              <h5 className="text-xs font-semibold mb-2 text-foreground/90">{category}</h5>
              <div className="space-y-2.5">
                {types.map((type) => (
                  <div
                    key={type}
                    className="flex items-start justify-between gap-3 py-1"
                  >
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`rule-${type}`}
                        className="text-sm font-medium cursor-pointer block"
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
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
