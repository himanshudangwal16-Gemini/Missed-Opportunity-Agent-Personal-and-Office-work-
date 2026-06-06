import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will run with fallback placeholders.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY_FOR_SAFETY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. Live Ingestion Endpoint (The Digital Paper Trail parser)
app.post("/api/analyze-exhaust", async (req: Request, res: Response) => {
  const { exhaustText } = req.body;
  if (!exhaustText || typeof exhaustText !== "string" || exhaustText.trim() === "") {
    return res.status(400).json({ error: "No exhaust text provided for analysis." });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      // Return high-quality, simulated intelligent parsing if API key is not configured yet
      const mockResult = generateMockAnalysis(exhaustText);
      return res.json({ opportunities: mockResult, isMock: true });
    }

    const ai = getGeminiClient();
    const systemInstruction = 
      "You are the Missed-Opportunity Agent, a specialized cognitive asset optimizer. " +
      "Your core focus is resource optimization: identifying forgotten side-projects, incomplete tools, unapplied skills, draft articles, and cold networking threads to stop the bleed of sunk cost. " +
      "You analyze digital exhaust, calculate their composite Recovery Score = (Upside * Momentum) / Effort. " +
      "Output snappy, practical, non-clinical recommendations. Emphasize why the cost is already 90% paid and how they can get a quick win.";

    const prompt = `Analyze the following digital trail and extract 1 to 3 distinct completed-but-unreleased or half-filled missed opportunities.
Digital Exhaust input:
"${exhaustText}"

Analyze this digital trail carefully. Produce an array of opportunities. Match the requested JSON Schema precisely.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "An impact-oriented, snappy title identifying the opportunity (e.g. '85% Complete Financial Model' or 'Google Workspace Setup script')" },
              description: { type: Type.STRING, description: "A summary of what was left unused or half-finished" },
              type: { type: Type.STRING, description: "Must be exactly 'office' or 'personal'" },
              source: { type: Type.STRING, description: "Must be one of: 'notion', 'github', 'outreach', 'learning', 'other'" },
              futureUpside: { type: Type.INTEGER, description: "Potential value/career/ROI from 1 to 10" },
              momentumRetention: { type: Type.INTEGER, description: "How close this is to completion, from 1 to 10 (e.g., 8 means 80% done)" },
              effortRequired: { type: Type.INTEGER, description: "Activation energy needed to push it over the finish line, from 1 to 10 (where 1 is trivial, 10 is massive work)" },
              decayRisk: { type: Type.STRING, description: "Must be exactly 'high', 'med', or 'low'" },
              whyItMatters: { type: Type.STRING, description: "Describe the sunk-cost leak and the ROI of finalizing it" },
              activationTask: { type: Type.STRING, description: "A simple, highly actionable starter task that takes ~15 minutes" },
              guidanceInstructions: { type: Type.STRING, description: "Provides bootstrap help (such as a starter code template, an email draft, or terminal command configuration)" },
              analysisExplanation: { type: Type.STRING, description: "An encouraging note on why finalize this" }
            },
            required: [
              "title", "description", "type", "source", "futureUpside", "momentumRetention", "effortRequired", "decayRisk", "whyItMatters", "activationTask", "guidanceInstructions", "analysisExplanation"
            ]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text returned from Gemini API");
    }

    const parsed = JSON.parse(text);
    return res.json({ opportunities: parsed, isMock: false });
  } catch (error: any) {
    console.error("Gemini Ingestion analysis failed:", error);
    // Fallback gracefully to high quality parser simulation
    const mockResult = generateMockAnalysis(exhaustText);
    return res.json({ opportunities: mockResult, isMock: true, error: error.message });
  }
});

// 2. Help/Kickstart Optimizer Endpoint (The Booster)
app.post("/api/generate-boost", async (req: Request, res: Response) => {
  const { opportunity, boostType, userNotes } = req.body;
  if (!opportunity) {
    return res.status(400).json({ error: "Opportunity data is required to generate a boost." });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.json({ 
        boost: `### 🚀 Quick Boost Plan: ${opportunity.title}\n\nHere is your immediate action file for **${opportunity.title}** focus.\n\n* **Goal**: Beat the activation block and secure that 15-minute quick win.\n* **Action Plan**: \n  1. Fix the single path parameter identified in your Obsidian file.\n  2. Deploy code using the pre-configured terminal parameters below.\n\n\`\`\`bash\n# Run local sandbox diagnostic testing\nnode --inspect index.js --sandbox-mode\n\`\`\`\n\n* **Draft message**:\n> \"Hey there! Checking in on our project. I've finished the draft and added the asset integrations. Let me know when you have 5 minutes to connect!\"`,
        isMock: true 
      });
    }

    const ai = getGeminiClient();
    const prompt = `You are the Missed-Opportunity Agent. Help the user overcome the activation barrier (the "Activation Energy" of ${opportunity.effortRequired}/10) for this opportunity:
Title: ${opportunity.title}
Why it matters: ${opportunity.whyItMatters}
Requested Boost Type: ${boostType} (options: code, email, action-plan)
User Notes/Context: ${userNotes || "None provided"}

Generate a highly specific, customized boost output. 
- If 'code', provide a robust, self-contained TypeScript or clean scripting snippet to configure or bootstrap the fix.
- If 'email', write a professional but casual, authentic outreach template (e.g. for ghosted threads or email drafts) with brackets for personalization.
- If 'action-plan', write a microscopic 3-step sequence of tasks to push the project live in exactly 15 minutes, with zero distractions.

Output in standard, clean Markdown. Do not praise yourself or apologize. Keep it exceptionally sharp and direct.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return res.json({ boost: response.text, isMock: false });
  } catch (error: any) {
    console.error("Gemini Boost failed:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Fallback high-quality mock analytical algorithm if no API key is specified yet.
function generateMockAnalysis(text: string): any[] {
  const inputLower = text.toLowerCase();
  
  // Custom smart-matching based on input text keywords
  if (inputLower.includes("notion") || inputLower.includes("draft") || inputLower.includes("document") || inputLower.includes("article")) {
    return [
      {
        title: "Ghosted Product Strategy Blueprint",
        description: "A meticulously outlined product launch document in your Obsidian vault that is 90% completed but sitting unpublished.",
        type: "office",
        source: "notion",
        futureUpside: 8,
        momentumRetention: 9,
        effortRequired: 2,
        decayRisk: "high",
        whyItMatters: "The market context is trending as we speak. Leaving this as a draft retains 0% of its intellectual property value. Sharing it on LinkedIn or sending it to your VP demonstrates massive proactive strategic ownership.",
        activationTask: "Spend 10 minutes checking the references, insert a call-to-action concluding paragraph, and publish it.",
        guidanceInstructions: "## Concluding Draft Call-To-Action Template:\n\n*\"If you're building in this space or tackling the same problem, I'd love to swap insights. Feel free to reply here or shoot me a DM.\"*",
        analysisExplanation: "Your draft is essentially ready for distribution. You are letting imposter syndrome lock up 10+ hours of creative output."
      }
    ];
  } else if (inputLower.includes("python") || inputLower.includes("script") || inputLower.includes("git") || inputLower.includes("code") || inputLower.includes("github")) {
    return [
      {
        title: "Automated Data Ingestion Script",
        description: "A Python automation utility built for weekly report compilation that is 85% done but left unused because of a minor path error.",
        type: "office",
        source: "github",
        futureUpside: 9,
        momentumRetention: 8,
        effortRequired: 3,
        decayRisk: "low",
        whyItMatters: "You have spent 12 hours coding it but currently bleed 2 hours every single Monday compilation. Finalizing this returns your sunk-cost time in less than 6 weeks.",
        activationTask: "Change hardcoded directories to dynamic project-root relative variables and run the dry run diagnostic.",
        guidanceInstructions: "```python\n# Replace absolute paths with local relative configuration:\nimport os\nfrom pathlib import Path\n\nPROJECT_ROOT = Path(__file__).resolve().parent\nDATA_DIR = PROJECT_ROOT / 'data'\nprint(f'Ingesting files from safe directory: {DATA_DIR}')\n```",
        analysisExplanation: "This script is extremely close to the finish line. Turning it into a cron task solves the drag of manual extraction forever."
      }
    ];
  } else if (inputLower.includes("learn") || inputLower.includes("course") || inputLower.includes("cert") || inputLower.includes("sql") || inputLower.includes("cloud")) {
    return [
      {
        title: "Unapplied Cloud Architecture Mastery",
        description: "You completed an advanced cloud serverless deployment certificate last month, but your actual portfolio doesn't leverage it yet.",
        type: "personal",
        source: "learning",
        futureUpside: 7,
        momentumRetention: 9,
        effortRequired: 4,
        decayRisk: "med",
        whyItMatters: "Sunk cost of 24 certification hours is rotting. Skills degrade by half every 90 days if not deployed practically. Implementing a simple serverless server anchors the knowledge and boosts resume credibility.",
        activationTask: "Deploy a single-function AWS Lambda or Cloud Run greeting API in a personal repository.",
        guidanceInstructions: "```typescript\n// Serverless deployment script boilerplate\nimport { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';\n\nexport const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {\n  return {\n    statusCode: 200,\n    body: JSON.stringify({ message: 'Live portfolio endpoint connected successfully!' }),\n  };\n};\n```",
        analysisExplanation: "Solidify your learning immediately. Theoretical certifications alone don't write code—applications do."
      }
    ];
  }

  // Generic robust result
  return [
    {
      title: "Archived Outreach & Pitch Deck Portfolio",
      description: "A comprehensive case study and visual portfolio layout built during freelancing prep but never deployed.",
      type: "personal",
      source: "other",
      futureUpside: 8,
      momentumRetention: 8,
      effortRequired: 3,
      decayRisk: "med",
      whyItMatters: "This portfolio layout demonstrates high visual and UX expertise. Keeping it stored locally yields zero opportunities. Deploying it to Vercel/GitHub pages instantly creates a shareable link for warm prospects.",
      activationTask: "Push the local folder to a new public GitHub repository and connect it to a free hosting provider.",
      guidanceInstructions: "## Quick Launch Script:\n```bash\ngit init\ngit add .\ngit commit -m 'Initial release of high-impact portfolio case studies'\ngit branch -M main\ngit remote add origin <your-repo-link>\ngit push -u origin main\n```",
      analysisExplanation: "Your design work has zero visibility. This 15-minute deployment acts as your passive leverage asset around the clock."
    }
  ];
}


// Start express HTTP server and Vite integration API router
async function setupServer() {
  // Vite integration middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Missed-Opportunity Agent server live on port ${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("FATAL: Failed to initiate server container:", err);
});
