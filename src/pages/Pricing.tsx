import { Check, Zap, Shield, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Footer } from '@/components/glass/Footer'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: { inr: '₹0', usd: '$0' },
    period: 'forever',
    desc: 'For individuals protecting their own AI usage.',
    icon: <Zap className="w-5 h-5" />,
    color: 'border-border/30',
    badge: null,
    features: [
      '1 user',
      'Browser extension',
      'Auto PII masking',
      '25,000 tokens/month via gateway',
      'All 6 AI providers',
      'Community support',
    ],
    cta: 'Start free',
    ctaHref: 'https://glasslm.space',
    ctaExternal: true,
    ctaStyle: 'border border-border/60 text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary',
  },
  {
    id: 'starter',
    name: 'Starter',
    price: { inr: '₹749', usd: '$9' },
    period: '/month',
    desc: 'Small teams getting started with AI governance.',
    icon: <Shield className="w-5 h-5" />,
    color: 'border-border/30',
    badge: null,
    features: [
      'Up to 5 users',
      'Team dashboard',
      '30-day event history',
      '1M tokens/month via gateway',
      'All masking types',
      'Email support',
    ],
    cta: 'Start trial',
    ctaHref: 'https://app.glasslm.space/signup',
    ctaExternal: true,
    ctaStyle: 'border border-primary/40 text-primary hover:bg-primary/10',
  },
  {
    id: 'team',
    name: 'Team',
    price: { inr: '₹2,499', usd: '$29' },
    period: '/month',
    desc: 'Growing teams that need real AI governance.',
    icon: <Shield className="w-5 h-5" />,
    color: 'border-primary/40',
    badge: 'Most Popular',
    features: [
      'Up to 25 users',
      'Full dashboard + risk reports',
      'Unlimited event history',
      '10M tokens/month via gateway',
      'Policy enforcement (warn/block/redact)',
      'Compliance overview',
      'Priority email support',
    ],
    cta: 'Start trial',
    ctaHref: 'https://app.glasslm.space/signup',
    ctaExternal: true,
    ctaStyle: 'btn-crystal text-white',
  },
  {
    id: 'business',
    name: 'Business',
    price: { inr: '₹6,799', usd: '$79' },
    period: '/month',
    desc: 'Unlimited teams with compliance requirements.',
    icon: <Building2 className="w-5 h-5" />,
    color: 'border-border/30',
    badge: null,
    features: [
      'Unlimited users',
      'Everything in Team',
      '100M tokens/month via gateway',
      'Compliance export (GDPR, SOC2, HIPAA)',
      'Chrome Enterprise MDM support',
      '99.9% SLA',
      'Slack support channel',
    ],
    cta: 'Start trial',
    ctaHref: 'https://app.glasslm.space/signup',
    ctaExternal: true,
    ctaStyle: 'border border-border/60 text-foreground hover:bg-primary/10 hover:border-primary/40 hover:text-primary',
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-background/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg btn-crystal flex items-center justify-center">
              <span className="text-white text-xs font-bold font-mono">G</span>
            </div>
            <span className="font-semibold text-sm">GlassLM</span>
          </Link>
          <span className="text-border/60">·</span>
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono uppercase tracking-wider">← Back</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-4">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-5">
            <span className="text-crystal">Simple, transparent</span>
            <br />
            <span className="text-foreground">pricing for every team</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free. Upgrade when your team grows. No per-seat surprises.
          </p>
          <p className="text-xs text-muted-foreground mt-3 font-mono">
            Annual billing = 2 months free on all paid plans
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div key={plan.id}
              className={`glass-card p-6 rounded-2xl flex flex-col relative border ${plan.color} ${plan.id === 'team' ? 'animate-glow' : ''}`}>

              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${plan.id === 'team' ? 'btn-crystal text-white' : 'bg-muted/50 text-muted-foreground'}`}>
                  {plan.icon}
                </div>
                <p className="font-bold text-foreground text-sm">{plan.name}</p>
                <div className="mt-2 mb-1">
                  <span className="text-3xl font-bold font-mono text-crystal">{plan.price.inr}</span>
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground">{plan.price.usd}{plan.period} · USD</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.desc}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a href={plan.ctaHref}
                target={plan.ctaExternal ? '_blank' : undefined}
                rel={plan.ctaExternal ? 'noopener noreferrer' : undefined}
                className={`block text-center py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${plan.ctaStyle}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="mt-8 glass-card p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="text-sm font-mono text-primary uppercase tracking-wider mb-1">Enterprise</p>
            <h3 className="text-xl font-bold text-foreground">Need more? Let's talk.</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Custom token limits, on-prem deployment, SSO, legal attestation letters, dedicated support.
            </p>
          </div>
          <a href="mailto:hello@glasslm.space"
            className="flex-shrink-0 px-6 py-3 rounded-xl border border-primary/40 text-primary text-sm font-semibold hover:bg-primary/10 transition-all">
            Contact us →
          </a>
        </div>

        {/* FAQ */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {[
            { q: 'What counts as a token?', a: 'Tokens processed through the GlassLM gateway — roughly 4 characters. Direct API calls through the extension don\'t count against your limit.' },
            { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade or downgrade anytime. Billing is prorated. Downgrade takes effect at the end of your billing cycle.' },
            { q: 'Do you store my messages?', a: 'Never. GlassLM only stores event metadata — what types of data were masked and counts. Zero message content is ever stored.' },
            { q: 'What payment methods?', a: 'UPI, NetBanking, credit/debit cards, and international cards via Razorpay. INR and USD accepted.' },
          ].map(({ q, a }) => (
            <div key={q} className="glass-card p-5 rounded-xl">
              <p className="text-sm font-semibold text-foreground mb-2">{q}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
