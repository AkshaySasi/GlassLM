export type MaskType = 'full' | 'token' | 'custom';

export type MaskedItem = {
  id: string;
  original: string;
  placeholder: string;
  type: 'name' | 'email' | 'phone' | 'ssn' | 'credit_card' | 'id' | 'address'
  | 'api_key' | 'access_token' | 'private_key' | 'cloud_credential' | 'ip_address' | 'database_url';
  confidence?: 'high' | 'medium' | 'low';
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  maskedContent?: string;
  maskedItems?: MaskedItem[];
  timestamp: Date;
  providerId?: string;
  isLoading?: boolean;
};

export type NetworkRequest = {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  payloadSize: number;
  payloadPreview: string;
  status?: number;
};
