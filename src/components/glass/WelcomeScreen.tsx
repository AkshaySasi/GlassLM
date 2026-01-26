import { useState, useEffect } from 'react';
import { Eye, Cpu, Lock, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import glasslmLogo from '@/assets/glasslm-logo.webp';
import { FirstTimeGuide } from './FirstTimeGuide';

interface WelcomeScreenProps {
    hasProviders: boolean;
}

export function WelcomeScreen({ hasProviders }: WelcomeScreenProps) {
    const [activeCard, setActiveCard] = useState(0);

    // Auto-rotate carousel every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % 3);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Lock,
            title: 'Auto-Mask',
            description: 'Sensitive data is detected and replaced with placeholders automatically'
        },
        {
            icon: Eye,
            title: 'Full Transparency',
            description: 'See exactly what gets masked and what\'s sent to the AI'
        },
        {
            icon: Cpu,
            title: 'Your AI',
            description: 'Bring your own API keys. Stored only in memory, cleared on tab close.'
        }
    ];

    return (
        <>
            {/* Top Section - Above chat input */}
            <div className="flex flex-col items-center justify-center min-h-[90vh] md:min-h-[85vh] text-center px-4 py-6">
                {/* Logo and Heading - Enhanced spacing and typography */}
                <div className="mb-10 md:mb-12 pt-12 md:pt-0">
                    <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 md:mb-8 animate-crystal-float crystal-breathe cursor-pointer">
                        <img
                            src={glasslmLogo}
                            alt="GlassLM Crystal"
                            className="w-full h-full object-contain transition-transform duration-500"
                        />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-5 md:mb-6 leading-tight">
                        <span className="text-crystal bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent animate-gradient">Ask anything.</span>
                        <br />
                        <span className="text-muted-foreground text-xl md:text-3xl font-normal">Your sensitive data never reaches the AI.</span>
                    </h1>

                    {/* Hide 3-step guide on mobile, show on desktop */}
                    <div className="hidden md:block">
                        <FirstTimeGuide />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md mx-auto">
                        <Link
                            to="/how-it-works"
                            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-mono"
                        >
                            <HelpCircle className="w-4 h-4" />
                            See how it works
                        </Link>

                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                alert('Extension coming soon to Chrome Web Store!');
                            }}
                            className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all duration-300 font-mono"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-1.07 3.97-2.9 5.4z" />
                            </svg>
                            Get Chrome Extension
                        </a>
                    </div>
                </div>
            </div>

            {/* Feature Cards Section - Below chat input, requires scroll */}
            <div className="w-full px-4 py-12 md:py-16">
                {/* Section Heading */}
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 md:mb-12 text-crystal font-mono">
                    What makes GlassLM different...
                </h2>

                {/* Desktop: Grid layout */}
                <div className="hidden sm:grid grid-cols-3 gap-4 md:gap-5 max-w-2xl w-full mx-auto mb-8 md:mb-10 px-2">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="glass-card rounded-xl md:rounded-2xl p-5 md:p-6 text-left group hover:scale-[1.05] hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer">
                                <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary mb-3 md:mb-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.5)] transition-all duration-300" />
                                <h3 className="font-medium text-xs md:text-sm mb-1 md:mb-1.5">{feature.title}</h3>
                                <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Mobile: Carousel */}
                <div className="sm:hidden w-full max-w-sm mx-auto mb-6 relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-300 ease-out"
                            style={{ transform: `translateX(-${activeCard * 100}%)` }}
                        >
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="w-full flex-shrink-0 px-4">
                                        <div className="glass-card rounded-xl p-5 text-left">
                                            <Icon className="w-5 h-5 text-primary mb-3" />
                                            <h3 className="font-medium text-sm mb-2">{feature.title}</h3>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                        {features.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveCard(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeCard ? 'bg-primary w-6' : 'bg-primary/30'
                                    }`}
                                aria-label={`Go to feature ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
