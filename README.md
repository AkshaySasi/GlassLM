<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0d0a1a,50:4c1d95,100:7c3aed&height=220&section=header&text=GlassLM&fontSize=90&fontColor=ffffff&fontAlignY=45&desc=A%20Glass-Box%20Layer%20For%20Your%20AI&descAlignY=65&descColor=c4b5fd&animation=fadeIn&stroke=a855f7&strokeWidth=1" width="100%" />

<br/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=18&pause=1200&color=A855F7&center=true&vCenter=true&width=560&lines=Your+sensitive+data+never+reaches+the+AI.;35%2B+PII+types+detected+%26+masked+instantly.;Works+on+ChatGPT%2C+Claude%2C+Gemini+%26+more.;Client-side+only.+Nothing+leaves+your+device." alt="Typing SVG" />
</a>

<br/><br/>

<img src="https://img.shields.io/badge/version-1.5-a855f7?style=for-the-badge&labelColor=1a0a2e&color=7c3aed" />
<img src="https://img.shields.io/badge/license-MIT-a855f7?style=for-the-badge&labelColor=1a0a2e&color=6d28d9" />
<img src="https://img.shields.io/github/stars/AkshaySasi/GlassLM?style=for-the-badge&labelColor=1a0a2e&color=7c3aed&logo=github&logoColor=c4b5fd" />
<img src="https://img.shields.io/badge/TypeScript-5.x-c4b5fd?style=for-the-badge&labelColor=1a0a2e&logo=typescript&logoColor=c4b5fd" />
<img src="https://img.shields.io/badge/React-18-c4b5fd?style=for-the-badge&labelColor=1a0a2e&logo=react&logoColor=c4b5fd" />

</div>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />
</div>

<br/>

## ◈ What is GlassLM?

GlassLM is a **privacy-first AI interface** — a glass-box layer that sits between you and every AI provider. It automatically detects and masks sensitive data before anything leaves your device, then restores the AI's response seamlessly. The AI never sees your real data. You never have to think about it.

<br/>

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   You  ──►  [ GlassLM Masker ]  ──►  AI Provider           │
│                    │                                        │
│              detects 35+ PII                                │
│              types in-browser                               │
│                    │                                        │
│   You  ◄──  [ Unmasker ]       ◄──  AI Response            │
│                                                             │
│         Nothing sensitive ever leaves your device.          │
└─────────────────────────────────────────────────────────────┘
```

</div>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />
</div>

<br/>

## ◈ See it in action

<div align="center">

| | Before | After (what AI sees) |
|:---:|:---|:---|
| 💬 | `My email is john@corp.com` | `My email is [[EMAIL_1]]` |
| 🔑 | `API key: sk-abc123...xyz789` | `API key: [[API_KEY_2]]` |
| 🪪 | `Aadhaar: 2345 6789 0123` | `Aadhaar: [[AADHAAR_3]]` |
| 💳 | `Card: 4111 1111 1111 1111` | `Card: [[CREDIT_CARD_4]]` |
| 🗄️ | `mongodb://admin:pass@host/db` | `[[DB_URL_5]]` |
| 🔐 | `-----BEGIN PRIVATE KEY-----` | `[[PRIVATE_KEY_6]]` |

*Originals are restored in the AI's response before you see it.*

</div>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />
</div>

<br/>

## ◈ Features

<div align="center">

| | | |
|:---:|:---:|:---:|
| 🔒 **Auto-masking** | 👁️ **Full transparency** | 🧠 **Context-aware** |
| 35+ PII types replaced with safe placeholders | See exactly what gets masked before sending | `"password": "abc"` caught. Random `abc` alone — ignored. |
| 🇮🇳 **India-first** | ✅ **Luhn validated** | 🧩 **Browser extension** |
| Aadhaar, PAN, IFSC, UPI, GST built-in | Credit cards verified by checksum, not just pattern | Works on ChatGPT, Claude, Gemini, Perplexity + 20 more |

</div>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />
</div>

<br/>

## ◈ PII detection — 35+ types

<details>
<summary><b>▸ Click to expand full pattern list</b></summary>

<br/>

| Tier | Category | Patterns | Example |
|:---:|:---|:---|:---|
| T1 | AI provider keys | OpenAI, Anthropic, Google, xAI, DeepSeek | `sk-proj-...` |
| T1 | Code platform tokens | GitHub, GitLab, npm | `ghp_...` |
| T1 | Payment keys | Stripe, Razorpay, Twilio, SendGrid | `sk_live_...` |
| T1 | Messaging | Slack tokens + webhooks | `xoxb-...` |
| T1 | Cloud credentials | AWS, Azure, GCP service accounts | `AKIA...` |
| T1 | Cryptographic | Private keys, certificates, JWTs | `-----BEGIN PRIVATE KEY-----` |
| T1 | Database URLs | All connection strings | `postgresql://...` |
| T2 | Personal identifiers | Email, SSN, Credit card, IBAN | `john@corp.com` |
| T3 | Indian identifiers | Aadhaar, PAN, IFSC, UPI, GST | `ABCDE1234F` |
| T4 | Code secrets | JSON / YAML / ENV key-value pairs | `"password": "..."` |
| T5 | Network & infra | IPv4, IPv6, MAC, BTC/ETH addresses | `0x742d35Cc...` |

</details>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />
</div>

<br/>

## ◈ Repository structure

```
glasslm/
│
├── src/                        ← Main React app  (glasslm.space)
│   ├── components/glass/       ← UI: masking preview, chat, modals
│   ├── lib/glass/              ← Core masking engine (runs in-browser)
│   ├── extension/              ← Chrome / Edge browser extension
│   └── pages/                  ← Routes: home, how-it-works, developers
│
└── sdk/
    ├── core/                   ← Framework-agnostic masking engine
    ├── node/                   ← Node.js SDK
    ├── python/                 ← Python SDK
    └── web/                    ← Browser SDK
```

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />
</div>

<br/>

## ◈ Quick start

### Browser extension

Install from the [Edge Add-ons store](https://microsoftedge.microsoft.com/addons/detail/glasslm-a-glassbox-lay/ggigmidkjafhhcimoecdhebocpobland) — or use the [web app](https://glasslm.space) with no install.

<br/>

### Node.js SDK

```bash
npm install @glasslm/node
```

```ts
import { GlassLM } from '@glasslm/node'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: 'sk-...' })
const glass  = new GlassLM({ provider: openai })

const res = await glass.chat({
  messages: [{ role: 'user', content: 'My SSN is 123-45-6789, help me with...' }],
})

// AI received:   'My SSN is [[SSN_1]], help me with...'
// res.content:   Full answer with 123-45-6789 restored
```

<br/>

### Python SDK

```python
from glasslm import autoMask, unmask

result = autoMask("API key: sk-abc123  |  email: john@corp.com")

print(result.text)        # API key: [[API_KEY_1]]  |  email: [[EMAIL_2]]
print(result.risk_score)  # 75
print(result.masked_types) # ['api_key', 'email']
```

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />
</div>

<br/>

## ◈ Local development

```bash
git clone https://github.com/AkshaySasi/GlassLM
cd GlassLM
npm install
npm run dev          # → localhost:8080
```

```bash
# Run SDK tests
cd sdk/core && npm install && npm test
```

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />
</div>

<br/>

## ◈ Privacy guarantees

```
✦  Client-side only    —  masking runs in your browser, never on a server
✦  No storage          —  API keys live in memory only, cleared on tab close
✦  No telemetry        —  no analytics, no tracking, no data collection
✦  Open source         —  every line auditable at github.com/AkshaySasi/GlassLM
```

<br/>

## ◈ Contributing

PRs and issues welcome. Please open an issue first for significant changes.

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=4c1d95&height=2&section=header" width="80%" />

<br/>

**Built in India 🇮🇳 &nbsp;·&nbsp; Open source &nbsp;·&nbsp; Privacy-first**

<br/>

[![Visit glasslm.space](https://img.shields.io/badge/glasslm.space-7c3aed?style=for-the-badge&labelColor=1a0a2e)](https://glasslm.space)
&nbsp;
[![Star on GitHub](https://img.shields.io/github/stars/AkshaySasi/GlassLM?style=for-the-badge&label=Star+on+GitHub&labelColor=1a0a2e&color=7c3aed&logo=github&logoColor=c4b5fd)](https://github.com/AkshaySasi/GlassLM)

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a0a2e,50:4c1d95,100:7c3aed&height=120&section=footer" width="100%" />

</div>
