import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="w-full bg-gradient-to-b from-background to-background/80 border-t border-border/40 backdrop-blur-sm mt-20">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Footer Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold mb-5 text-foreground uppercase tracking-wider">Product</h3>
                        <div className="space-y-3.5">
                            <Link to="/how-it-works" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                                How it Works
                            </Link>
                            <Link to="/#faq" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                                FAQ
                            </Link>
                            <Link to="/changelog" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                                Changelog
                            </Link>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div>
                        <h3 className="text-sm font-semibold mb-5 text-foreground uppercase tracking-wider">Privacy</h3>
                        <div className="space-y-3.5">
                            <Link to="/verify" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                                Verify Privacy
                            </Link>
                            <a
                                href="https://github.com/yourusername/glasslm"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Open Source
                            </a>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold mb-5 text-foreground uppercase tracking-wider">Support</h3>
                        <div className="space-y-3.5">
                            <a
                                href="https://buymeacoffee.com/glasslm"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Buy me a coffee
                            </a>
                            <a href="mailto:hello@glasslm.space" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold mb-5 text-foreground uppercase tracking-wider">Legal</h3>
                        <div className="space-y-3.5">
                            <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground font-mono">
                        © {new Date().getFullYear()} GlassLM <span className="mx-2 text-border/50">•</span> Built with privacy in mind
                    </p>

                    <a
                        href="https://www.producthunt.com/products/glasslm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <Rocket className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                        <span className="font-medium">Product Hunt</span>
                    </a>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </footer>
    );
}
