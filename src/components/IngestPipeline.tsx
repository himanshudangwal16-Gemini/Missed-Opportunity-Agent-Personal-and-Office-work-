import React, { useState } from "react";
import { 
  Plus, 
  Terminal, 
  Sparkles, 
  FileText, 
  CornerDownRight, 
  Loader2, 
  Zap, 
  Cpu,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { IngestionResult, Opportunity, NewOpportunityInput } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface IngestPipelineProps {
  onIngestCompleted: (opportunities: Opportunity[]) => void;
}

const PRESET_EXHAUSTS = [
  {
    name: "📂 Obsidian Notion Notes Draft",
    text: `Draft dated April 18:
We should theoretically make a webapp scraper tool to extract list pricing from our top 5 suppliers on a regular schedule (using Google Sheets script?). I spent 8 hours setting up the base fetch logic in local node folder 'supplier-pricing-extract', but got hung up connecting the google oauth credentials and parsing the nested supplier pricing grids correctly. Left sitting in local directory ever since. Resumed calling pricing managers manually every Tuesday (takes ~1 hour/week).
Future value: Save 1hr/week, keep supplier lists accurate... 
Momentum state: 80% written, functions: getSuppliers(), parseHTML(), queryRateLimit() are complete. Missing secure spreadsheet append.`,
  },
  {
    name: "📩 LinkedIn outreach thread draft",
    text: `May 5 LinkedIn thread:
Chat history with Marcus Aurelius (Chief Operations VP at LogiChain International):
Marcus: "Hey! Loved your post about route optimization algorithms. We run into warehouse bottleneck delays weekly. Do you have a package or platform layout to coordinate this? Let's talk scale."
My draft reply (never sent, saved in clipboard/Notion context):
Hi Marcus, glad you reached out. Yes we have configured a customizable warehouse throughput node map optimized precisely for LogiChain scales... [unsaved/not sent since May 6 due to pitch deck anxiety...]`,
  },
  {
    name: "🎓 Cloud infrastructure database cert",
    text: `Certification Awarded: Oracle Cloud Architecture and Partitioning Techniques
Completed: May 12, 2026.
Credits earned: 18 hours.
Scope of mastery: Advanced indexing strategies, read-replica clusters, partitioning large datasets, and preventing connection pool starvation.
Unrealized state: I haven't added this certificate to LinkedIn, my portfolio, nor did I implement partitioning on my startup dashboard database (which is slowing down considerably). Sunk cert.`,
  }
];

export const IngestPipeline: React.FC<IngestPipelineProps> = ({ onIngestCompleted }) => {
  const [inputText, setInputText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSimulation, setIsSimulation] = useState(false);
  
  // Stored parsed options before committing to graveyard
  const [extractedOpps, setExtractedOpps] = useState<IngestionResult[]>([]);

  const handleSimulate = (text: string) => {
    setInputText(text);
    setError(null);
    setExtractedOpps([]);
  };

  const handleAnalyze = async () => {
    if (!inputText || inputText.trim() === "") {
      setError("Please input some digital exhaust context first.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setExtractedOpps([]);

    try {
      const response = await fetch("/api/analyze-exhaust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exhaustText: inputText }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive analyzed pipeline response from server API.");
      }

      const resData = await response.json();
      if (resData.error) {
        console.warn("Backend processed with warning:", resData.error);
      }
      setIsSimulation(!!resData.isMock);
      setExtractedOpps(resData.opportunities || []);
    } catch (err: any) {
      setError(err?.message || "Internal error occurred analyzing digital exhaust data.");
    } finally {
      setAnalyzing(false);
    }
  };

  const commitOpportunities = () => {
    const opportunities: Opportunity[] = extractedOpps.map((item, index) => {
      // Formulate composite Score: (Upside * Momentum) / Effort
      const recoveryScore = (item.futureUpside * item.momentumRetention) / item.effortRequired;
      return {
        id: `extracted-${Date.now()}-${index}`,
        title: item.title,
        description: item.description,
        type: item.type,
        source: item.source,
        futureUpside: item.futureUpside,
        momentumRetention: item.momentumRetention,
        effortRequired: item.effortRequired,
        decayRisk: item.decayRisk,
        recoveryScore: parseFloat(recoveryScore.toFixed(1)),
        whyItMatters: item.whyItMatters,
        activationTask: item.activationTask,
        guidanceInstructions: item.guidanceInstructions,
        status: "active",
        dateAdded: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        notes: item.analysisExplanation
      };
    });

    onIngestCompleted(opportunities);
    setExtractedOpps([]);
    setInputText("");
  };

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      
      {/* Visual title & introductory details */}
      <div className="space-y-1">
        <h2 className="text-xl font-sans font-semibold text-neutral-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          Ingest Exhaust Paper Trail
        </h2>
        <p className="text-xs text-neutral-400">
          Paste leftover draft files, unpushed codes, forgotten email communications, or course cert descriptions.
        </p>
      </div>

      {/* Selector presets */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Or select a simulated digital graveyard exhaust</span>
        <div className="flex flex-wrap gap-2">
          {PRESET_EXHAUSTS.map((preset, index) => (
            <button
              id={`btn-preset-exhaust-${index}`}
              key={index}
              onClick={() => handleSimulate(preset.text)}
              className="px-3 py-1.5 bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg text-xs font-sans text-neutral-300 transition-colors text-left flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-amber-500" />
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main text area */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            id="exhaust-textarea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="E.g. I spent 8 hours setting up a scraping cron template, but left it sitting in local folder due to database schema errors. Left incomplete since April..."
            className="w-full h-40 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-mono leading-relaxed"
          />
          {inputText && (
            <button 
              onClick={() => setInputText("")}
              className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-300 self-center text-[10px] font-mono px-2 py-1 bg-neutral-900 rounded border border-neutral-800 transition"
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg flex items-start gap-2 text-xs text-red-500">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            Analyzed by secure server models
          </span>
          
          <button
            id="btn-analyze-exhaust"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 text-xs font-sans font-semibold rounded-xl transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Scanning Exhaust Exhaust...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Analyze Exhaust Trail
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis results waiting for confirmation before graveyard commit */}
      <AnimatePresence>
        {extractedOpps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border border-teal-500/30 bg-teal-500/[0.02] p-5 rounded-xl space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-teal-900/30 pb-3">
              <span className="flex items-center gap-1.5 text-xs font-mono text-teal-400 uppercase tracking-widest font-semibold">
                <Sparkles className="w-4 h-4 fill-teal-500/20" /> OPPORTUNITY EXTRACTED SUCCESSFULLY!
              </span>
              {isSimulation && (
                <span className="text-[10px] font-mono text-amber-500/80 bg-amber-500/5 border border-amber-900/30 px-2 py-0.5 rounded">
                  Simulation Parser Fallback
                </span>
              )}
            </div>

            <div className="space-y-4">
              {extractedOpps.map((opp, idx) => (
                <div key={idx} className="space-y-2 border-l-2 border-teal-500 pl-4 py-1">
                  <h4 className="text-sm font-sans font-semibold text-neutral-100 flex items-center gap-2">
                    {opp.title}
                    <span className="px-2 py-0.5 bg-neutral-800 text-[10px] font-mono text-neutral-300 rounded border border-neutral-700 capitalize">
                      {opp.source}
                    </span>
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">{opp.description}</p>
                  
                  {/* Internal Metrics preview */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[10px] font-mono">
                    <div className="p-1 px-2.5 bg-neutral-950/60 rounded border border-neutral-850">
                      <span className="text-neutral-500">Upside Score: </span>
                      <strong className="text-teal-400">{opp.futureUpside}/10</strong>
                    </div>
                    <div className="p-1 px-2.5 bg-neutral-950/60 rounded border border-neutral-850">
                      <span className="text-neutral-500">Momentum (85% Rule): </span>
                      <strong className="text-amber-400">{opp.momentumRetention * 10}%</strong>
                    </div>
                    <div className="p-1 px-2.5 bg-neutral-950/60 rounded border border-neutral-850">
                      <span className="text-neutral-500">Activation Energy: </span>
                      <strong className="text-rose-400">{opp.effortRequired}/10</strong>
                    </div>
                    <div className="p-1 px-2.5 bg-neutral-950/60 rounded border border-neutral-850">
                      <span className="text-neutral-500">Recovery Score: </span>
                      <strong className="text-pink-400 font-bold">
                        {((opp.futureUpside * opp.momentumRetention) / opp.effortRequired).toFixed(1)}
                      </strong>
                    </div>
                  </div>

                  <div className="bg-neutral-950/40 p-3 rounded border border-neutral-850 space-y-1 mt-2">
                    <span className="text-[9px] font-mono text-neutral-500 tracking-wider uppercase block">Initial 15m Protocol</span>
                    <p className="text-xs text-neutral-300 font-sans italic">{opp.activationTask}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-teal-900/30 pt-4 mt-2">
              <button
                id="btn-cancel-extraction"
                onClick={() => setExtractedOpps([])}
                className="px-4 py-2 hover:bg-neutral-800 rounded-lg text-xs font-sans font-medium text-neutral-400 hover:text-neutral-200 border border-transparent hover:border-neutral-700 transition"
              >
                Reset Pipeline
              </button>
              <button
                id="btn-commit-extraction"
                onClick={commitOpportunities}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-neutral-950 rounded-lg text-xs font-sans font-semibold transition shadow-lg shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Commit to Active Graveyard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
