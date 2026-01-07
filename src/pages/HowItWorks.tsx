import { ArrowLeft, ArrowRight, Keyboard, Lock, Cloud, Unlock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import glasslmLogo from '@/assets/glasslm-logo.webp';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: Keyboard,
      title: "You type normally",
      description: "Write your message as you would in any chat. Include names, emails, phone numbers — whatever you need.",
      example: "Hi, my name is John Smith and my email is john@company.com. Can you help me draft a reply?",
      color: "text-blue-400",
      glowColor: "270 80% 60%",
    },
    {
      number: 2,
      icon: Lock,
      title: "GlassLM masks sensitive data",
      description: "Before anything leaves your browser, sensitive information is automatically detected and replaced with placeholders.",
      example: "Hi, my name is [[NAME_1]] and my email is [[EMAIL_1]]. Can you help me draft a reply?",
      color: "text-primary",
      glowColor: "280 70% 55%",
    },
    {
      number: 3,
      icon: Cloud,
      title: "AI sees only placeholders",
      description: "The AI receives and responds using placeholders. It has no access to your actual sensitive data.",
      example: "Sure [[NAME_1]]! Here's a professional reply you can send from [[EMAIL_1]]...",
      color: "text-purple-400",
      glowColor: "290 60% 50%",
    },
    {
      number: 4,
      icon: Unlock,
      title: "Your data is restored locally",
      description: "GlassLM replaces placeholders with your original data in your browser. The AI response now makes sense with your real information.",
      example: "Sure John Smith! Here's a professional reply you can send from john@company.com...",
      color: "text-success",
      glowColor: "145 60% 45%",
    },
  ];

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
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-6 animate-float">
              <img
                src={glasslmLogo}
                alt="GlassLM Crystal"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              <span className="text-crystal">How GlassLM Works</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              A simple 4-step process that keeps your sensitive data private
              while still giving you the full power of AI.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6 mb-16">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent hidden md:block" style={{ height: 'calc(100% + 24px)' }} />
                )}

                <div className="glass-card rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Step number and icon */}
                    <div className="flex items-start gap-4 md:w-48 shrink-0">
                      <div
                        className="w-16 h-16 rounded-xl glass-card flex items-center justify-center"
                        style={{ boxShadow: `0 0 30px hsl(${step.glowColor} / 0.3)` }}
                      >
                        <step.icon className={`w-8 h-8 ${step.color}`} />
                      </div>
                      <div className="md:hidden">
                        <span className={`text-xs font-mono ${step.color} uppercase`}>Step {step.number}</span>
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="hidden md:block mb-2">
                        <span className={`text-xs font-mono ${step.color} uppercase`}>Step {step.number}</span>
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">
                        {step.description}
                      </p>

                      {/* Example */}
                      <div className="bg-background/40 rounded-xl p-4 border border-border/30">
                        <p className="text-xs font-mono text-muted-foreground mb-2">Example:</p>
                        <p className="text-sm font-mono leading-relaxed">
                          {step.example}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4 md:hidden">
                    <ArrowRight className="w-5 h-5 text-primary rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Ready to try it yourself?
            </p>
            <Button asChild size="lg" className="btn-crystal text-white rounded-xl px-6">
              <Link to="/">
                Start Chatting Privately
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
