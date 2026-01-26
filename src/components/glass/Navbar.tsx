import { Link } from 'react-router-dom';
import glasslmLogo from '@/assets/glasslm-logo.webp';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-background/60 backdrop-blur-xl">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 md:w-10 md:h-10 relative">
                    <img
                        src={glasslmLogo}
                        alt="GlassLM"
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <div>
                    <h1 className="text-base md:text-lg font-bold tracking-tight">GlassLM</h1>
                    <p className="text-[10px] text-muted-foreground hidden sm:block">Privacy Layer</p>
                </div>
            </Link>

            <Link to="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-white/5 gap-2 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to App
                </Button>
            </Link>
        </nav>
    );
}
