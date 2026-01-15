import { Cpu, Shield, Eye } from 'lucide-react';

export function FirstTimeGuide() {
    return (
        <div className="w-full max-w-lg mx-auto mb-4">
            {/* Steps */}
            <div className="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm font-mono">
                <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                        <Cpu className="w-3 h-3" />
                    </span>
                    <span className="text-foreground">Connect your AI</span>
                </div>

                <span className="text-muted-foreground/50">→</span>

                <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                        <Shield className="w-3 h-3" />
                    </span>
                    <span className="text-foreground">Paste anything</span>
                </div>

                <span className="text-muted-foreground/50">→</span>

                <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                        <Eye className="w-3 h-3" />
                    </span>
                    <span className="text-foreground">Review</span>
                </div>
            </div>
        </div>
    );
}
