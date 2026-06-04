import { Plus, Cpu, Coffee, Settings, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
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

function useGithubStars(repo: string) {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    fetch(`https://api.github.com/repos/${repo}`)
      .then((r) => r.json())
      .then((d) => setStars(d.stargazers_count ?? null))
      .catch(() => {});
  }, [repo]);
  return stars;
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function ChatHeader({ connectedProviders, onConnectAIClick, onMenuClick, onGoHome }: ChatHeaderProps) {
  const hasConnections = connectedProviders.length > 0;
  const stars = useGithubStars('AkshaySasi/GlassLM');

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
            <span className="hidden lg:block text-xs text-muted-foreground font-mono border-l border-border/50 pl-4">
              A Glass-Box Layer For Your AI
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* GitHub Stars */}
            <a
              href="https://github.com/AkshaySasi/GlassLM"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/8 hover:bg-primary/15 hover:border-primary/40 transition-all duration-300 group"
            >
              <Star className="w-3 h-3 text-primary group-hover:fill-primary transition-all duration-300" />
              <span className="text-xs font-mono text-primary/80 group-hover:text-primary transition-colors">
                {stars !== null ? formatStars(stars) : '—'}
              </span>
              <span className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">stars</span>
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

