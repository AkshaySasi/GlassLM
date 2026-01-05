// User-configurable masking rules
export type MaskingRuleType = 'name' | 'email' | 'phone' | 'ssn' | 'credit_card' | 'date' | 'location';

export type MaskingRules = {
  [K in MaskingRuleType]: boolean;
};

export const DEFAULT_MASKING_RULES: MaskingRules = {
  name: true,
  email: true,
  phone: true,
  ssn: true,
  credit_card: true,
  date: false,
  location: false,
};

export const RULE_LABELS: Record<MaskingRuleType, string> = {
  name: 'Names',
  email: 'Email Addresses',
  phone: 'Phone Numbers',
  ssn: 'Social Security Numbers',
  credit_card: 'Credit Card Numbers',
  date: 'Dates',
  location: 'Locations',
};

export const RULE_DESCRIPTIONS: Record<MaskingRuleType, string> = {
  name: 'Full names like "John Smith"',
  email: 'Email addresses like "user@example.com"',
  phone: 'Phone numbers in various formats',
  ssn: 'Social Security Numbers (XXX-XX-XXXX)',
  credit_card: '16-digit card numbers',
  date: 'Dates and times',
  location: 'Addresses and place names',
};
