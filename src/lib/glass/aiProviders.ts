import chatgptLogo from '@/assets/ai-logos/chatgpt.webp';
import claudeLogo from '@/assets/ai-logos/claude.webp';
import geminiLogo from '@/assets/ai-logos/gemini.webp';
import grokLogo from '@/assets/ai-logos/grok.webp';
import deepseekLogo from '@/assets/ai-logos/deepseek.webp';
import mistralLogo from '@/assets/ai-logos/mistral.webp';

export type AIProvider = {
  id: string;
  name: string;
  description: string;
  logo: string;
  color: string;
  apiKeyPlaceholder: string;
  apiKeyPrefix?: string;
};

export type ConnectedProvider = {
  providerId: string;
  apiKey: string;
  connectedAt: Date;
};

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'ChatGPT',
    description: 'GPT-4, GPT-4o',
    logo: chatgptLogo,
    color: 'hsl(171, 100%, 41%)',
    apiKeyPlaceholder: 'sk-...',
    apiKeyPrefix: 'sk-',
  },
  {
    id: 'anthropic',
    name: 'Claude',
    description: 'Claude 3.5, Claude 3',
    logo: claudeLogo,
    color: 'hsl(25, 95%, 53%)',
    apiKeyPlaceholder: 'sk-ant-...',
    apiKeyPrefix: 'sk-ant-',
  },
  {
    id: 'google',
    name: 'Gemini',
    description: 'Gemini Pro, Gemini Ultra',
    logo: geminiLogo,
    color: 'hsl(217, 91%, 60%)',
    apiKeyPlaceholder: 'AI...',
    apiKeyPrefix: 'AI',
  },
  {
    id: 'grok',
    name: 'Grok',
    description: 'xAI Grok',
    logo: grokLogo,
    color: 'hsl(0, 0%, 10%)',
    apiKeyPlaceholder: 'xai-...',
    apiKeyPrefix: 'xai-',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek Chat',
    logo: deepseekLogo,
    color: 'hsl(220, 100%, 55%)',
    apiKeyPlaceholder: 'sk-...',
    apiKeyPrefix: 'sk-',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    description: 'Mistral AI',
    logo: mistralLogo,
    color: 'hsl(25, 100%, 50%)',
    apiKeyPlaceholder: 'your-api-key',
  },
];
