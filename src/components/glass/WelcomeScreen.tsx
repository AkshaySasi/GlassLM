import { useState, useEffect } from 'react';
import { Eye, Lock, HelpCircle, Code2, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import glasslmLogo from '@/assets/glasslm-logo.webp';
import { StatsShowcase } from './StatsShowcase';

interface WelcomeScreenProps {
    hasProviders: boolean;
}

export function WelcomeScreen({ hasProviders }: WelcomeScreenProps) {
    const [activeCard, setActiveCard] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % 3);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Lock,
            title: 'Auto-Mask PII',
            description: 'Emails, keys, Aadhaar, SSNs — 35+ types detected and replaced before any AI sees them',
            accent: 'from-purple-500/20 to-purple-600/10',
            iconColor: 'text-purple-400',
        },
        {
            icon: Gauge,
            title: 'Spend Control',
            description: 'Set token budgets per team. Alert at 80%. Hard-block at limit. No surprise AI bills.',
            accent: 'from-amber-500/20 to-amber-600/10',
            iconColor: 'text-amber-400',
        },
        {
            icon: Eye,
            title: 'Full Visibility',
            description: 'Every AI call logged with risk score, masked types, and cost — per user, per provider.',
            accent: 'from-blue-500/20 to-blue-600/10',
            iconColor: 'text-blue-400',
        },
    ];

    return (
        <>
            {/* ── Hero section ─────────────────────────────────────────────── */}
            <section className="relative flex flex-col items-center justify-center min-h-[calc(100svh-64px)] md:min-h-[calc(100vh-80px)] text-center px-5 pt-10 pb-36 md:pb-28 overflow-hidden">

                {/* Background radial glow — purely decorative */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] opacity-60" />
                </div>
                <div className="pointer-events-none absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-600/6 blur-[90px]" />
                <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-violet-500/6 blur-[90px]" />

                <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto">

                    {/* Crystal logo */}
                    <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 md:mb-8 animate-crystal-float crystal-breathe cursor-pointer drop-shadow-[0_0_32px_rgba(168,85,247,0.35)]">
                        <img
                            src={glasslmLogo}
                            alt="GlassLM"
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-5 leading-tight">
                        <span className="bg-gradient-to-r from-primary via-violet-300 to-primary bg-clip-text text-transparent animate-gradient block">
                            Ask anything.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-muted-foreground text-lg md:text-2xl font-normal mb-6 md:mb-8">
                        Your sensitive data never reaches the AI.
                    </p>

                    {/* Primary CTA */}
                    <div className="flex items-center justify-center mb-5">
                        <a
                            href="https://microsoftedge.microsoft.com/addons/detail/glasslm-a-glassbox-lay/ggigmidkjafhhcimoecdhebocpobland"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full btn-crystal text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all duration-300"
                        >
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.4z" />
                            </svg>
                            Get Extension
                        </a>
                    </div>

                    {/* Secondary links */}
                    <div className="flex items-center justify-center gap-4 text-xs">
                        <Link
                            to="/how-it-works"
                            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-mono"
                        >
                            <HelpCircle className="w-3 h-3" />
                            How it works
                        </Link>
                        <span className="text-border/50">·</span>
                        <Link
                            to="/developers"
                            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-mono"
                        >
                            <Code2 className="w-3 h-3" />
                            For Developers
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Feature cards ──────────────────────────────────────────────── */}
            <section className="w-full px-5 py-14 md:py-20">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-semibold text-crystal font-mono">
                            What makes GlassLM different...
                        </h2>
                    </div>

                    {/* Desktop: 3-col grid */}
                    <div className="hidden sm:grid grid-cols-3 gap-4 md:gap-5">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className={`relative rounded-2xl p-5 md:p-6 text-left overflow-hidden group hover:scale-[1.03] hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 border border-border/40 hover:border-primary/30 bg-gradient-to-br ${feature.accent} backdrop-blur-sm`}
                                    style={{ background: 'hsl(260 25% 10% / 0.8)' }}
                                >
                                    <div className={`w-9 h-9 rounded-xl bg-card/60 border border-border/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-4 h-4 ${feature.iconColor}`} />
                                    </div>
                                    <h3 className="font-semibold text-sm md:text-base mb-2 text-foreground">{feature.title}</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile: carousel */}
                    <div className="sm:hidden">
                        <div className="overflow-hidden rounded-2xl">
                            <div
                                className="flex transition-transform duration-400 ease-out"
                                style={{ transform: `translateX(-${activeCard * 100}%)` }}
                            >
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={index} className="w-full flex-shrink-0 p-1">
                                            <div className="rounded-2xl p-6 text-left border border-border/40 bg-card/80">
                                                <div className={`w-9 h-9 rounded-xl bg-background/60 border border-border/40 flex items-center justify-center mb-4`}>
                                                    <Icon className={`w-4 h-4 ${feature.iconColor}`} />
                                                </div>
                                                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dot indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveCard(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        index === activeCard ? 'bg-primary w-6' : 'bg-primary/30 w-1.5'
                                    }`}
                                    aria-label={`Feature ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats section ──────────────────────────────────────────────── */}
            <section className="w-full pb-32 md:pb-48">
                <StatsShowcase />
            </section>
        </>
    );
}
