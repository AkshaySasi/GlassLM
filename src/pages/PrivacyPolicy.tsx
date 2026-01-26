import { Navbar } from "../components/glass/Navbar";
import { Footer } from "@/components/glass/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
            <Navbar />

            <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-20 animate-fade-in">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-indigo-400">
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Last updated: January 27, 2026
                    </p>
                </div>

                <div className="prose prose-invert prose-glass max-w-none space-y-8 p-8 rounded-2xl bg-muted/5 border border-white/5 backdrop-blur-md">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>1.</span> Introduction
                        </h2>
                        <p>
                            At GlassLM, privacy isn't just a feature—it's the entire product. We built GlassLM to prove that you don't have to sacrifice your data's security to use modern AI tools. This Privacy Policy explains exactly how we (don't) handle your data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>2.</span> Zero Data Collection
                        </h2>
                        <p>
                            GlassLM is a "Local-First" application. This means:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2 text-muted-foreground">
                            <li><strong className="text-foreground">Processing happens on your device:</strong> All text masking, PII detection, and logic runs directly in your browser or machine.</li>
                            <li><strong className="text-foreground">We don't have servers:</strong> We do not have a backend database that stores your chats, API keys, or personal information.</li>
                            <li><strong className="text-foreground">We don't track you:</strong> We do not use third-party analytics (like Google Analytics) to track your usage behavior.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>3.</span> Your API Keys
                        </h2>
                        <p>
                            If you choose to connect your own AI providers (like OpenAI or Anthropic):
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2 text-muted-foreground">
                            <li>Your API keys are stored <strong>locally in your browser's memory</strong> (session storage).</li>
                            <li>They are never sent to GlassLM developers or any third party.</li>
                            <li>They are sent directly from your browser to the AI provider's API endpoint only when you send a message.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>4.</span> Data Transmission
                        </h2>
                        <p>
                            GlassLM acts as a secure proxy layer. When you send a message:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2 mt-2 text-muted-foreground">
                            <li>GlassLM intercepts the text.</li>
                            <li>It scrubs sensitive data locally.</li>
                            <li>It sends the <em>sanitized</em> text to the AI provider (e.g., ChatGPT, Claude) via their official APIs.</li>
                            <li>The AI's response is displayed to you.</li>
                        </ol>
                        <p className="mt-4">
                            We cannot see, read, or intercept these messages. The connection is direct between you and the AI provider.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>5.</span> Contact Us
                        </h2>
                        <p>
                            If you have any questions about this (very short) privacy policy, please contact us at <a href="mailto:hello@glasslm.space" className="text-primary hover:underline">hello@glasslm.space</a>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
