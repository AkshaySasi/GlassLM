import { useState, useEffect } from 'react';
import { Eye, ShieldCheck, ArrowRight, Check, Activity, Search, Copy, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { autoMask } from '@/lib/glass/masker';
import { analyzePrivacyRisk } from '@/lib/glass/leakageDetector';
import { MaskedItem } from '@/lib/glass/types';
import { useToast } from "@/components/ui/use-toast";

export function ExtensionSidePanel() {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState<{
        maskedText: string;
        maskedItems: MaskedItem[];
        riskLevel: 'low' | 'medium' | 'high';
        concerns: string[];
    } | null>(null);
    const { toast } = useToast();

    // Listen for messages from content script
    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.action === 'setText' && message.text) {
                setInputText(message.text);
                handleRunPreview(message.text);
            }
        };

        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener(handleMessage);

            // Also try to PULL text from the active tab immediately
            // We use a small timeout to allow connection to establish
            setTimeout(() => {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const tabId = tabs[0]?.id;
                    // Don't try to send messages to restricted pages (chrome://) or if no tab
                    if (tabId && tabs[0].url && !tabs[0].url.startsWith('chrome://') && !tabs[0].url.startsWith('edge://')) {
                        chrome.tabs.sendMessage(tabId, { action: 'getText' }, (response) => {
                            // Checked runtime.lastError to suppress "Receiving end does not exist" if content script isn't ready
                            if (chrome.runtime.lastError) {
                                // Content script might not be loaded on this page yet, which is fine
                                return;
                            }
                            if (response && response.text) {
                                setInputText(response.text);
                                handleRunPreview(response.text);
                            }
                        });
                    }
                });
            }, 100);
        }

        return () => {
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                chrome.runtime.onMessage.removeListener(handleMessage);
            }
        }
    }, []);

    const handleRunPreview = (text: string = inputText) => {
        if (!text.trim()) return;
        const { maskedText, maskedItems } = autoMask(text);
        const { riskLevel, concerns } = analyzePrivacyRisk(maskedText, maskedItems);
        setResult({ maskedText, maskedItems, riskLevel, concerns });
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.maskedText);
        toast({
            title: "Copied to clipboard",
            description: "Masked text ready to paste.",
        });
    };

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            {/* Header */}
            <div className="p-4 border-b border-border/30 flex items-center gap-3 bg-muted/20">
                <div className="h-8 w-8 rounded-lg overflow-hidden border border-primary/20">
                    <img
                        src={typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL('glass_logo.jpg') : 'glass_logo.jpg'}
                        alt="Logo"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-sm font-bold">GlassLM</h1>
                    <p className="text-[10px] text-muted-foreground">A Glass-Box Layer for your AI</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Input Section */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Original Text</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            if (result) handleRunPreview(e.target.value);
                        }}
                        placeholder="Select text on any page and click the GlassLM icon..."
                        className="w-full h-32 p-3 rounded-lg bg-muted/20 border border-border/40 focus:border-primary/50 text-xs font-mono resize-none outline-none"
                    />
                    {!result && inputText && (
                        <Button size="sm" onClick={() => handleRunPreview()} className="w-full btn-crystal h-8 text-xs">
                            <Search className="w-3 h-3 mr-2" />
                            Mask Text
                        </Button>
                    )}
                </div>

                {/* Output Section */}
                {result && (
                    <div className="space-y-2 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-muted-foreground">Masked Output</label>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${result.riskLevel === 'low' ? 'bg-green-500/10 text-green-500' :
                                result.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                    'bg-red-500/10 text-red-500'
                                }`}>
                                {result.riskLevel} Risk
                            </span>
                        </div>

                        <div className="relative rounded-lg bg-black/40 border border-border/40 p-3 font-mono text-xs overflow-hidden">
                            <div className="whitespace-pre-wrap text-foreground/90 max-h-48 overflow-y-auto custom-scrollbar">
                                {result.maskedText.split(/(\[.*?\])/g).map((part, i) => {
                                    if (part.startsWith('[') && part.endsWith(']')) {
                                        return <span key={i} className="text-primary font-bold bg-primary/10 rounded px-1">{part}</span>;
                                    }
                                    return <span key={i}>{part}</span>;
                                })}
                            </div>
                        </div>

                        <Button onClick={handleCopy} className="w-full btn-crystal h-9 text-xs">
                            <Copy className="w-3 h-3 mr-2" />
                            Copy Masked Text
                        </Button>

                        {/* Detected Items */}
                        <div className="pt-4 border-t border-border/20">
                            <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Detected Entities ({result.maskedItems.length})</p>
                            <div className="space-y-1.5">
                                {result.maskedItems.length === 0 ? (
                                    <p className="text-[10px] text-muted-foreground italic">No sensitive entities detected.</p>
                                ) : (
                                    result.maskedItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-[10px] p-1.5 rounded bg-muted/10 border border-border/10">
                                            <span className="font-medium text-foreground flex items-center gap-1.5">
                                                <ShieldCheck className="w-3 h-3 text-primary" />
                                                {item.type}
                                            </span>
                                            <span className="text-muted-foreground truncate max-w-[80px]">{item.original}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!inputText && (
                    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground/50 border-2 border-dashed border-border/20 rounded-xl">
                        <Activity className="w-8 h-8 mb-2 opacity-30" />
                        <p className="text-xs text-center">Focus on any text field<br />to see the GlassLM icon</p>
                    </div>
                )}
            </div>
        </div>
    );
}
