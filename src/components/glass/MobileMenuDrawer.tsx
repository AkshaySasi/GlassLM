import { useState } from 'react';
import { X, Shield, HelpCircle, GitCommit, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileMenuDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onConnectAI: () => void;
}

export function MobileMenuDrawer({ isOpen, onClose, onConnectAI }: MobileMenuDrawerProps) {
    const handleItemClick = () => {
        onClose();
    };

    const handleConnectAI = () => {
        onConnectAI();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in"
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
                <div className="glass-card rounded-t-3xl border-t border-border/30 shadow-2xl mx-2 mb-2">
                    {/* Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 rounded-full bg-muted-foreground/30" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-border/30">
                        <h2 className="text-lg font-semibold font-mono text-crystal">Menu</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Product Hunt Badge - Mobile Only */}
                    <div className="px-6 py-4 border-b border-border/30">
                        <a
                            href="https://www.producthunt.com/products/glasslm?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-glasslm"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleItemClick}
                            className="flex items-center justify-center hover:opacity-80 transition-opacity"
                        >
                            <img
                                alt="GlassLM - Product Hunt"
                                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1059756&theme=light&t=1768032088791"
                                className="h-10"
                            />
                        </a>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link
                            to="/verify"
                            onClick={handleItemClick}
                            className="drawer-item flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                        >
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="text-base font-medium">Verify Privacy</span>
                        </Link>

                        <Link
                            to="/how-it-works"
                            onClick={handleItemClick}
                            className="drawer-item flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                        >
                            <HelpCircle className="w-5 h-5 text-primary" />
                            <span className="text-base font-medium">How it Works</span>
                        </Link>

                        <Link
                            to="/changelog"
                            onClick={handleItemClick}
                            className="drawer-item flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                        >
                            <GitCommit className="w-5 h-5 text-primary" />
                            <span className="text-base font-medium">Changelog</span>
                        </Link>

                        <a
                            href="mailto:hello@glasslm.space"
                            onClick={handleItemClick}
                            className="drawer-item flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                        >
                            <MessageCircle className="w-5 h-5 text-primary" />
                            <span className="text-base font-medium">Feedback</span>
                        </a>

                        <button
                            onClick={handleConnectAI}
                            className="drawer-item flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors w-full text-left"
                        >
                            <Zap className="w-5 h-5 text-primary" />
                            <span className="text-base font-medium">Connect AI</span>
                        </button>
                    </div>

                    {/* Footer padding for safe area */}
                    <div className="h-6" />
                </div>
            </div>
        </>
    );
}
