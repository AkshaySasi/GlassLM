<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=7c3aed&height=200&section=header&text=GlassLM&fontSize=80&fontColor=ffffff&fontAlignY=38&desc=A%20Glass-Box%20Layer%20For%20Your%20AI&descAlignY=58&descColor=c4b5fd&animation=fadeIn" width="100%" />

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&pause=1000&color=A855F7&center=true&vCenter=true&random=false&width=600&lines=Your+sensitive+data+never+reaches+the+AI.;35%2B+PII+pattern+types.+Luhn+validated.;Works+on+ChatGPT%2C+Claude%2C+Gemini+%26+more.;Open+source+%E2%80%94+audit+every+line." alt="Typing SVG" />
</a>

<br/>

[![Version](https://img.shields.io/badge/version-1.0.0-a855f7?style=for-the-badge&logo=semver&logoColor=white)](https://github.com/AkshaySasi/GlassLM/releases)
[![License](https://img.shields.io/badge/license-MIT-7c3aed?style=for-the-badge)](LICENSE)
[![Stars](https://img.shields.io/github/stars/AkshaySasi/GlassLM?style=for-the-badge&color=a855f7&logo=github)](https://github.com/AkshaySasi/GlassLM/stargazers)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-a855f7?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-7c3aed?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

</div>

---

## What is GlassLM?

GlassLM is a **privacy-focused AI chat app** that automatically detects and masks sensitive data before it ever leaves your device. Paste anything — API keys, emails, credit cards, Aadhaar numbers — and GlassLM replaces them with safe placeholders before sending to the AI. The AI never sees your real data.

```
You type:   "My email is john@corp.com and API key is sk-abc123..."
AI sees:    "My email is [[EMAIL_1]] and API key is [[API_KEY_2]]..."
You get:    Full AI response with your real values restored
```

> **Your data never leaves your device in plaintext. Ever.**

---

## ✨ Features

- 🔒 **Auto-masking** — 35+ PII types detected and replaced automatically
- 🇮🇳 **India-first** — Aadhaar, PAN, IFSC, UPI, GST patterns built-in
- ✅ **Luhn validation** — credit card detection with checksum verification, not just regex
- 🔑 **Credential detection** — API keys, JWTs, private keys, cloud credentials, DB URLs
- 👁️ **Full transparency** — see exactly what gets masked before sending
- 🧩 **Browser extension** — works on ChatGPT, Claude, Gemini, Perplexity and 20+ AI sites
- 📦 **SDK** — Node.js, Python, and Web SDKs for developers

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

## 🗂 Repository structure

```
glasslm/
├── src/                        # Main React app (glasslm.space)
│   ├── components/glass/       # UI components
│   ├── lib/glass/              # Core masking engine (client-side)
│   ├── extension/              # Chrome/Edge browser extension
│   └── pages/                  # App routes
│
└── sdk/
    ├── core/                   # Framework-agnostic masking engine
    ├── node/                   # Node.js SDK
    ├── python/                 # Python SDK
    └── web/                    # Browser SDK
```

---

## 🚀 Quick start

### Browser extension

Install from the [Edge Add-ons store](https://microsoftedge.microsoft.com/addons/detail/glasslm-a-glassbox-lay/ggigmidkjafhhcimoecdhebocpobland) — works on ChatGPT, Claude, Gemini, Perplexity, and 20+ AI sites.

### Web app

Visit [glasslm.space](https://glasslm.space) — no install required.

### Node.js SDK

```bash
npm install @glasslm/node
```

```ts
import { GlassLM } from '@glasslm/node'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: 'sk-...' })
const glass = new GlassLM({ provider: openai })

const res = await glass.chat({
  messages: [{ role: 'user', content: 'My email is john@corp.com and SSN is 123-45-6789' }],
})
// Sent to AI as: 'My email is [[EMAIL_1]] and SSN is [[SSN_2]]'
// Response returned with real values restored
```

### Python SDK

```python
from glasslm import autoMask, unmask

masked = autoMask("My API key is sk-abc123xyz and email is john@corp.com")
print(masked.text)       # My API key is [[API_KEY_1]] and email is [[EMAIL_2]]
print(masked.risk_score) # 75
```

---

## 🏗 Local development

```bash
# Clone
git clone https://github.com/AkshaySasi/GlassLM
cd GlassLM

# Install & run
npm install
npm run dev    # → localhost:8080
```

---

## 🔐 Privacy guarantees

- **Client-side only** — masking happens in your browser, nothing is sent to GlassLM servers
- **No storage** — API keys stored in memory only, cleared on tab close
- **Open source** — audit every line at github.com/AkshaySasi/GlassLM
- **Zero telemetry** — no analytics, no tracking, no data collection

---

## 🧪 Testing

The core `autoMask` engine is validated against 60+ real-world edge cases using Vitest.

```bash
cd sdk/core
npm install
npm test
```

---

## 🤝 Contributing

PRs welcome. Please open an issue first for significant changes.

---

<div align="center">

**Built in India 🇮🇳 · Open source · Privacy-first**

[![glasslm.space](https://img.shields.io/badge/glasslm.space-visit-a855f7?style=for-the-badge)](https://glasslm.space)
[![Star on GitHub](https://img.shields.io/github/stars/AkshaySasi/GlassLM?style=for-the-badge&color=7c3aed&logo=github&label=Star+on+GitHub)](https://github.com/AkshaySasi/GlassLM)

<img src="https://capsule-render.vercel.app/api?type=waving&color=7c3aed&height=100&section=footer" width="100%" />

</div>
