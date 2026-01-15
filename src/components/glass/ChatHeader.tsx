import { Plus, Cpu, Coffee, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConnectedProvider } from '@/lib/glass/aiProviders';
import { Button } from '@/components/ui/button';
import glasslmLogo from '@/assets/glasslm-logo.webp';

interface ChatHeaderProps {
  connectedProviders: ConnectedProvider[];
  onConnectAIClick: () => void;
  onMenuClick?: () => void;
  onGoHome?: () => void;
}

export function ChatHeader({ connectedProviders, onConnectAIClick, onMenuClick, onGoHome }: ChatHeaderProps) {
  const hasConnections = connectedProviders.length > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-border/30">
      <div className="container mx-auto px-3 md:px-6 py-2.5 md:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity flex-shrink-0 cursor-pointer bg-transparent border-0 p-0"
            >
              <img
                src={glasslmLogo}
                alt="GlassLM"
                className="w-6 h-6 md:w-8 md:h-8 object-contain"
              />
              <h1 className="font-mono text-base md:text-lg font-semibold tracking-tight text-crystal">
                GLASS LM
              </h1>
            </button>
            <span className="hidden lg:block text-xs text-muted-foreground font-mono border-l border-border/50 pl-4 truncate">
              A Glass-Box Layer For Your AI
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* Product Hunt Badge - Subtler styling */}
            <a
              href="https://www.producthunt.com/products/glasslm?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-glasslm"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center opacity-60 hover:opacity-100 scale-90 hover:scale-100 transition-all duration-300"
            >
              <img
                alt="GlassLM - Product Hunt"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1059756&theme=light&t=1768032088791"
                className="h-5 md:h-6"
              />
            </a>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-1 md:gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary px-2 md:px-3"
            >
              <Link to="/support">
                <Coffee className="w-3 h-3" />
                <span className="hidden sm:inline">Support</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onConnectAIClick}
              className={`
                gap-1 md:gap-2 font-mono text-xs transition-all duration-300 rounded-lg md:rounded-xl px-2 md:px-3
                ${hasConnections
                  ? 'text-primary hover:text-primary border border-primary/30 hover:bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/50'
                }
              `}
            >
              {hasConnections ? (
                <>
                  <Cpu className="w-3 h-3" />
                  <span className="hidden sm:inline">{connectedProviders.length} AI Connected</span>
                  <span className="sm:hidden">{connectedProviders.length}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span className="hidden sm:inline">Connect AI</span>
                  <span className="sm:hidden">AI</span>
                </>
              )}
            </Button>

            {/* Mobile Menu Trigger - Only visible on mobile */}
            {onMenuClick && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="md:hidden p-2 hover:bg-muted/50 rounded-lg"
                aria-label="Open menu"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

