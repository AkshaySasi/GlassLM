import { MaskedItem } from './types';

export const CONTEXT_WINDOW = 40; // chars before/after match — exported for testability

const CONTEXT_KEYWORDS: Partial<Record<MaskedItem['type'], { positive: string[]; negative: string[] }>> = {
  api_key: {
    positive: ['key', 'api', 'token', 'secret', 'credential', 'auth', 'app', 'access', 'private'],
    negative: ['array', 'index', 'hash', 'version', 'code', 'sample', 'example'],
  },
  access_token: {
    positive: ['token', 'bearer', 'auth', 'secret', 'access', 'session'],
    negative: ['example', 'sample', 'test', 'placeholder'],
  },
  private_key: {
    positive: ['private', 'secret', 'pem', 'rsa', 'key', 'sign', 'decrypt'],
    negative: ['public', 'example', 'sample'],
  },
  cloud_credential: {
    positive: ['aws', 'amazon', 'cloud', 'iam', 'secret', 'access', 'credential'],
    negative: ['example', 'sample', 'test'],
  },
  phone: {
    positive: ['call', 'phone', 'mobile', 'number', 'contact', 'tel', 'fax', 'reach'],
    negative: ['code', 'error', 'line', 'port', 'id', 'zip'],
  },
  email: {
    positive: ['email', 'mail', 'contact', 'address', 'send', 'reach', 'inbox'],
    negative: [],
  },
  credit_card: {
    positive: ['card', 'payment', 'credit', 'debit', 'visa', 'mastercard', 'pay', 'charge'],
    negative: ['id', 'code', 'order', 'item'],
  },
  ssn: {
    positive: ['ssn', 'social', 'security', 'number', 'tax', 'identity'],
    negative: ['code', 'id', 'reference'],
  },
  name: {
    positive: ['name', 'called', 'person', 'user', 'contact', 'author', 'by', 'from', 'hi', 'dear'],
    negative: ['company', 'product', 'brand', 'city', 'country', 'version'],
  },
};

export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function analyzeContext(
  text: string,
  matchIndex: number,
  matchLength: number,
  type: string,
): { confidence: 'high' | 'medium' | 'low'; score: number; keywords: string[] } {
  const before = text.substring(Math.max(0, matchIndex - CONTEXT_WINDOW), matchIndex).toLowerCase();
  const after = text.substring(matchIndex + matchLength, Math.min(text.length, matchIndex + matchLength + CONTEXT_WINDOW)).toLowerCase();

  const keywords = CONTEXT_KEYWORDS[type as MaskedItem['type']];
  if (!keywords) return { confidence: 'medium', score: 0.5, keywords: [] };

  let score = 0.5;
  const foundKeywords: string[] = [];

  for (const kw of keywords.positive) {
    if (before.includes(kw) || after.includes(kw)) {
      score += 0.15;
      foundKeywords.push(kw);
    }
  }

  for (const kw of keywords.negative) {
    if (before.includes(kw) || after.includes(kw)) {
      score -= 0.25;
    }
  }

  const confidence = score >= 0.85 ? 'high' : score >= 0.6 ? 'medium' : 'low';
  return { confidence, score, keywords: foundKeywords };
}
