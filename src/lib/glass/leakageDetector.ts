import { MaskedItem } from './types';

export type LeakageWarning = {
  type: 'direct' | 'indirect' | 'inferred';
  severity: 'low' | 'medium' | 'high';
  description: string;
  matchedText?: string;
};

// Check if AI response might have leaked masked information
export function detectLeakage(
  response: string,
  maskedItems: MaskedItem[]
): LeakageWarning[] {
  const warnings: LeakageWarning[] = [];
  const responseLower = response.toLowerCase();

  for (const item of maskedItems) {
    const originalLower = item.original.toLowerCase();

    // Direct leak: Original value appears in response
    if (responseLower.includes(originalLower)) {
      warnings.push({
        type: 'direct',
        severity: 'high',
        description: `AI response contains the original ${item.type} that was masked`,
        matchedText: item.original,
      });
      continue;
    }

    // Partial leak check for names (first/last name separately)
    if (item.type === 'name') {
      const nameParts = item.original.split(/\s+/).filter(p => p.length > 2);
      for (const part of nameParts) {
        if (responseLower.includes(part.toLowerCase())) {
          warnings.push({
            type: 'indirect',
            severity: 'medium',
            description: `AI response may contain a partial name that was masked`,
            matchedText: part,
          });
        }
      }
    }

    // Email domain leak check
    if (item.type === 'email') {
      const emailParts = item.original.split('@');
      if (emailParts.length === 2) {
        const domain = emailParts[1].toLowerCase();
        // Only flag non-common domains
        const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
        if (!commonDomains.includes(domain) && responseLower.includes(domain)) {
          warnings.push({
            type: 'indirect',
            severity: 'low',
            description: `AI response mentions an email domain from masked data`,
            matchedText: domain,
          });
        }
      }
    }

    // Check for numeric patterns from SSN/phone/credit card
    if (['ssn', 'phone', 'credit_card'].includes(item.type)) {
      const digits = item.original.replace(/\D/g, '');
      if (digits.length >= 4) {
        // Check for last 4 digits appearing (common leak pattern)
        const last4 = digits.slice(-4);
        if (response.includes(last4)) {
          warnings.push({
            type: 'indirect',
            severity: 'medium',
            description: `AI response contains digits that match part of masked ${item.type}`,
            matchedText: last4,
          });
        }
      }
    }
  }

  return warnings;
}

// Analyze a prompt before sending to estimate privacy risk
export function analyzePrivacyRisk(
  maskedText: string,
  maskedItems: MaskedItem[]
): {
  riskLevel: 'low' | 'medium' | 'high';
  concerns: string[];
} {
  const concerns: string[] = [];
  
  // Check if placeholder context might reveal info
  const placeholderContexts = maskedItems.map(item => {
    const idx = maskedText.indexOf(item.placeholder);
    if (idx === -1) return '';
    const start = Math.max(0, idx - 50);
    const end = Math.min(maskedText.length, idx + item.placeholder.length + 50);
    return maskedText.slice(start, end);
  });

  // Check for revealing context patterns
  for (const context of placeholderContexts) {
    if (/lives? (?:at|in|near)/i.test(context)) {
      concerns.push('Location context may help AI infer masked addresses');
    }
    if (/works? (?:at|for)/i.test(context)) {
      concerns.push('Employment context may help AI infer identity');
    }
    if (/born|birthday|age/i.test(context)) {
      concerns.push('Date context may reveal personal information');
    }
  }

  // Count sensitive items
  const sensitiveCount = maskedItems.filter(i => 
    ['ssn', 'credit_card'].includes(i.type)
  ).length;
  
  if (sensitiveCount > 0) {
    concerns.push(`${sensitiveCount} highly sensitive item(s) will be masked`);
  }

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (concerns.length > 2 || sensitiveCount > 0) {
    riskLevel = 'medium';
  }
  if (concerns.length > 3 || sensitiveCount > 2) {
    riskLevel = 'high';
  }

  return { riskLevel, concerns };
}
