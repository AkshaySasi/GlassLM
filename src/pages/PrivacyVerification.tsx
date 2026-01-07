import { Shield, Cookie, Database, Network, Terminal, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import glasslmLogo from '@/assets/glasslm-logo.webp';

const PrivacyVerification = () => {
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
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-6 mx-auto animate-glow">
              <Shield className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              <span className="text-crystal">Verify Our Privacy Claims</span>
            </h1>

            <p className="text-muted-foreground max-w-lg mx-auto">
              Don't just trust us — verify. Here's exactly what GlassLM does and doesn't do,
              and how you can confirm it yourself.
            </p>
          </div>

          {/* Privacy Claims */}
          <div className="space-y-4 mb-12">
            <div className="glass-card rounded-xl p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
                  <Cookie className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">No Cookies</h3>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    GlassLM does not set any cookies. Your browsing is not tracked.
                  </p>
                  <div className="bg-background/40 rounded-lg p-3 font-mono text-xs border border-border/30">
                    <p className="text-muted-foreground mb-1">Verify yourself:</p>
                    <p className="text-primary">DevTools → Application → Cookies → (empty)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">No localStorage / sessionStorage</h3>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    We don't persist anything to your browser's storage. API keys, messages,
                    and masked data exist only in memory and are cleared when you close the tab.
                  </p>
                  <div className="bg-background/40 rounded-lg p-3 font-mono text-xs border border-border/30">
                    <p className="text-muted-foreground mb-1">Verify yourself:</p>
                    <p className="text-primary">DevTools → Application → Local Storage → (empty)</p>
                    <p className="text-primary">DevTools → Application → Session Storage → (empty)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
                  <Network className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">No Backend Logging</h3>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    GlassLM runs entirely in your browser. API calls go directly from your
                    browser to your chosen AI provider. We have no server that sees your data.
                  </p>
                  <div className="bg-background/40 rounded-lg p-3 font-mono text-xs border border-border/30">
                    <p className="text-muted-foreground mb-1">Verify yourself:</p>
                    <p className="text-primary">DevTools → Network → Filter by domain</p>
                    <p className="text-muted-foreground mt-1">You'll only see calls to: api.openai.com, api.anthropic.com, etc.</p>
                    <p className="text-muted-foreground">No calls to any GlassLM backend.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center shrink-0">
                  <Terminal className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">Masked Payloads Only</h3>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Before any request leaves your browser, sensitive data is replaced with
                    placeholders like [[NAME_1]] or [[PHONE_1]]. The AI never sees your real data.
                  </p>
                  <div className="bg-background/40 rounded-lg p-3 font-mono text-xs border border-border/30">
                    <p className="text-muted-foreground mb-1">Verify yourself:</p>
                    <p className="text-primary">DevTools → Network → Click on API request → Payload tab</p>
                    <p className="text-muted-foreground mt-1">Inspect the request body to see placeholders, not real data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to open DevTools */}
          <div className="glass-card rounded-xl p-6 border border-primary/20" style={{ boxShadow: '0 0 40px hsl(270 80% 60% / 0.1)' }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              How to Open DevTools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-background/40 rounded-lg p-3 border border-border/30">
                <p className="font-mono text-muted-foreground mb-1">Chrome / Edge / Brave:</p>
                <p className="font-mono text-primary">F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)</p>
              </div>
              <div className="bg-background/40 rounded-lg p-3 border border-border/30">
                <p className="font-mono text-muted-foreground mb-1">Firefox:</p>
                <p className="font-mono text-primary">F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)</p>
              </div>
              <div className="bg-background/40 rounded-lg p-3 border border-border/30 md:col-span-2">
                <p className="font-mono text-muted-foreground mb-1">Safari:</p>
                <p className="font-mono text-primary">Preferences → Advanced → Show Develop menu</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyVerification;
