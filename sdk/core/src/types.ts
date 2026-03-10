export type MaskType = 'full' | 'token' | 'custom';

export type MaskedItem = {
    id: string;
    original: string;
    placeholder: string;
    type: 'name' | 'email' | 'phone' | 'ssn' | 'credit_card' | 'id' | 'address'
    | 'api_key' | 'access_token' | 'private_key' | 'cloud_credential' | 'ip_address' | 'database_url';
    confidence?: 'high' | 'medium' | 'low';
};
