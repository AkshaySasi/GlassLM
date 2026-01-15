// User-configurable masking rules
export type MaskingRuleType =
  | 'name'
  | 'email'
  | 'phone'
  | 'ssn'
  | 'credit_card'
  | 'date'
  | 'location'
  | 'api_key'
  | 'access_token'
  | 'private_key'
  | 'cloud_credential'
  | 'ip_address'
  | 'database_url';

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
  api_key: true,
  access_token: true,
  private_key: true,
  cloud_credential: true,
  ip_address: true,
  database_url: true,
};

export const RULE_LABELS: Record<MaskingRuleType, string> = {
  name: 'Names',
  email: 'Email Addresses',
  phone: 'Phone Numbers',
  ssn: 'Social Security Numbers',
  credit_card: 'Credit Card Numbers',
  date: 'Dates',
  location: 'Locations',
  api_key: 'API Keys',
  access_token: 'Access Tokens',
  private_key: 'Private Keys',
  cloud_credential: 'Cloud Credentials',
  ip_address: 'IP Addresses',
  database_url: 'Database URLs',
};

export const RULE_DESCRIPTIONS: Record<MaskingRuleType, string> = {
  name: 'Full names like "John Smith"',
  email: 'Email addresses like "user@example.com"',
  phone: 'Phone numbers in various formats',
  ssn: 'Social Security Numbers (XXX-XX-XXXX)',
  credit_card: '16-digit card numbers',
  date: 'Dates and times',
  location: 'Addresses and place names',
  api_key: 'API keys (sk-, pk-, api_)',
  access_token: 'JWT, OAuth, Bearer tokens',
  private_key: 'SSH, PGP private keys',
  cloud_credential: 'AWS, Azure, GCP credentials',
  ip_address: 'IPv4 and IPv6 addresses',
  database_url: 'Connection strings (MongoDB, PostgreSQL, MySQL)',
};

// Masking rule categories for UI organization
export const RULE_CATEGORIES = {
  'Personal Information': ['name', 'email', 'phone', 'ssn', 'credit_card'] as MaskingRuleType[],
  'Developer Secrets': ['api_key', 'access_token', 'private_key', 'cloud_credential', 'database_url'] as MaskingRuleType[],
  'Network & System': ['ip_address'] as MaskingRuleType[],
  'Optional': ['date', 'location'] as MaskingRuleType[],
};

// Masking presets for quick configuration
export const MASKING_PRESETS = {
  developer: {
    name: 'Developer Mode',
    description: 'Protects API keys, tokens, and credentials',
    rules: {
      ...DEFAULT_MASKING_RULES,
      name: false,
      date: false,
      location: false,
      api_key: true,
      access_token: true,
      private_key: true,
      cloud_credential: true,
      database_url: true,
      ip_address: true,
    } as MaskingRules,
  },
  personal: {
    name: 'Personal Mode',
    description: 'Protects personal information',
    rules: {
      ...DEFAULT_MASKING_RULES,
      name: true,
      email: true,
      phone: true,
      ssn: true,
      credit_card: true,
      api_key: false,
      access_token: false,
      private_key: false,
      cloud_credential: false,
      database_url: false,
      ip_address: false,
    } as MaskingRules,
  },
  enterprise: {
    name: 'Enterprise Mode',
    description: 'Maximum protection - masks everything',
    rules: Object.keys(DEFAULT_MASKING_RULES).reduce((acc, key) => {
      acc[key as MaskingRuleType] = true;
      return acc;
    }, {} as MaskingRules),
  },
  custom: {
    name: 'Custom',
    description: 'Configure your own rules',
    rules: DEFAULT_MASKING_RULES,
  },
};
