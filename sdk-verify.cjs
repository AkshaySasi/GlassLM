const { GlassLM } = require('./sdk/node/dist/index');

const mockProvider = {
    chat: {
        completions: {
            create: async (params) => {
                console.log("--- MOCK LLM PROVIDER ---");
                console.log("Received Messages:", JSON.stringify(params.messages, null, 2));
                // Verify masking happened
                const content = params.messages[0].content;
                if (content.includes('sk-')) {
                    throw new Error("FAILURE: PII leaked to provider!");
                }
                if (!content.includes('[[API_KEY_1]]')) {
                    throw new Error("FAILURE: Placeholder not found in request!");
                }

                return {
                    choices: [
                        {
                            message: {
                                content: "I have processed your key: [[API_KEY_1]]. Access granted."
                            }
                        }
                    ]
                };
            }
        }
    }
};

async function main() {
    console.log("Initializing GlassLM...");
    const glass = new GlassLM({ provider: mockProvider });

    console.log("Sending chat request...");
    const result = await glass.chat({
        messages: [{ role: 'user', content: "My secret is sk-12345678901234567890" }]
    });

    console.log("--- RESULT ---");
    console.log("Restored Content:", result.content);

    if (result.content.includes("sk-12345678901234567890")) {
        console.log("SUCCESS: PII restored correctly.");
    } else {
        console.error("FAILURE: PII not restored.");
        process.exit(1);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
