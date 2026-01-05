import { MaskedItem } from './types';

type PatternDef = {
  type: MaskedItem['type'];
  pattern: RegExp;
  prefix: string;
};

const PATTERNS: PatternDef[] = [
  { type: 'email', pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, prefix: 'EMAIL' },
  { type: 'phone', pattern: /(?:\+?1[-.\s]?)?(?:\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g, prefix: 'PHONE' },
  { type: 'ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/g, prefix: 'SSN' },
  { type: 'credit_card', pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, prefix: 'CARD' },
  { type: 'name', pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/g, prefix: 'NAME' },
];

export function autoMask(text: string): { maskedText: string; maskedItems: MaskedItem[] } {
  const maskedItems: MaskedItem[] = [];
  let maskedText = text;
  const counters: Record<string, number> = {};

  // Track already masked positions to avoid double-masking
  const maskedRanges: { start: number; end: number }[] = [];

  for (const { type, pattern, prefix } of PATTERNS) {
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
    for (const { match: matchStr } of matches) {
      // Check if this exact value was already masked
      const existingItem = maskedItems.find(item => item.original === matchStr);
      
      if (existingItem) {
        // Use the same placeholder
        maskedText = maskedText.replace(matchStr, existingItem.placeholder);
      } else {
        // Create new placeholder
        counters[prefix] = (counters[prefix] || 0) + 1;
        const placeholder = `[[${prefix}_${counters[prefix]}]]`;
        
        maskedItems.push({
          id: `${type}_${counters[prefix]}`,
          original: matchStr,
          placeholder,
          type,
        });
        
        // Replace all occurrences of this exact match
        maskedText = maskedText.split(matchStr).join(placeholder);
      }
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
