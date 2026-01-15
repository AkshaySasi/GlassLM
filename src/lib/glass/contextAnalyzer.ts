import { MaskedItem } from './types';

/**
 * Context keywords for improving detection accuracy
 */
const CONTEXT_KEYWORDS = {
    api_key: {
        positive: ['key', 'api', 'token', 'secret', 'credential', 'auth', 'app'],
        negative: ['array', 'index', 'hash', 'version', 'code'],
    },
    phone: {
        positive: ['call', 'phone', 'mobile', 'number', 'contact', 'tel'],
        negative: ['code', 'error', 'line', 'port', 'id'],
    },
    email: {
        positive: ['email', 'mail', 'contact', 'address'],
        negative: [],
    },
    credit_card: {
        positive: ['card', 'payment', 'credit', 'debit', 'visa', 'mastercard'],
        negative: ['id', 'number', 'code'],
    },
};

/**
 * Luhn algorithm for credit card validation
 */
export function isValidLuhn(cardNumber: string): boolean {
    const digits = cardNumber.replace(/\D/g, '');

    if (digits.length < 13 || digits.length > 19) {
        return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

/**
 * Analyze context around a match to determine confidence
 */
export function analyzeContext(
    text: string,
    matchIndex: number,
    matchLength: number,
    type: string
): { confidence: 'high' | 'medium' | 'low'; score: number; keywords: string[] } {
    const windowSize = 40; // characters before and after
    const before = text.substring(Math.max(0, matchIndex - windowSize), matchIndex).toLowerCase();
    const after = text.substring(matchIndex + matchLength, Math.min(text.length, matchIndex + matchLength + windowSize)).toLowerCase();

    let score = 0.5; // baseline
    const foundKeywords: string[] = [];

    const keywords = CONTEXT_KEYWORDS[type as keyof typeof CONTEXT_KEYWORDS];
    if (!keywords) {
        return { confidence: 'medium', score, keywords: [] };
    }

    // Check positive keywords
    for (const keyword of keywords.positive) {
        if (before.includes(keyword) || after.includes(keyword)) {
            score += 0.15;
            foundKeywords.push(keyword);
        }
    }

    // Check negative keywords (reduce confidence)
    for (const keyword of keywords.negative) {
        if (before.includes(keyword) || after.includes(keyword)) {
            score -= 0.25;
        }
    }

    // Determine confidence level
    const confidence = score >= 0.85 ? 'high' : score >= 0.6 ? 'medium' : 'low';

    return { confidence, score, keywords: foundKeywords };
}

/**
 * Extract potential value from context-based patterns
 */
export function extractFromContext(text: string, pattern: RegExp): Array<{ value: string; index: number }> {
    const results: Array<{ value: string; index: number }> = [];
    const matches = text.matchAll(pattern);

    for (const match of matches) {
        // Extract the value from capture group if it exists
        const value = match[1] || match[0];
        const index = match.index || 0;
        results.push({ value, index });
    }

    return results;
}
