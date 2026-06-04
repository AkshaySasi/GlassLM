import { MaskedItem } from './types';
import { analyzeContext, isValidLuhn } from './contextAnalyzer';
import { MaskingRules, MaskingRuleType } from './maskingRules';

type PatternDef = {
  type: MaskingRuleType;
  pattern: RegExp;
  prefix: string;
  confidence?: 'high' | 'medium' | 'low';
  requireContext?: boolean;
  validator?: (value: string) => boolean;
};

const PATTERNS: PatternDef[] = [
  // High-confidence API keys with known prefixes
  { type: 'api_key', pattern: /\b(sk|pk)[-_][a-zA-Z0-9]{20,}/g, prefix: 'API_KEY', confidence: 'high' },

  // Context-aware API key detection ("My API key is abc123")
  {
    type: 'api_key',
    pattern: /\b(?:my|the|your|this|our)\s+(?:app(?:lication)?\s+)?api\s+key\s+(?:is|:|=)?\s*['"]?([a-zA-Z0-9]{16,})['"]?/gi,
    prefix: 'API_KEY',
    confidence: 'medium',
    requireContext: true,
  },

  // Inline API key assignment ("have an API KEY xyz")
  {
    type: 'api_key',
    pattern: /\bapi\s+key[:\s]+([a-zA-Z0-9]{14,})\b/gi,
    prefix: 'API_KEY',
    confidence: 'high',
  },

  // Standard API key assignment
  {
    type: 'api_key',
    pattern: /\bapi[-_]?key[-_:=]\s*['"]?([a-zA-Z0-9]{16,})['"]?/gi,
    prefix: 'API_KEY',
    confidence: 'high',
  },

  // Environment variable style
  { type: 'api_key', pattern: /\bAPI_KEY\s*[=:]\s*['"]?([a-zA-Z0-9]{16,})['"]?/g, prefix: 'API_KEY', confidence: 'high' },

  // JWT tokens
  { type: 'access_token', pattern: /\beyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, prefix: 'JWT', confidence: 'high' },

  // Bearer tokens
  { type: 'access_token', pattern: /\b(Bearer|Token)[\s:]+[a-zA-Z0-9_-]{20,}/gi, prefix: 'TOKEN', confidence: 'high' },

  // AWS credentials
  { type: 'cloud_credential', pattern: /\bAKIA[0-9A-Z]{16}\b/g, prefix: 'AWS_KEY', confidence: 'high' },
  { type: 'cloud_credential', pattern: /\b[a-zA-Z0-9+/]{40}\b/g, prefix: 'AWS_SECRET', confidence: 'medium' },

  // Private keys
  { type: 'private_key', pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]{50,}?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/g, prefix: 'PRIVATE_KEY', confidence: 'high' },

  // Database connection strings
  { type: 'database_url', pattern: /\b(?:mongodb|postgresql|postgres|mysql):\/\/[^\s'"]+/gi, prefix: 'DB_URL', confidence: 'high' },

  // IPv4
  { type: 'ip_address', pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, prefix: 'IP', confidence: 'high' },

  // IPv6
  { type: 'ip_address', pattern: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g, prefix: 'IPv6', confidence: 'high' },

  { type: 'email', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, prefix: 'EMAIL', confidence: 'high' },
  { type: 'phone', pattern: /(?:\+?1[-.\\s]?)?(?:\([0-9]{3}\)|[0-9]{3})[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4}/g, prefix: 'PHONE', confidence: 'high' },
  { type: 'ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/g, prefix: 'SSN', confidence: 'high' },

  // Credit card — validated with Luhn
  {
    type: 'credit_card',
    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    prefix: 'CARD',
    confidence: 'high',
    validator: isValidLuhn,
  },

  // Names — context-dependent
  {
    type: 'name',
    pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g,
    prefix: 'NAME',
    confidence: 'medium',
    requireContext: true,
  },

  // Generic long secrets — context-dependent
  {
    type: 'access_token',
    pattern: /\b[a-zA-Z0-9_-]{32,}\b/g,
    prefix: 'SECRET',
    confidence: 'low',
    requireContext: true,
  },
];

export function autoMask(
  text: string,
  rules?: MaskingRules,
): { maskedText: string; maskedItems: MaskedItem[] } {
  const maskedItems: MaskedItem[] = [];
  let maskedText = text;
  const counters: Record<string, number> = {};

  for (const { type, pattern, prefix, confidence, requireContext, validator } of PATTERNS) {
    // Skip this pattern if the corresponding rule is disabled
    if (rules && rules[type] === false) continue;

    // Always reset before use — regexes with /g are stateful
    pattern.lastIndex = 0;

    // Collect matches from the original text so indices are stable
    const matches: { match: string; index: number }[] = [];
    const scanPattern = new RegExp(pattern.source, pattern.flags);
    let match: RegExpExecArray | null;

    while ((match = scanPattern.exec(text)) !== null) {
      matches.push({ match: match[0], index: match.index });
    }

    for (const { match: matchStr, index } of matches) {
      // Reuse the same placeholder for identical values within this call
      const existing = maskedItems.find(item => item.original === matchStr);
      if (existing) {
        maskedText = maskedText.split(matchStr).join(existing.placeholder);
        continue;
      }

      if (validator && !validator(matchStr)) continue;

      let finalConfidence = confidence ?? 'medium';
      if (requireContext) {
        const { confidence: ctxConfidence } = analyzeContext(text, index, matchStr.length, type);
        finalConfidence = ctxConfidence;
        if (finalConfidence === 'low') continue;
      }

      counters[prefix] = (counters[prefix] ?? 0) + 1;
      const placeholder = `[[${prefix}_${counters[prefix]}]]`;

      maskedItems.push({
        id: `${type}_${counters[prefix]}`,
        original: matchStr,
        placeholder,
        type,
        confidence: finalConfidence,
      });

      // Replace every occurrence, not just the first
      maskedText = maskedText.split(matchStr).join(placeholder);
    }
  }

  return { maskedText, maskedItems };
}

export function unmask(text: string, maskedItems: MaskedItem[]): string {
  let result = text;
  for (const item of maskedItems) {
    result = result.split(item.placeholder).join(item.original);
  }
  return result;
}

export function getMaskedItemsByType(items: MaskedItem[]): Record<string, MaskedItem[]> {
  return items.reduce((acc, item) => {
    acc[item.type] ??= [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, MaskedItem[]>);
}

export function getConfidenceColor(confidence: 'high' | 'medium' | 'low' = 'medium'): string {
  const map = { high: 'text-red-500', medium: 'text-yellow-500', low: 'text-green-500' } as const;
  return map[confidence];
}

export function getConfidenceLabel(confidence: 'high' | 'medium' | 'low' = 'medium'): string {
  const map = { high: 'High Confidence', medium: 'Medium Confidence', low: 'Low Confidence' } as const;
  return map[confidence];
}
