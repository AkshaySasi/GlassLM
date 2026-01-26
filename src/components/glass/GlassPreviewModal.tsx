import { useState, useEffect } from 'react';
import { Eye, ShieldCheck, X, AlertTriangle, ArrowRight, Check, Activity, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { autoMask } from '@/lib/glass/masker';
import { analyzePrivacyRisk } from '@/lib/glass/leakageDetector';
import { MaskedItem } from '@/lib/glass/types';

interface GlassPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendToChat?: (text: string) => void;
    initialText?: string;
    hasProvider?: boolean;
}

export function GlassPreviewModal({
    isOpen,
    onClose,
    onSendToChat,
    initialText = '',
    hasProvider = false,
}: GlassPreviewModalProps) {
    const [inputText, setInputText] = useState(initialText);
    const [result, setResult] = useState<{
        maskedText: string;
        maskedItems: MaskedItem[];
        riskLevel: 'low' | 'medium' | 'high';
        concerns: string[];
    } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setInputText(initialText);
            if (initialText) {
                handleRunPreview(initialText);
            } else {
                setResult(null);
            }
        }
    }, [isOpen, initialText]);

    const handleRunPreview = (text: string = inputText) => {
        if (!text.trim()) return;
        const { maskedText, maskedItems } = autoMask(text);
        const { riskLevel, concerns } = analyzePrivacyRisk(maskedText, maskedItems);
        setResult({ maskedText, maskedItems, riskLevel, concerns });
    };

    const clear = () => {
        setInputText('');
        setResult(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md animate-fade-in p-4">
            <div
                className="glass-card w-full max-w-4xl rounded-2xl shadow-2xl animate-scale-in max-h-[90vh] flex flex-col overflow-hidden"
                style={{ boxShadow: '0 0 80px hsl(270 80% 50% / 0.15)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-border/30 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Eye className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground">Glass Preview</h2>
                            <p className="text-sm text-muted-foreground">See exactly what the AI sees, before you send.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:text-primary">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left: Input */}
                    <div className="flex flex-col h-full min-h-[300px]">
                        <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <span>Input (Your Sensitive Data)</span>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">Locally Processed</span>
                        </label>
                        <div className="relative flex-1 group">
                            <textarea
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value);
                                    // Real-time preview if already showing results
                                    if (result) handleRunPreview(e.target.value);
                                }}
                                placeholder="Paste text containing sensitive info..."
                                className="w-full h-full p-4 rounded-xl bg-muted/20 border border-border/40 focus:border-primary/50 focus:ring-0 resize-none font-mono text-sm transition-all outline-none"
                            />
                            {!result && inputText && (
                                <div className="absolute bottom-4 right-4">
                                    <Button size="sm" onClick={() => handleRunPreview()} className="btn-crystal">
                                        <Search className="w-3 h-3 mr-2" />
                                        Preview Masking
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Output */}
                    <div className="flex flex-col h-full min-h-[300px]">
                        <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <span>Output (What AI See)</span>
                            {result && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${result.riskLevel === 'low' ? 'bg-green-500/10 text-green-500' :
                                    result.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-red-500/10 text-red-500'
                                    }`}>
                                    {result.riskLevel} Risk
                                </span>
                            )}
                        </label>

                        <div className="flex-1 rounded-xl bg-black/40 border border-border/40 p-4 font-mono text-sm overflow-y-auto relative">
                            {result ? (
                                <>
                                    <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                                        {result.maskedText.split(/(\[.*?\])/g).map((part, i) => {
                                            if (part.startsWith('[') && part.endsWith(']')) {
                                                return <span key={i} className="text-primary font-bold bg-primary/10 rounded px-1">{part}</span>;
                                            }
                                            return <span key={i}>{part}</span>;
                                        })}
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-6 pt-4 border-t border-border/20">
                                        <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Detected Entities</h4>
                                        <div className="space-y-2">
                                            {result.maskedItems.length === 0 ? (
                                                <p className="text-xs text-muted-foreground italic">No sensitive entities detected.</p>
                                            ) : (
                                                result.maskedItems.map((item, idx) => (
                                                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-muted/10 border border-border/10">
                                                        <div className="flex items-center gap-2">
                                                            <ShieldCheck className="w-3 h-3 text-primary" />
                                                            <span className="font-medium text-foreground">{item.type}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-muted-foreground line-through opacity-50 px-1">{item.original.substring(0, 12)}...</span>
                                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                            <span className="text-primary font-mono">{item.placeholder}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50">
                                    <Activity className="w-8 h-8 mb-2 opacity-50" />
                                    <p className="text-xs">Preview waiting for input...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-border/30 shrink-0 flex justify-between items-center bg-background/5">
                    <Button variant="ghost" onClick={clear} disabled={!inputText}>
                        Clear All
                    </Button>

                    <div className="flex gap-3">
                        {onSendToChat && hasProvider && (
                            <Button
                                onClick={() => {
                                    if (result) {
                                        onSendToChat(inputText); // Send ORIGINAL (GlassLM handles masking) or MASKED? 
                                        // Ideally, we send original to ChatInput, and ChatInput's normal flow handles masking.
                                        // The user "approves" it here.
                                        onClose();
                                    }
                                }}
                                disabled={!result}
                                className="btn-crystal text-white"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Use in Chat
                            </Button>
                        )}
                        {!hasProvider && result && (
                            <p className="text-xs text-muted-foreground flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1.5 text-yellow-500" />
                                Connect AI to send
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
