<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# 🎯 Missed-Opportunity Agent

An intelligent AI agent that reads your task history, content drafts, learning streaks, outreach attempts, and project logs—then surfaces the highest-ROI missed opportunities and provides actionable recovery boosters.

**View in AI Studio:** https://ai.studio/apps/2b2f21c8-fade-49fc-a2e6-4668f453b591

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Gemini API key (optional for mock mode)

### Installation

1. **Clone and install:**
   ```bash
   npm install
   ```

2. **Configure API key:**
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📡 API Endpoints

### 1. **Analyze Digital Exhaust**
Detects missed opportunities from your notes/logs.

**Endpoint:** `POST /api/analyze-exhaust`

**Request:**
```json
{
  "exhaustText": "I built a Python script for data processing but never automated it. Also drafted a product strategy doc that sits in Notion."
}
```

**Response:**
```json
{
  "opportunities": [
    {
      "title": "Automated Data Ingestion Script",
      "description": "Python utility built for weekly reports (85% done)",
      "type": "office",
      "source": "github",
      "futureUpside": 9,
      "momentumRetention": 8,
      "effortRequired": 3,
      "decayRisk": "low",
      "whyItMatters": "Currently bleeding 2 hours every Monday",
      "activationTask": "Fix path variables and test",
      "guidanceInstructions": "```python\n# Template code...",
      "analysisExplanation": "Nearly complete—activation energy is minimal"
    }
  ],
  "isMock": false
}
```

---

### 2. **Generate Recovery Boost**
Creates actionable recovery plans (code, email, action-plan).

**Endpoint:** `POST /api/generate-boost`

**Request:**
```json
{
  "opportunity": { /* opportunity object from above */ },
  "boostType": "action-plan",
  "userNotes": "I have 30 mins free on Friday afternoon"
}
```

**Boost Types:**
- `code`: Starter code template or script
- `email`: Outreach template for ghosted threads
- `action-plan`: Micro 15-minute task breakdown

**Response:**
```json
{
  "boost": "### ⚡ 15-Minute Action Plan\n\n**Step 1:** ...",
  "isMock": false
}
```

---

### 3. **Health Check**
Verify server and API key status.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-07T10:30:00Z",
  "hasGeminiKey": true
}
```

---

## 🧠 How It Works

### Recovery Score Calculation
```
Recovery Score = (Upside × Momentum) ÷ Effort

Example:
- Upside: 9 (high career impact)
- Momentum: 8 (85% done)
- Effort: 3 (low activation energy)
= (9 × 8) ÷ 3 = 24.0
```

Higher scores = more valuable recovery targets.

---

## 🎨 Architecture

```
┌─────────────────────────────────────────┐
│   Frontend (React + Tailwind + Vite)    │
│   - Input text analysis                 │
│   - Opportunity display                 │
│   - Boost generation UI                 │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│   Backend (Express + TypeScript)        │
│   - /api/analyze-exhaust                │
│   - /api/generate-boost                 │
│   - /api/health                         │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│   Gemini API (LLM Analysis)             │
│   - Digital exhaust parsing             │
│   - Recovery boost generation           │
│   - Fallback mock mode (no key needed)  │
└─────────────────────────────────────────┘
```

---

## 🔧 Development

### Scripts
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build frontend & bundle server
npm run start        # Run production server
npm run lint         # Type-check TypeScript
npm run typecheck    # Full type validation
```

### Project Structure
```
.
├── server.ts          # Express API + Gemini integration
├── src/               # React frontend (vite build)
├── dist/              # Production build output
├── package.json       # Dependencies & scripts
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite build configuration
└── README.md          # This file
```

---

## 🛡️ Features

✅ **AI-Powered Analysis**
- Identifies half-finished projects, drafts, and abandoned tasks
- Calculates recovery scores based on impact × effort

✅ **Actionable Boosters**
- Starter code for broken projects
- Email templates for cold outreach
- 15-minute action plans to push projects live

✅ **Mock Mode**
- Works without Gemini API key
- High-quality fallback analysis for testing

✅ **Type-Safe**
- Full TypeScript support
- Strict type validation for all responses

✅ **Production-Ready**
- Express + Vite integration
- Graceful error handling
- Comprehensive logging

---

## 🚨 Error Handling

The agent gracefully falls back to high-quality mock responses if:
- `GEMINI_API_KEY` is not set
- API quota is exceeded
- Network issues occur

Check `GET /api/health` to verify API key status.

---

## 📝 Example Use Cases

### 1. Analyzing a Slack/Notion Brain Dump
```bash
curl -X POST http://localhost:3000/api/analyze-exhaust \
  -H "Content-Type: application/json" \
  -d '{
    "exhaustText": "TODO: finish ML course, half-built web scraper in github, draft blog post on async patterns, emails to Jessica and Tom"
  }'
```

### 2. Getting an Email Outreach Template
```bash
curl -X POST http://localhost:3000/api/generate-boost \
  -H "Content-Type: application/json" \
  -d '{
    "opportunity": { /* opportunity object */ },
    "boostType": "email",
    "userNotes": "Haven'\''t spoken since conference 6 months ago"
  }'
```

---

## 🔐 Environment Variables

```env
GEMINI_API_KEY    # Your Google Gemini API key (optional)
PORT              # Server port (default: 3000)
NODE_ENV          # "development" or "production"
```

---

## 📚 Technologies

- **Backend:** Express.js, TypeScript
- **Frontend:** React, Vite, Tailwind CSS
- **AI:** Google Gemini API
- **Tooling:** esbuild, tsx, Lucide icons

---

## 🤝 Contributing

Have ideas for improving opportunity detection? Open an issue or PR!

---

## 📄 License

Open source. See repository for details.

---

## 🎯 Next Steps

1. Set your `GEMINI_API_KEY` in `.env.local`
2. Run `npm run dev`
3. Feed your digital exhaust into the agent
4. Pick the highest-recovery opportunity
5. Use the boost to push it across the finish line

**Remember:** The cost is already 90% paid. Finishing is leverage.
