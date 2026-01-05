import { Eye, Cpu, Lock, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import glasslmLogo from '@/assets/glasslm-logo.png';

interface WelcomeScreenProps {
  hasProviders: boolean;
}

export function WelcomeScreen({ hasProviders }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] text-center px-4 py-6">
      <div className="mb-6 md:mb-8">
        <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 animate-crystal-float crystal-breathe cursor-pointer">
          <img 
            src={glasslmLogo} 
            alt="GlassLM Crystal" 
            className="w-full h-full object-contain transition-transform duration-500"
          />
        </div>
        
        <h1 className="text-2xl md:text-4xl font-semibold mb-3 md:mb-4">
          <span className="text-crystal">Ask anything.</span>
          <br />
          <span className="text-muted-foreground text-lg md:text-2xl">Your sensitive data never reaches the AI.</span>
        </h1>
        
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mb-3 md:mb-4 px-2">
          GlassLM masks sensitive data before sending prompts to your AI, and restores it locally after the response.
        </p>
        
        <Link 
          to="/how-it-works" 
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-mono"
        >
          <HelpCircle className="w-4 h-4" />
          See how it works
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-2xl w-full mb-6 md:mb-8 px-2">
        <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-5 text-left group hover:scale-[1.02] transition-transform duration-300">
          <Lock className="w-4 h-4 md:w-5 md:h-5 text-primary mb-2 md:mb-3" />
          <h3 className="font-medium text-xs md:text-sm mb-1 md:mb-1.5">Auto-Mask</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
            Sensitive data is detected and replaced with placeholders automatically
          </p>
        </div>
        
        <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-5 text-left group hover:scale-[1.02] transition-transform duration-300">
          <Eye className="w-4 h-4 md:w-5 md:h-5 text-primary mb-2 md:mb-3" />
          <h3 className="font-medium text-xs md:text-sm mb-1 md:mb-1.5">Full Transparency</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
            See exactly what gets masked and what's sent to the AI
          </p>
        </div>
        
        <div className="glass-card rounded-xl md:rounded-2xl p-4 md:p-5 text-left group hover:scale-[1.02] transition-transform duration-300">
          <Cpu className="w-4 h-4 md:w-5 md:h-5 text-primary mb-2 md:mb-3" />
          <h3 className="font-medium text-xs md:text-sm mb-1 md:mb-1.5">Your AI</h3>
          <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
            Bring your own API keys. Stored only in memory, cleared on tab close.
          </p>
        </div>
      </div>
    </div>
  );
}
