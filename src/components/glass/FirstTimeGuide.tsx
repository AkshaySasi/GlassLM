export function FirstTimeGuide() {
    return (
        <div className="w-full max-w-lg mx-auto mb-4">
            {/* Steps */}
            <div className="flex items-center justify-center gap-2 md:gap-4 text-xs md:text-sm font-mono">
                <span className="text-foreground">Connect your AI</span>

                <span className="text-muted-foreground/50">→</span>

                <span className="text-foreground">Paste anything</span>

                <span className="text-muted-foreground/50">→</span>

                <span className="text-foreground">Review</span>
            </div>
        </div>
    );
}
