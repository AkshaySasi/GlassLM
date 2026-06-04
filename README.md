<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=7c3aed&height=200&section=header&text=GlassLM&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=A%20Glass-Box%20Layer%20For%20Your%20AI&descAlignY=58&descColor=c4b5fd&animation=fadeIn" width="100%" />

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&pause=1000&color=A855F7&center=true&vCenter=true&random=false&width=600&lines=Zero+PII+leaks.+Zero+surprise+bills.;Your+sensitive+data+never+reaches+the+AI.;35%2B+pattern+types.+Luhn+validated.;Open+source+%E2%80%94+audit+every+line." alt="Typing SVG" />
</a>

<br/>

[![Version](https://img.shields.io/badge/version-2.0.0-a855f7?style=for-the-badge&logo=semver&logoColor=white)](https://github.com/AkshaySasi/GlassLM/releases)
[![License](https://img.shields.io/badge/license-MIT-7c3aed?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/AkshaySasi/GlassLM?style=for-the-badge&color=a855f7&logo=github)](https://github.com/AkshaySasi/GlassLM/stargazers)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-a855f7?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-7c3aed?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

</div>

---

## What is GlassLM?

GlassLM is an **AI security + spend control gateway** — a transparent proxy that sits between your team and every AI provider. It automatically masks PII before requests leave your device, enforces org policies, and controls token spend.

```
Your App  →  GlassLM Gateway  →  OpenAI / Claude / Gemini / Mistral / ...
                 │
                 ├── PII masked (35+ types, Luhn-validated)
                 ├── Prompt injection blocked
                 ├── Policy enforced (warn / block / redact)
                 └── Token budget enforced — no surprise bills
```

> **One line of code.** Change `baseURL` to `gateway.glasslm.space`. Done.

---

## ✨ What's new in v2.0

| Feature | Description |
|---|---|
| 🛡️ **SOTA Masker** | 35+ pattern types — AI keys, Indian IDs (Aadhaar/PAN/IFSC/UPI), cloud creds, code secrets |
| 💸 **Spend Control** | Per-org and per-user token budgets. Email alerts at threshold. Hard block at limit. |
| 🚫 **Prompt Injection Guard** | 5 attack categories — OVERRIDE, JAILBREAK, EXFIL, INDIRECT, XML_INJECT |
| 🔒 **Context-word Boosting** | `"api_key": "abc"` → high confidence. Plain `abc` alone → ignored. |
| 🇮🇳 **India-first** | Only masker on the market with Aadhaar, PAN, IFSC, UPI, GST patterns |
| 📊 **Team Dashboard** | Per-user risk scores, token spend, compliance exports (GDPR/SOC2/HIPAA/ISO27001) |

---

## 🗂 Repository structure

```
glasslm/
├── src/                        # Main React app (glasslm.space)
│   ├── components/glass/       # UI components
│   ├── lib/glass/              # Core masking engine (client-side)
│   └── pages/                  # App routes
│
├── backend/                    # Hono + Node.js API server (private repo)
│   ├── src/gateway/            # AI provider proxy
│   │   └── providers/          # openai, anthropic, google, mistral, deepseek, grok
│   ├── src/middleware/
│   │   ├── masker.ts           # SOTA PII masker (35+ patterns)
│   │   └── promptGuard.ts      # Prompt injection detector
│   └── src/api/                # REST endpoints
│
├── sdk/
│   ├── core/                   # Framework-agnostic masking engine
│   ├── node/                   # Node.js SDK + GatewayClient
│   ├── python/                 # Python SDK
│   └── web/                    # Browser SDK
│
└── dashboard/                  # Team dashboard (app.glasslm.space)
    └── src/pages/              # Dashboard, Budgets, Policies, Reports...
```

---

## 🚀 Quick start

### Browser extension

Install from the [Edge Add-ons store](https://microsoftedge.microsoft.com/addons/detail/glasslm-a-glassbox-lay/ggigmidkjafhhcimoecdhebocpobland) — works on ChatGPT, Claude, Gemini, Perplexity, and 20+ AI sites.

### Node.js SDK

```bash
npm install @glasslm/node
```

```ts
import OpenAI from 'openai'
import { getGatewayConfig } from '@glasslm/node'

// Drop-in: just swap the config into your existing OpenAI client
const openai = new OpenAI(getGatewayConfig({
  glasslmKey: 'glm_...',      // your GlassLM API key
  providerKey: 'sk-...',      // your OpenAI / Anthropic / etc. key
  provider: 'openai',
}))

// Works exactly like before — PII masked transparently
const res = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'My SSN is 123-45-6789. Help me...' }],
})
// → sent as: 'My SSN is [[SSN_1]]. Help me...'
// → response unmasked before reaching your code
```

### Or use the standalone client (no OpenAI SDK needed)

```ts
import { GatewayClient } from '@glasslm/node'

const client = new GatewayClient({
  glasslmKey: 'glm_...',
  providerKey: 'sk-...',
  provider: 'anthropic',
})

const res = await client.chat({
  messages: [{ role: 'user', content: 'email is john@corp.com' }],
})

console.log(res.glasslm)
// { masked: 1, riskScore: 30, policyAction: 'none' }
```

### Python SDK

```python
from glasslm import autoMask, unmask

masked = autoMask("My API key is sk-abc123xyz and email is john@corp.com")
print(masked.text)       # My API key is [[API_KEY_1]] and email is [[EMAIL_2]]
print(masked.risk_score) # 75
```

---

## 🔒 PII detection — 35+ types

<details>
<summary><strong>Click to expand full pattern list</strong></summary>

| Tier | Type | Examples |
|---|---|---|
| **T1 — AI Keys** | OpenAI, Anthropic, Google, xAI, DeepSeek | `sk-proj-...`, `sk-ant-...`, `AIza...` |
| **T1 — Code Platform** | GitHub, GitLab, npm | `ghp_...`, `glpat-...`, `npm_...` |
| **T1 — Payment** | Stripe, Razorpay, Twilio, SendGrid | `sk_live_...`, `rzp_live_...` |
| **T1 — Messaging** | Slack tokens, Slack webhooks | `xoxb-...`, `hooks.slack.com/...` |
| **T1 — Cloud** | AWS, Azure, GCP service accounts | `AKIA...`, `DefaultEndpointsProtocol=...` |
| **T1 — Crypto** | Private keys, certificates, JWTs | `-----BEGIN PRIVATE KEY-----` |
| **T1 — DB** | All connection strings | `postgresql://user:pass@host/db` |
| **T2 — Personal** | Email, SSN, Credit card (Luhn), IBAN | `john@corp.com`, `4111-1111-...` |
| **T3 — Indian** | Aadhaar, PAN, IFSC, UPI, GST | `2345 6789 0123`, `ABCDE1234F` |
| **T4 — Code** | JSON / YAML / ENV secrets | `"password": "hunter2"`, `TOKEN=abc` |
| **T5 — Network** | IPv4, IPv6, MAC, BTC/ETH wallets | `192.168.1.1`, `0x742d35Cc...` |

</details>

---

## 🧱 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GlassLM Gateway                       │
│                                                         │
│  Request ──► Masker ──► Policy ──► Budget ──► Provider  │
│                │           │          │                  │
│              35+ NER    warn/block  token cap            │
│             patterns    /redact    + alert               │
│                │                                         │
│  Response ◄── Unmasker ◄──────────────────────────────  │
└─────────────────────────────────────────────────────────┘

Supported providers: OpenAI · Anthropic · Google Gemini
                     Mistral · DeepSeek · xAI Grok
```

---

## 🏗 Local development

```bash
# Clone
git clone https://github.com/AkshaySasi/GlassLM
cd GlassLM

# Install & run main app
npm install
npm run dev          # → localhost:8080

# Run dashboard
cd dashboard
npm install
npm run dev          # → localhost:5174

# Run backend (requires .env — see backend/.env.example)
cd backend
npm install
npm run dev          # → localhost:3001
```

---

## 🔐 Privacy guarantees

- **Zero message content stored** — only metadata (masked types, counts, risk score)
- **API keys stored as SHA-256 hashes** — raw key shown once, never persisted
- **User identity hashed** — SHA-256(email) in all event logs, never raw email
- **TLS on all gateway connections** — no plaintext AI traffic
- **Open source** — audit every line at github.com/AkshaySasi/GlassLM

---

## 📋 Changelog

### v2.0.0 — 2026-05-29
- 🛡️ Masker rewritten: 10 → 35+ pattern types, Luhn validation, context-word boosting
- 🇮🇳 Indian identifiers: Aadhaar, PAN, IFSC, UPI, GST
- 💸 Spend Control: per-org + per-user token budgets, email alerts, hard-block at limit
- 🚫 Prompt injection guard: 5 attack categories, 25+ pattern signatures
- 🔑 New gateway providers: Google Gemini, Mistral, DeepSeek, xAI Grok
- 📊 Team dashboard: Budgets page, compliance report downloads
- 🔢 Risk score upgraded: 0-10 → 0-100 with diversity + volume bonuses
- 📦 SDK: `GatewayClient` + `getGatewayConfig()` for drop-in OpenAI SDK usage

### v1.0.0 — 2025-12-01
- Initial release: client-side PII masking, Chrome extension, 10 pattern types
- Browser extension for ChatGPT, Claude, Gemini, Perplexity (20+ sites)
- Node.js + Python SDK

---

## 🤝 Contributing

PRs welcome. Please open an issue first for significant changes.

```bash
# Run masking tests
cd sdk/core && npm test

# Type check
npm run type-check
```

---

<div align="center">

**Built in India 🇮🇳 · Open source · Privacy-first**

[![glasslm.space](https://img.shields.io/badge/glasslm.space-visit-a855f7?style=for-the-badge)](https://glasslm.space)
[![Star on GitHub](https://img.shields.io/github/stars/AkshaySasi/GlassLM?style=for-the-badge&color=7c3aed&logo=github&label=Star+on+GitHub)](https://github.com/AkshaySasi/GlassLM)

<img src="https://capsule-render.vercel.app/api?type=waving&color=7c3aed&height=100&section=footer" width="100%" />

</div>
