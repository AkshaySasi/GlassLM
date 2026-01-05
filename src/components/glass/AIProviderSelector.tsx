import { Check } from 'lucide-react';
import { AI_PROVIDERS } from '@/lib/glass/aiProviders';
import { ConnectedProvider } from '@/lib/glass/aiProviders';

interface AIProviderSelectorProps {
  connectedProviders: ConnectedProvider[];
  selectedProviderId: string | null;
  onSelect: (providerId: string) => void;
}

export function AIProviderSelector({
  connectedProviders,
  selectedProviderId,
  onSelect,
}: AIProviderSelectorProps) {
  if (connectedProviders.length === 0) {
    return null;
  }

  const providers = connectedProviders.map((cp) => ({
    ...cp,
    provider: AI_PROVIDERS.find((p) => p.id === cp.providerId)!,
  }));

  return (
    <div className="glass-surface rounded-lg p-4 border border-border">
      <span className="section-label mb-3 block">CHOOSE AI FOR THIS REQUEST</span>
      <div className="flex flex-wrap gap-2">
        {providers.map(({ providerId, provider }) => {
          const isSelected = selectedProviderId === providerId;
          return (
            <button
              key={providerId}
              onClick={() => onSelect(providerId)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200
                ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <span className={isSelected ? 'grayscale-0' : 'grayscale'}>{provider.logo}</span>
              <span>{provider.name}</span>
              {isSelected && <Check className="w-3 h-3 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
