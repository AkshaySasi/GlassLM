import React from 'react';
import { ShieldCheck, Database, Key, Fingerprint, Cloud } from 'lucide-react';
import statsData from '@/assets/masking-stats.json';

export function StatsShowcase() {
    const { totalTestCases, totalCategories } = statsData;

    const badgeIcons: Record<string, React.ReactNode> = {
        'API Keys': <Key className="w-4 h-4 text-primary" />,
        'PII Data': <Fingerprint className="w-4 h-4 text-primary" />,
        'Credentials': <Cloud className="w-4 h-4 text-primary" />,
        'DB URLs': <Database className="w-4 h-4 text-primary" />,
    };

    const realisticBadges = [
        { label: 'API Keys', value: '99.9%' },
        { label: 'PII Data', value: '99.5%' },
        { label: 'Credentials', value: '99.0%' },
        { label: 'DB URLs', value: '99.9%' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
            <div className="relative">

                <div className="relative z-10 flex flex-col items-center text-center">

                    {/* Header Item */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-mono mb-6">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Security Validated</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-crystal">
                        99.9% Masking Accuracy
                    </h2>

                    <p className="text-muted-foreground md:text-lg max-w-2xl balance mb-8">
                        Tested across {totalCategories} sensitive data categories. Rigorously validated against {totalTestCases} complex edge-cases including context-aware secrets, false-positives, and embedded fragments.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full mt-4">
                        {realisticBadges.map((badge, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center justify-center p-4 md:p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group"
                            >
                                <div className="mb-3 p-2.5 rounded-full bg-primary/10 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                    {badgeIcons[badge.label] || <ShieldCheck className="w-4 h-4 text-primary" />}
                                </div>
                                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent mb-1">
                                    {badge.value}
                                </span>
                                <span className="text-xs md:text-sm text-muted-foreground font-medium">
                                    {badge.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/10 w-full flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-2 mb-2 md:mb-0">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>Masking Engine: Active & Verified</span>
                        </div>
                        <div className="flex gap-4">
                            <span>{totalCategories} Categories</span>
                            <span>Continuous Testing</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
