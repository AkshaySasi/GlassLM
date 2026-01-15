import { MaskedItem } from './types';
import { analyzeContext, isValidLuhn, extractFromContext } from './contextAnalyzer';

type PatternDef = {
  type: MaskedItem['type'];
  pattern: RegExp;
  prefix: string;
  confidence?: 'high' | 'medium' | 'low';
  requireContext?: boolean; // Whether to apply context analysis
  validator?: (value: string) => boolean; // Additional validation
};

const PATTERNS: PatternDef[] = [
  // High-confidence API keys with known prefixes
  { type: 'api_key', pattern: /\b(sk|pk)[-_][a-zA-Z0-9]{20,}/g, prefix: 'API_KEY', confidence: 'high' },

  // Context-aware API key detection (catches "My API key is abc123")
  {
    type: 'api_key',
    pattern: /\b(?:my|the|your|this|our)\s+(?:app(?:lication)?\s+)?api\s+key\s+(?:is|:|=)?\s*['"']?([a-zA-Z0-9]{16,})['"']?/gi,
    prefix: 'API_KEY',
    confidence: 'medium',
    requireContext: true
  },

  // Simple flexible API KEY pattern (catches "have an API KEY xyz", "got API KEY abc", etc.)
  {
    type: 'api_key',
    pattern: /\bapi\s+key[:\s]+([a-zA-Z0-9]{14,})\b/gi,
    prefix: 'API_KEY',
    confidence: 'high'
  },

  // Standard API key assignment
  {
    type: 'api_key',
    pattern: /\bapi[-_]?key[-_:=]\s*['"']?([a-zA-Z0-9]{16,})['"']?/gi,
    prefix: 'API_KEY',
    confidence: 'high'
  },

  // Environment variable style
  { type: 'api_key', pattern: /\bAPI_KEY\s*[=:]\s*['"']?([a-zA-Z0-9]{16,})['"']?/g, prefix: 'API_KEY', confidence: 'high' },

  // JWT tokens
  { type: 'access_token', pattern: /\beyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, prefix: 'JWT', confidence: 'high' },

  // Bearer tokens
  { type: 'access_token', pattern: /\b(Bearer|Token)[\s:]+[a-zA-Z0-9_-]{20,}/gi, prefix: 'TOKEN', confidence: 'high' },
  { type: 'cloud_credential', pattern: /\bAKIA[0-9A-Z]{16}\b/g, prefix: 'AWS_KEY', confidence: 'high' }, // AWS Access Key
  { type: 'cloud_credential', pattern: /\b[a-zA-Z0-9+/]{40}\b/g, prefix: 'AWS_SECRET', confidence: 'medium' }, // AWS Secret (40 chars base64)
  { type: 'private_key', pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]{50,}?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/g, prefix: 'PRIVATE_KEY', confidence: 'high' },
  { type: 'database_url', pattern: /\b(?:mongodb|postgresql|postgres|mysql):\/\/[^\s'"]+/gi, prefix: 'DB_URL', confidence: 'high' },

  // IP Addresses
  { type: 'ip_address', pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g, prefix: 'IP', confidence: 'high' },
  { type: 'ip_address', pattern: /\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/g, prefix: 'IPv6', confidence: 'high' }, // IPv6

  // Original patterns
  { type: 'email', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, prefix: 'EMAIL', confidence: 'high' },
  { type: 'phone', pattern: /(?:\+?1[-.\\s]?)?(?:\([0-9]{3}\)|[0-9]{3})[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4}/g, prefix: 'PHONE', confidence: 'high' },
  { type: 'ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/g, prefix: 'SSN', confidence: 'high' },
  // Credit card with Luhn validation
  {
    type: 'credit_card',
    pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
    prefix: 'CARD',
    confidence: 'high',
    validator: isValidLuhn
  },

  // Names (context-dependent)
  {
    type: 'name',
    pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g,
    prefix: 'NAME',
    confidence: 'medium',
    requireContext: true
  },

  // Generic long strings (context-dependent, low confidence)
  {
    type: 'access_token',
    pattern: /\b[a-zA-Z0-9_-]{32,}\b/g,
    prefix: 'SECRET',
    confidence: 'low',
    requireContext: true
  },
];

export function autoMask(text: string): { maskedText: string; maskedItems: MaskedItem[] } {
  const maskedItems: MaskedItem[] = []
  let maskedText = text;
  const counters: Record<string, number> = {};

  // Track already masked positions to avoid double-masking
  const maskedRanges: { start: number; end: number }[] = [];

  for (const { type, pattern, prefix, confidence, requireContext, validator } of PATTERNS) {
    // Reset pattern lastIndex
    pattern.lastIndex = 0;

    // Find all matches first
    const matches: { match: string; index: number }[] = [];
    let match: RegExpExecArray | null;

    // Clone the pattern to avoid mutation issues
    const clonedPattern = new RegExp(pattern.source, pattern.flags);

    while ((match = clonedPattern.exec(text)) !== null) {
      matches.push({ match: match[0], index: match.index });
    }

    // Process matches (we'll replace in the maskedText, tracking what we've seen)
    for (const { match: matchStr, index } of matches) {
      // Check if this exact value was already masked
      const existingItem = maskedItems.find(item => item.original === matchStr);

      if (existingItem) {
        // Use the same placeholder
        maskedText = maskedText.replace(matchStr, existingItem.placeholder);
        continue;
      }

      // Run custom validator if provided (e.g., Luhn for credit cards)
      if (validator && !validator(matchStr)) {
        continue; // Skip if validation fails
      }

      // Apply context analysis if required
      let finalConfidence = confidence || 'medium';
      if (requireContext) {
        const contextAnalysis = analyzeContext(text, index, matchStr.length, type);
        finalConfidence = contextAnalysis.confidence;

        // Skip low-confidence matches for context-dependent patterns
        if (finalConfidence === 'low') {
          continue;
        }
      }

      // Create new placeholder
      counters[prefix] = (counters[prefix] || 0) + 1;
      const placeholder = `[[${prefix}_${counters[prefix]}]]`;

      maskedItems.push({
        id: `${type}_${counters[prefix]}`,
        original: matchStr,
        placeholder,
        type,
        confidence: finalConfidence,
      });

      // Replace all occurrences of this exact match
      maskedText = maskedText.split(matchStr).join(placeholder);
    }
  }

  return { maskedText, maskedItems };
}

export function unmask(text: string, maskedItems: MaskedItem[]): string {
  let unmaskedText = text;

  for (const item of maskedItems) {
    // Replace all occurrences of the placeholder with the original
    unmaskedText = unmaskedText.split(item.placeholder).join(item.original);
  }

  return unmaskedText;
}

export function getMaskedItemsByType(items: MaskedItem[]): Record<string, MaskedItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, MaskedItem[]>);
}

// Get confidence color for UI display
export function getConfidenceColor(confidence: 'high' | 'medium' | 'low' = 'medium'): string {
  switch (confidence) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-yellow-500';
  }
}

// Get confidence label for UI
export function getConfidenceLabel(confidence: 'high' | 'medium' | 'low' = 'medium'): string {
  switch (confidence) {
    case 'high': return 'High Confidence';
    case 'medium': return 'Medium Confidence';
    case 'low': return 'Low Confidence';
    default: return 'Medium Confidence';
  }
}
