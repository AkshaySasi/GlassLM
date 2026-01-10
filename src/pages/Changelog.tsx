import { ArrowLeft, GitCommit, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import glasslmLogo from '@/assets/glasslm-logo.webp';

const CHANGELOG_ENTRIES = [
  {
    version: 'v0.1.0',
    date: 'January 2025',
    title: 'Initial Public Release',
    changes: [
      'Privacy-first AI chat interface with automatic PII masking',
      'Support for ChatGPT, Claude, Gemini, Grok, and DeepSeek',
      'Memory-only API key storage (never persisted)',
      'Real-time mask preview and confidence indicators',
      '"What AI Saw" transparency panel',
      'Network inspector for request verification',
      'Test masking mode for privacy-only analysis',
      '🎉 Featured on Product Hunt',
    ],
  },
];

const Changelog = () => {
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
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mb-6 mx-auto animate-glow">
              <GitCommit className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              <span className="text-crystal">Changelog</span>
            </h1>

            <p className="text-muted-foreground max-w-lg mx-auto">
              What's new in GlassLM. We believe in transparent development.
            </p>
          </div>

          {/* Changelog entries */}
          <div className="space-y-6">
            {CHANGELOG_ENTRIES.map((entry, index) => (
              <div
                key={entry.version}
                className="glass-card rounded-xl p-6 hover:scale-[1.01] transition-transform duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-sm font-medium">
                    {entry.version}
                  </span>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                <h2 className="font-semibold text-lg mb-3">{entry.title}</h2>

                <ul className="space-y-2">
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground font-mono">
              More updates coming soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Changelog;
