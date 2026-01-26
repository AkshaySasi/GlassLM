import { Navbar } from "../components/glass/Navbar";
import { Footer } from "@/components/glass/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
            <Navbar />

            <main className="flex-1 container max-w-4xl mx-auto px-4 py-12 md:py-20 animate-fade-in">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-indigo-400">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Last updated: January 27, 2026
                    </p>
                </div>

                <div className="prose prose-invert prose-glass max-w-none space-y-8 p-8 rounded-2xl bg-muted/5 border border-white/5 backdrop-blur-md">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>1.</span> Agreeing to Terms
                        </h2>
                        <p>
                            By accessing or using GlassLM (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>2.</span> Description of Service
                        </h2>
                        <p>
                            GlassLM is a client-side interface ("wrapper") that facilitates interaction with third-party AI models (like OpenAI, Anthropic, Google). We provide tools to mask sensitive data before it is sent to these providers.
                        </p>
                        <p className="mt-2 text-muted-foreground text-sm italic">
                            Disclaimer: GlassLM is an independent tool and is not affiliated with, endorsed by, or sponsored by OpenAI, Anthropic, Google, or any other AI provider.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>3.</span> User Responsibility
                        </h2>
                        <p>
                            You acknowledge that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-2 text-muted-foreground">
                            <li><strong>You are responsible for your API keys:</strong> Any charges incurred by usage of your personal API keys on third-party platforms are your sole responsibility.</li>
                            <li><strong>You are responsible for your data:</strong> While GlassLM attempts to mask sensitive data, no automated system is perfect. You should always review the output before sending critical information.</li>
                            <li><strong>Use specifically for lawful purposes:</strong> You agree not to use the Service for any illegal or unauthorized purpose.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>4.</span> "As Is" Service
                        </h2>
                        <p>
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. GlassLM makes no representations or warranties of any kind, whether express or implied, regarding the reliability, accuracy, or availability of the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>5.</span> Changes to Terms
                        </h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will always post the most current version on this page. By continuing to use the Service after changes become effective, you agree to be bound by the revised terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-primary/90 flex items-center gap-2">
                            <span>6.</span> Contact
                        </h2>
                        <p>
                            Questions about the Terms of Service should be sent to us at <a href="mailto:hello@glasslm.space" className="text-primary hover:underline">hello@glasslm.space</a>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
