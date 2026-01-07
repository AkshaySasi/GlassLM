import { Eye, Cpu, Lock, Shield, HelpCircle, GitCommit } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TrustStrip() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 glass-surface border-t border-border/30">
      <div className="container mx-auto px-3 md:px-4 py-2 md:py-2.5">
        <div className="flex items-center justify-between">
          {/* Trust indicators */}
          <div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-xs text-muted-foreground">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 cursor-help hover:text-primary transition-colors">
                    <Lock className="w-3 h-3 text-primary" />
                    <span className="font-mono hidden sm:inline">Local Processing</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-border/50">
                  <p className="max-w-xs text-xs">
                    All masking and unmasking happens in your browser.
                    Your data never passes through our servers.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 cursor-help hover:text-primary transition-colors">
                    <Cpu className="w-3 h-3 text-primary" />
                    <span className="font-mono hidden sm:inline">Memory-Only Keys</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-border/50">
                  <p className="max-w-xs text-xs">
                    API keys are stored only in memory and cleared when you close this tab.
                    Never saved to localStorage or cookies.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hidden sm:flex items-center gap-1.5 cursor-help hover:text-primary transition-colors">
                    <Eye className="w-3 h-3 text-primary" />
                    <span className="font-mono">You Verify</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="glass-card border-border/50">
                  <p className="max-w-xs text-xs">
                    Open DevTools and check for yourself. No cookies, no storage,
                    no calls to our backend.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Links - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex items-center gap-2 md:gap-4 text-[10px] md:text-xs">
            <Link
              to="/how-it-works"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <HelpCircle className="w-3 h-3" />
              <span className="hidden sm:inline">How it works</span>
            </Link>
            <Link
              to="/verify"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Verify Privacy</span>
            </Link>
            <Link
              to="/changelog"
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              <GitCommit className="w-3 h-3" />
              <span className="hidden sm:inline">Changelog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
