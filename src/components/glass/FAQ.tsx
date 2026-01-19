import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: 'How does masking work?',
        answer: 'GlassLM automatically detects sensitive data like API keys, emails, phone numbers, and credit cards using pattern matching. Before sending your prompt to the AI, it replaces these with placeholders like [[EMAIL_1]]. After the AI responds, it restores the original values.'
    },
    {
        question: 'Where are my API keys stored?',
        answer: 'Your API keys are stored only in browser memory (sessionStorage) and are never sent to any server. They are automatically cleared when you close the tab or browser.'
    },
    {
        question: 'Can I use any AI provider?',
        answer: 'Yes! GlassLM supports OpenAI (ChatGPT), Anthropic (Claude), and Google (Gemini). You can connect multiple providers and switch between them for different conversations.'
    },
    {
        question: 'Is my data sent to GlassLM servers?',
        answer: 'No. GlassLM runs entirely in your browser. All masking happens client-side, and your prompts go directly to the AI provider you\'ve configured. We never see or store your data.'
    },
    {
        question: 'What types of data are automatically masked?',
        answer: 'By default: API keys, access tokens, emails, phone numbers, SSN, credit cards, IP addresses, database URLs, and private keys. You can customize which types to mask in the Rules panel.'
    },
    {
        question: 'Can I see what the AI actually received?',
        answer: 'Yes! Click "View details" on any message to see the masked version that was sent to the AI. Full transparency is a core principle of GlassLM.'
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-10 text-crystal">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {faqItems.map((item, index) => (
                    <div
                        key={index}
                        className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-primary/30 border border-transparent"
                    >
                        <button
                            onClick={() => toggleItem(index)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-muted/5"
                        >
                            <span className="font-semibold text-sm md:text-base pr-4">
                                {item.question}
                            </span>
                            <ChevronDown
                                className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}
                        >
                            <div className="px-6 pb-5 pt-0">
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
