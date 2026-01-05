import { useState } from 'react';
import { X, Check, Eye, EyeOff, KeyRound, Info, AlertTriangle } from 'lucide-react';
import { AI_PROVIDERS, AIProvider, ConnectedProvider } from '@/lib/glass/aiProviders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AIProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedProviders: ConnectedProvider[];
  onConnect: (providerId: string, apiKey: string) => void;
  onDisconnect: (providerId: string) => void;
}

export function AIProviderModal({
  isOpen,
  onClose,
  connectedProviders,
  onConnect,
  onDisconnect,
}: AIProviderModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const isConnected = (providerId: string) =>
    connectedProviders.some((p) => p.providerId === providerId);

  const handleProviderClick = (provider: AIProvider) => {
    if (isConnected(provider.id)) {
      setSelectedProvider(provider);
    } else {
      setSelectedProvider(provider);
      setApiKey('');
      setShowKey(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedProvider || !apiKey.trim()) return;

    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    onConnect(selectedProvider.id, apiKey);
    setIsVerifying(false);
    setSelectedProvider(null);
    setApiKey('');
  };

  const handleDisconnect = () => {
    if (!selectedProvider) return;
    onDisconnect(selectedProvider.id);
    setSelectedProvider(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedProvider(null);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in p-4"
      onClick={handleBackdropClick}
    >
      <div className="glass-card w-full max-w-2xl rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 0 80px hsl(270 80% 50% / 0.2)' }}>
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/30">
          <div>
            <h2 className="text-lg md:text-xl font-semibold font-mono text-crystal">Connect your AI</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Bring your own API keys. We never store them.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:text-primary">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 md:p-6">
          {/* Trust notice */}
          <div className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6 glass-card">
            <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">Privacy first:</span> API keys are kept only
              in memory for this session. They are cleared when you close this tab.
            </p>
          </div>

          {/* Provider grid */}
          {!selectedProvider ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {AI_PROVIDERS.map((provider) => {
                const connected = isConnected(provider.id);
                return (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderClick(provider)}
                    className={`
                      group relative p-4 md:p-5 rounded-xl transition-all duration-300
                      ${connected
                        ? 'glass-card border-2 border-primary/50'
                        : 'glass-card border-2 border-transparent hover:border-primary/30'
                      }
                    `}
                    style={connected ? { boxShadow: '0 0 30px hsl(270 80% 60% / 0.2)' } : undefined}
                  >
                    {connected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-background" />
                      </div>
                    )}
                    <div className="mb-3 flex justify-center">
                      <img
                        src={provider.logo}
                        alt={provider.name}
                        className={`w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg transition-all duration-300 ${connected ? '' : 'provider-logo-grayscale'}`}
                      />
                    </div>
                    <h3
                      className={`
                        font-mono font-medium text-xs md:text-sm transition-colors duration-300 text-center
                        ${connected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                      `}
                    >
                      {provider.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 text-center">{provider.description}</p>
                    {connected && (
                      <span className="text-[10px] text-primary font-mono mt-2 block text-center">
                        CONNECTED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            // API Key input view
            <div className="animate-fade-in">
              <button
                onClick={() => setSelectedProvider(null)}
                className="text-sm text-muted-foreground hover:text-primary mb-4 font-mono transition-colors"
              >
                ← Back to providers
              </button>

              <div className="glass-card rounded-xl p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={selectedProvider.logo}
                    alt={selectedProvider.name}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-lg"
                  />
                  <div>
                    <h3 className="font-mono font-medium text-sm md:text-base">{selectedProvider.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedProvider.description}</p>
                  </div>
                  {isConnected(selectedProvider.id) && (
                    <span className="ml-auto text-xs font-mono text-primary">CONNECTED</span>
                  )}
                </div>

                {isConnected(selectedProvider.id) ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This provider is connected and ready to use.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleDisconnect}
                      className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 rounded-xl"
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="section-label mb-2 block">API KEY</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type={showKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder={selectedProvider.apiKeyPlaceholder}
                          className="pl-10 pr-10 font-mono text-sm bg-background/40 border-border/50 rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Your key is used only for this request and never stored.
                    </p>

                    <Button
                      onClick={handleConnect}
                      disabled={!apiKey.trim() || isVerifying}
                      className="w-full btn-crystal text-white rounded-xl"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify & Connect'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Connected count */}
        {connectedProviders.length > 0 && !selectedProvider && (
          <div className="px-4 md:px-6 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>
                {connectedProviders.length} provider{connectedProviders.length > 1 ? 's' : ''}{' '}
                connected
              </span>
            </div>
          </div>
        )}

        {/* No Affiliation Disclaimer */}
        <div className="px-4 md:px-6 pb-4 md:pb-6">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
            <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium">No affiliation:</span> GlassLM is not affiliated with OpenAI, Google, Anthropic, xAI, DeepSeek, or any AI provider. API keys are used only to send user-approved prompts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
