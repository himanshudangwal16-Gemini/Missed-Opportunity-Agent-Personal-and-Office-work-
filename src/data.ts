import { Opportunity } from "./types";

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "seed-1",
    title: "Weekly Engineering Slack Sync script",
    description: "An automated Node/TypeScript utility script to compile weekly developer git logs and pipe them beautifully formatted into the engineering management channel.",
    type: "office",
    source: "github",
    futureUpside: 8,
    momentumRetention: 9, // 90% rule
    effortRequired: 2,    // very low activation energy needed
    decayRisk: "med",
    recoveryScore: 36,    // (8 * 9) / 2 = 36
    whyItMatters: "You spent 12 hours coding this integration. Currently, you waste 45 minutes every single Friday afternoon manually formatting markdown logs. Completing the remaining environment token configs returns your sunk-cost hours in less than 4 weeks.",
    activationTask: "Initialize the Slack dynamic Webhook environment variables and trigger an active dry-run terminal connection test.",
    guidanceInstructions: `### 💻 Slack Webhook Setup Boilerplate
Change your static test config to leverage secure environment variables:

\`\`\`typescript
import { IncomingWebhook } from "@slack/webhook";

const url = process.env.SLACK_WEBHOOK_URL;
if (!url) {
  throw new Error("Missing SLACK_WEBHOOK_URL environment secret!");
}

const webhook = new IncomingWebhook(url);

export async function sendSyncNotification(summary: string) {
  await webhook.send({
    text: "🚀 *Weekly Engineering Report Sync* v1.1.2",
    attachments: [{
      color: "#2eb886",
      text: summary,
      footer: "Missed-Opportunity Agent • Synced automatically"
    }]
  });
}
\`\`\``,
    status: "active",
    dateAdded: "2026-05-20T10:00:00Z",
    dateUpdated: "2026-06-05T18:00:00Z",
    notes: "A simple environment configuration token fix handles the deployment block."
  },
  {
    id: "seed-2",
    title: "Venture Partner Outreach Follow-up",
    description: "High-yield investment discussion draft with Jane Zhao (Partner at TechVenture Group) who enthusiastically asked for your pitch data deck, but remained ghosted due to inbox overwhelm.",
    type: "office",
    source: "outreach",
    futureUpside: 10,
    momentumRetention: 8,
    effortRequired: 3,
    decayRisk: "high",
    recoveryScore: 26.7, // (10 * 8) / 3 = 26.7
    whyItMatters: "Jane represents a top-tier venture partnership possibility. You already cleared her hardest obstacle: gaining her explicit validation and intent. Each additional day of silent hesitation compounds your decay risk by ~10%. She was interested, she's currently just busy.",
    activationTask: "Draft a high-context 3-sentence response with a direct calendar Link, and fire it.",
    guidanceInstructions: `### ✉️ Pitch Follow-Up Email Template
Customize this text copy and hit send immediately on your mail client:

> **Subject**: Follow-up: Core Tech Demo & Pitch Data
>
> Hi Jane,
>
> Apologies for the short delay on my end—I was in the lab finalizing our high-performance stress benchmark results for our server container cluster. 
>
> I've compiled our core product metrics and performance data cases. I'd love to show you a quick 10-minute preview. Are you free for a brief sync next week? Here are three direct options:
>
> * Monday afternoon (2:00 PM - 5:00 PM EST)
> * Wednesday morning (9:00 AM - 11:30 AM EST)
> * Link to my calendar: [insert link]
>
> Best regards,  
> [Your Name]`,
    status: "active",
    dateAdded: "2026-06-01T12:00:00Z",
    dateUpdated: "2026-06-05T19:22:00Z",
    notes: "Overcome fear of rejection. Jane made the first move by asking; she is warm."
  },
  {
    id: "seed-3",
    title: "Postgres index query & optimization deployment",
    description: "Theoretical schema learnings from your advanced database indexing program last month that have not yet been integrated into your core product SQL definitions.",
    type: "personal",
    source: "learning",
    futureUpside: 7,
    momentumRetention: 10,
    effortRequired: 2,
    decayRisk: "med",
    recoveryScore: 35, // (7 * 10) / 2 = 35
    whyItMatters: "Sunk-cost optimization knowledge degrades heavily if it remains unapplied. You spent 15 hours securing this certification. Adding a concurrent index to your production database takes 5 minutes but results in an immediate 40x speed boost on query executions.",
    activationTask: "Deploy a concurrent, high-leverage indexing query pattern to your core users table.",
    guidanceInstructions: `### 🗄️ Concurrent Index Optimization Schema
Run this standard DDL commands on your PostgreSQL console to instantly accelerate search:

\`\`\`sql
-- Create non-blocking performance index on your most queried table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_dashboard
ON users (status, last_login_date DESC);

-- Analyze database plans to verify index penetration
EXPLAIN ANALYZE 
SELECT id, email, status FROM users 
WHERE status = 'active' 
ORDER BY last_login_date DESC 
LIMIT 20;
\`\`\``,
    status: "active",
    dateAdded: "2026-05-25T08:00:00Z",
    dateUpdated: "2026-06-04T12:00:00Z",
    notes: "Practical code deployments freeze memories into actual operational talent."
  },
  {
    id: "seed-4",
    title: "React Signals State Performance Draft",
    description: "An analytical technical article draft comparing modern Signals performance overhead against classic Redux structures (1,200 words drafted in Notion notes, left unpublished).",
    type: "personal",
    source: "notion",
    futureUpside: 8,
    momentumRetention: 8,
    effortRequired: 3,
    decayRisk: "high",
    recoveryScore: 21.3, // (8 * 8) / 3 = 21.3
    whyItMatters: "Active developer thought-leadership decays rapidly as technical discussions evolve. You already paid 80% of the research & content-writing cost. Getting this published to Dev.to or Medium targets contemporary state discussions, generating immediate resume leverage.",
    activationTask: "Write a snappy TL;DR executive summary paragraph, paste the draft in Dev.to, and hit publish.",
    guidanceInstructions: `### ✍️ Snippet: Snappy TL;DR Article Hook
Add this high-engagement block to the top of your Notion document to finalize:

> **Summary**: Component re-render bloat remains a leading cause of UI freezing in complex dashboards. In this publication, we walk through live performance parameters, illustrating why transitioning our state management from Redux to micro-reactive signals slashed render overhead by **68%** inside real-time collaborative canvasses.`,
    status: "active",
    dateAdded: "2026-05-15T09:00:00Z",
    dateUpdated: "2026-06-03T15:10:00Z",
    notes: "Don't aim for academic precision. Polish the key code blocks and release the value."
  }
];
