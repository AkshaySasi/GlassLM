import { autoMask, unmask, MaskedItem } from '@glasslm/core';

export interface LLMProvider {
    chat: {
        completions: {
            create: (params: any) => Promise<any>;
        };
    };
}

export interface GlassLMConfig {
    provider: LLMProvider;
    detect?: string[];
}

export interface ChatParams {
    messages: { role: string; content: string }[];
    [key: string]: any;
}

export class GlassLM {
    private provider: LLMProvider;
    private config: GlassLMConfig;

    constructor(config: GlassLMConfig) {
        this.provider = config.provider;
        this.config = config;
    }

    async chat(params: ChatParams) {
        const maskedMessages = [];
        let allMaskedItems: MaskedItem[] = [];

        // 1. Mask user messages
        for (const msg of params.messages) {
            if (msg.role === 'user') {
                const { maskedText, maskedItems } = autoMask(msg.content);
                maskedMessages.push({ ...msg, content: maskedText });
                allMaskedItems = [...allMaskedItems, ...maskedItems];
            } else {
                maskedMessages.push(msg);
            }
        }

        // 2. Call Provider
        const response = await this.provider.chat.completions.create({
            ...params,
            messages: maskedMessages,
        });

        // 3. Handle response
        // Basic OpenAI format support for choices[0].message.content
        if (response.choices && response.choices.length > 0 && response.choices[0].message) {
            const originalContent = response.choices[0].message.content || '';
            const restoredContent = unmask(originalContent, allMaskedItems);

            // Return enhanced response
            return {
                ...response,
                content: restoredContent,
                choices: response.choices.map((c: any) => ({
                    ...c,
                    message: {
                        ...c.message,
                        content: unmask(c.message.content || '', allMaskedItems)
                    }
                }))
            };
        }

        return response;
    }
}
