export function FirstTimeGuide() {
    const steps = [
        { n: '1', label: 'Connect your AI' },
        { n: '2', label: 'Paste anything' },
        { n: '3', label: 'PII auto-masked' },
    ];

    return (
        <div className="flex items-center justify-center gap-1.5 md:gap-3 mb-2">
            {steps.map((step, i) => (
                <span key={step.n} className="flex items-center gap-1.5 md:gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                        <span className="w-4 h-4 rounded-full bg-primary/15 border border-primary/30 text-primary text-[9px] flex items-center justify-center font-bold flex-shrink-0">
                            {step.n}
                        </span>
                        <span className="hidden sm:inline">{step.label}</span>
                        <span className="sm:hidden text-[10px]">{step.label.split(' ')[0]}</span>
                    </span>
                    {i < steps.length - 1 && (
                        <span className="text-border/60 text-xs">→</span>
                    )}
                </span>
            ))}
        </div>
    );
}
