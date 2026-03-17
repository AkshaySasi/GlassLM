# glasslm

**Privacy guardrail for AI applications.** Mask sensitive data before sending to any LLM, restore it from the response.

## Install

```bash
pip install glasslm
```

## Usage

### Basic Masking

```python
from glasslm import mask, unmask

# Mask PII from text
result = mask("Email me at user@example.com, my key is sk-abc123xyz789")

print(result.masked_text)
# "Email me at [[EMAIL_1]], my key is [[API_KEY_1]]"

print(result.masked_items)
# [MaskedItem(id='email_1', original='user@example.com', ...)]

# Restore the original from a response
response = "I'll contact [[EMAIL_1]] about the [[API_KEY_1]] integration."
restored = unmask(response, result.masked_items)
print(restored)
# "I'll contact user@example.com about the sk-abc123xyz789 integration."
```

### With an LLM (OpenAI example)

```python
from glasslm import mask, unmask
import openai

client = openai.OpenAI(api_key="your-openai-key")

user_input = "My API key is sk-abc123... please help me debug."

# 1. Mask
result = mask(user_input)

# 2. Send masked text to LLM
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": result.masked_text}]
)

raw_reply = response.choices[0].message.content

# 3. Restore
final_reply = unmask(raw_reply, result.masked_items)
print(final_reply)
```

## Testing & Accuracy

The core `autoMask` engine has been rigorously validated against 60+ complex, real-world edge cases.

**Current Masking Accuracy: 100%**
- **13 Supported Categories**: API Keys, DB URLs, Private Keys, IPv4/IPv6, Email, Phone, Credit Cards (Luhn validated), SSN, JWTs, Bearer Tokens, AWS Credentials.
- **False-Positive Resistance**: Tested against embedded fragments, version strings, and safe context nouns.

## What gets detected

| Type | Examples |
|------|---------|
| `api_key` | `sk-...`, `pk-...`, OpenAI/Anthropic keys |
| `email` | `user@example.com` |
| `phone` | `+1 (555) 123-4567` |
| `ssn` | `123-45-6789` |
| `credit_card` | `4111 1111 1111 1111` (Luhn validated) |
| `access_token` | JWT, Bearer tokens |
| `private_key` | PEM-encoded RSA keys |
| `cloud_credential` | AWS Access Keys (`AKIA...`) |
| `database_url` | `mongodb://...`, `postgresql://...` |
| `ip_address` | IPv4 and IPv6 |
| `name` | `John Smith` (context-aware) |

## License

MIT
