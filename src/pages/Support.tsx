import { Coffee, Heart, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import qrCode from '@/assets/buymeacoffee-qr.webp';
import glasslmLogo from '@/assets/glasslm-logo.webp';

const Support = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 glass-surface border-b border-border/30">
        <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm">Back to GlassLM</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <img src={glasslmLogo} alt="GlassLM" className="w-6 h-6 object-contain" />
            <span className="font-mono text-sm text-crystal">GLASS LM</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Hero */}
          <div className="mb-12">
            <div className="w-16 h-16 rounded-2xl bg-[#FFDD00]/10 border border-[#FFDD00]/30 flex items-center justify-center mb-6 mx-auto glass-card">
              <Coffee className="w-8 h-8 text-[#FFDD00]" />
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              <span className="text-crystal">Support GlassLM</span>
            </h1>

            <p className="text-muted-foreground max-w-lg mx-auto">
              GlassLM is built with care to protect your privacy. If it's been helpful,
              consider buying the creator a coffee to support ongoing development.
            </p>
          </div>

          {/* Support Card */}
          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* QR Code */}
              <div className="flex-shrink-0">
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <img
                    src={qrCode}
                    alt="Buy Me a Coffee QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3 font-mono">
                  Scan to support
                </p>
              </div>

              {/* Info */}
              <div className="flex-1 text-left">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Thank you for your support
                </h2>

                <p className="text-muted-foreground text-sm mb-6">
                  Every coffee helps keep GlassLM free, independent, and focused on
                  privacy-first AI interaction. Your support means the world.
                </p>

                <Button
                  asChild
                  size="lg"
                  className="w-full md:w-auto gap-2 bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-semibold rounded-xl"
                >
                  <a
                    href="https://buymeacoffee.com/akshaysasi"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Coffee className="w-4 h-4" />
                    Buy me a coffee
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* What you support */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="glass-card rounded-xl p-5 hover:scale-[1.02] transition-transform duration-300">
              <h3 className="font-medium text-sm mb-1.5">🔒 Privacy Development</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Continued research into better PII detection and masking algorithms
              </p>
            </div>
            <div className="glass-card rounded-xl p-5 hover:scale-[1.02] transition-transform duration-300">
              <h3 className="font-medium text-sm mb-1.5">🌐 Independence</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Keeping GlassLM free from data-hungry business models
              </p>
            </div>
            <div className="glass-card rounded-xl p-5 hover:scale-[1.02] transition-transform duration-300">
              <h3 className="font-medium text-sm mb-1.5">✨ New Features</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                More AI providers, better detection, and advanced privacy tools
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
