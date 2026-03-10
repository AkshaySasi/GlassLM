import { Navbar } from '@/components/glass/Navbar';
import { Footer } from '@/components/glass/Footer';
import { Terminal, Package, Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function Developers() {
    const [copiedContent, setCopiedContent] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedContent(text);
        setTimeout(() => setCopiedContent(null), 2000);
    };

    const CopyButton = ({ text }: { text: string }) => (
        <button
            onClick={() => handleCopy(text)}
            className="absolute right-3 top-3 p-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-foreground transition-all duration-200"
            title="Copy to clipboard"
            aria-label="Copy to clipboard"
        >
            {copiedContent === text ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
    );

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-24 md:py-32">
                <div className="mb-12 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-6">
                        <Terminal className="w-3 h-3" />
                        <span>v0.1.0 Released</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                        Integrate GlassLM into your apps
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
                        Protect your users' privacy before their data hits any LLM API. Native SDKs available for Node.js, Web, and Python.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Node.js SDK */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-lg bg-[#417E38]/10 border border-[#417E38]/20">
                                <Package className="w-5 h-5 text-[#417E38]" />
                            </div>
                            <h2 className="text-2xl font-semibold">Node.js SDK</h2>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            The official package for Node.js backend applications. Automatically masks sensitive data and restores it from AI responses.
                        </p>

                        <div className="glass-card rounded-xl overflow-hidden mb-6 relative group">
                            <div className="px-4 py-2 border-b border-border/50 bg-black/40 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono">Terminal</span>
                            </div>
                            <div className="p-4 bg-black/60 font-mono text-sm overflow-x-auto text-primary/90">
                                npm install @glasslm/node @glasslm/core
                            </div>
                            <CopyButton text="npm install @glasslm/node @glasslm/core" />
                        </div>

                        <div className="glass-card rounded-xl overflow-hidden relative group">
                            <div className="px-4 py-2 border-b border-border/50 bg-black/40 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono">Usage Example</span>
                            </div>
                            <pre className="p-4 bg-black/60 font-mono text-sm overflow-x-auto text-gray-300">
                                <code>{`import { GlassLM } from '@glasslm/node';

const glasslm = new GlassLM();

// 1. Mask sensitive user input
const { maskedText, maskedItems } = glasslm.mask("Email admin@test.com");
console.log(maskedText); // "Email [[EMAIL_1]]"

// 2. Send 'maskedText' to OpenAI/Claude/Gemini...
const aiResponse = "I have sent an email to [[EMAIL_1]].";

// 3. Restore the sensitive data
const finalResponse = glasslm.unmask(aiResponse, maskedItems);
console.log(finalResponse); // "I have sent an email to admin@test.com."`}</code>
                            </pre>
                            <CopyButton text={`import { GlassLM } from '@glasslm/node';\n\nconst glasslm = new GlassLM();\n\nconst { maskedText, maskedItems } = glasslm.mask("Email admin@test.com");\n\nconst aiResponse = "I have sent an email to [[EMAIL_1]].";\nconst finalResponse = glasslm.unmask(aiResponse, maskedItems);`} />
                        </div>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                    {/* Python SDK */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-lg bg-[#3776AB]/10 border border-[#3776AB]/20">
                                <Code2 className="w-5 h-5 text-[#3776AB]" />
                            </div>
                            <h2 className="text-2xl font-semibold">Python SDK</h2>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            Perfect for Python backends, CLI tools, and Jupyter notebooks. Easy integration with the OpenAI Python client.
                        </p>

                        <div className="glass-card rounded-xl overflow-hidden mb-6 relative group">
                            <div className="px-4 py-2 border-b border-border/50 bg-black/40 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono">Terminal</span>
                            </div>
                            <div className="p-4 bg-black/60 font-mono text-sm overflow-x-auto text-primary/90">
                                pip install glasslm
                            </div>
                            <CopyButton text="pip install glasslm" />
                        </div>

                        <div className="glass-card rounded-xl overflow-hidden relative group">
                            <div className="px-4 py-2 border-b border-border/50 bg-black/40 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono">Usage Example</span>
                            </div>
                            <pre className="p-4 bg-black/60 font-mono text-sm overflow-x-auto text-gray-300">
                                <code>{`from glasslm import mask, unmask

# 1. Mask sensitive user input
result = mask("Email me at user@test.com, my key is sk-abc123xyz789")

print(result.masked_text)
# "Email me at [[EMAIL_1]], my key is [[API_KEY_1]]"

# 2. Call your LLM
ai_response = "I will contact [[EMAIL_1]] regarding [[API_KEY_1]]"

# 3. Restore original data
final_response = unmask(ai_response, result.masked_items)
print(final_response)
# "I will contact user@test.com regarding sk-abc123xyz789"`}</code>
                            </pre>
                            <CopyButton text={`from glasslm import mask, unmask\n\nresult = mask("Email me at user@test.com, my key is sk-abc123xyz789")\nai_response = "I will contact [[EMAIL_1]] regarding [[API_KEY_1]]"\nfinal_response = unmask(ai_response, result.masked_items)`} />
                        </div>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

                    {/* Browser Web SDK */}
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-lg bg-[#F7DF1E]/10 border border-[#F7DF1E]/20">
                                <Terminal className="w-5 h-5 text-[#F7DF1E]" />
                            </div>
                            <h2 className="text-2xl font-semibold">Web SDK (Browser)</h2>
                        </div>
                        <p className="text-muted-foreground mb-4">
                            If you're building a React, Vue, or vanilla JS app in the browser, use the lightweight web SDK.
                        </p>

                        <div className="glass-card rounded-xl overflow-hidden mb-6 relative group">
                            <div className="px-4 py-2 border-b border-border/50 bg-black/40 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono">Terminal</span>
                            </div>
                            <div className="p-4 bg-black/60 font-mono text-sm overflow-x-auto text-primary/90">
                                npm install @glasslm/web @glasslm/core
                            </div>
                            <CopyButton text="npm install @glasslm/web @glasslm/core" />
                        </div>

                        <div className="glass-card rounded-xl overflow-hidden relative group">
                            <div className="px-4 py-2 border-b border-border/50 bg-black/40 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-mono">Usage Example</span>
                            </div>
                            <pre className="p-4 bg-black/60 font-mono text-sm overflow-x-auto text-gray-300">
                                <code>{`import { mask, unmask } from '@glasslm/web';

const { maskedText, maskedItems } = mask("Hi, call me at 555-0123");
console.log(maskedText); // "Hi, call me at [[PHONE_1]]"

const restored = unmask("Okay, I will call [[PHONE_1]]", maskedItems);`}</code>
                            </pre>
                            <CopyButton text={`import { mask, unmask } from '@glasslm/web';\n\nconst { maskedText, maskedItems } = mask("Hi, call me at 555-0123");\nconst restored = unmask("Okay, I will call [[PHONE_1]]", maskedItems);`} />
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
