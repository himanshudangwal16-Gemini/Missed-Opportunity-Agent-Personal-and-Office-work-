import React, { useState, useEffect } from "react";
import { Opportunity } from "../types";
import { 
  X, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Copy, 
  Check, 
  ArrowLeft,
  Mail,
  Code2,
  ListTodo,
  RotateCcw
} from "lucide-react";
import { motion } from "motion/react";

interface RecoveryWorkspaceProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onConfirmRecovery: (id: string, notes?: string) => void;
  onSnooze: (opp: Opportunity) => void;
}

export const RecoveryWorkspace: React.FC<RecoveryWorkspaceProps> = ({
  opportunity,
  onClose,
  onConfirmRecovery,
  onSnooze
}) => {
  const [boostType, setBoostType] = useState<'code' | 'email' | 'action-plan'>('code');
  const [userContext, setUserContext] = useState("");
  const [boosterLoading, setBoosterLoading] = useState(false);
  const [boosterOutput, setBoosterOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [userNotes, setUserNotes] = useState("");

  // Terminals simulated log statements during loading
  const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);

  useEffect(() => {
    // Reset states when opportunity shifts
    setBoosterOutput(null);
    setUserContext("");
    setSimulatedLogs([]);
  }, [opportunity]);

  if (!opportunity) return null;

  // Handles copying bootstrap blocks
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeBooster = async () => {
    setBoosterLoading(true);
    setBoosterOutput(null);
    setSimulatedLogs(["[BOOT] Contacting server AI proxy..."]);

    // Animate terminal-style diagnostic logs
    const logs = [
      "[INFO] Resolving opportunity variables...",
      `[INFO] Analyzing Activation Index: ${opportunity.effortRequired}/10`,
      "[INFO] Instantiating server-side context model 'gemini-3.5-flash'...",
      "[INFO] Formulating zero-friction 15-minute rescue action...",
      "[SUCCESS] Guidance blueprint computed."
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setSimulatedLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    try {
      const response = await fetch("/api/generate-boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunity,
          boostType,
          userNotes: userContext
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate custom boost context from server.");
      }

      const data = await response.json();
      setBoosterOutput(data.boost);
    } catch (err: any) {
      setBoosterOutput(`### Error generating custom bootstrap\n\n${err?.message || "Failed to reach backend compiler."}`);
    } finally {
      clearInterval(interval);
      setBoosterLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl relative">
      
      {/* Title Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">Recovery Console</span>
        </div>
        
        <button
          onClick={onClose}
          className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
        
        {/* Opp Header Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-500 capitalize px-2 py-0.5 bg-amber-500/5 rounded border border-amber-900/40">
              {opportunity.type === "office" ? "Office Work" : "Personal Growth"}
            </span>
            <span className="text-[10px] font-mono text-teal-400 font-bold">
              ROI Score: {opportunity.recoveryScore.toFixed(1)}
            </span>
          </div>

          <h2 className="text-lg font-sans font-semibold text-neutral-100">{opportunity.title}</h2>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">{opportunity.description}</p>
        </div>

        {/* Why finalization yields leverage */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 space-y-1">
          <span className="text-[10px] font-mono text-neutral-500 uppercase block">The 85% Rule Sunk Cost Leak</span>
          <p className="text-xs text-neutral-300 leading-relaxed italic">{opportunity.whyItMatters}</p>
        </div>

        {/* Action Goal Checklist item */}
        <div className="border border-amber-500/20 bg-amber-500/[0.01] p-4 rounded-xl space-y-2">
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-semibold">15-Minute Goal Target</span>
          <p className="text-xs text-neutral-200 leading-relaxed font-semibold">{opportunity.activationTask}</p>
        </div>

        {/* Integrated Bootstrap Snippets / Templates */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-semibold">Standard Bootstrap Block</h3>
            <button
              onClick={() => handleCopyText(opportunity.guidanceInstructions)}
              className="flex items-center gap-1.5 px-2 py-1 bg-neutral-950 border border-neutral-800 hover:bg-neutral-850 rounded text-[10px] font-mono text-neutral-400 hover:text-white transition"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-teal-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Snippet
                </>
              )}
            </button>
          </div>

          {/* Render code or markdown instructions */}
          <div className="bg-neutral-950 border border-neutral-850 rounded-xl p-4 text-xs font-mono text-left overflow-x-auto text-neutral-300 leading-relaxed max-h-60 scrollbar-thin">
            <pre className="whitespace-pre-wrap">{opportunity.guidanceInstructions}</pre>
          </div>
        </div>

        {/* Interactive AI booster console */}
        <div className="border-t border-neutral-800 pt-6 space-y-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-500/10 animate-pulse" />
            <h3 className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-semibold">Interactive Gemini Rescue Booster</h3>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Need customized aid? Describe any constraints (e.g., &ldquo;Compose a message for Marcus Zhao&rdquo; or &ldquo;Create a Python script partition configuration&rdquo;) and compile instant boost models.
          </p>

          {/* Interactive tabs for custom boost strategy */}
          <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-1 rounded-lg border border-neutral-850">
            <button
              id="boost-tab-code"
              onClick={() => setBoostType('code')}
              className={`flex flex-col items-center justify-center p-2 rounded text-[10px] font-sans font-medium transition ${
                boostType === 'code' ? 'bg-neutral-850 text-amber-400 font-semibold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 mb-1" />
              Write Script
            </button>

            <button
              id="boost-tab-email"
              onClick={() => setBoostType('email')}
              className={`flex flex-col items-center justify-center p-2 rounded text-[10px] font-sans font-medium transition ${
                boostType === 'email' ? 'bg-neutral-850 text-amber-400 font-semibold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Mail className="w-3.5 h-3.5 mb-1" />
              Outreach Draft
            </button>

            <button
              id="boost-tab-action"
              onClick={() => setBoostType('action-plan')}
              className={`flex flex-col items-center justify-center p-2 rounded text-[10px] font-sans font-medium transition ${
                boostType === 'action-plan' ? 'bg-neutral-850 text-amber-400 font-semibold' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5 mb-1" />
              15m Plan
            </button>
          </div>

          {/* Context input box */}
          <div className="space-y-3">
            <textarea
              id="booster-context-textarea"
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder={
                boostType === "code" 
                  ? "E.g. Help me write the dynamic AWS Lambda handler parameters..." 
                  : boostType === "email"
                  ? "E.g. Compose scheduling choices for Tuesday mornings. Casual but premium corporate tone..."
                  : "E.g. Detail 3 microscopic terminal commands to push from index to production..."
              }
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
            />

            <button
              id="btn-trigger-ai-booster"
              onClick={executeBooster}
              disabled={boosterLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-850 border border-neutral-750 text-xs font-sans font-medium rounded-lg text-neutral-200 hover:text-white transition-all disabled:text-neutral-500 hover:border-neutral-700 cursor-pointer"
            >
              {boosterLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Custom Rescue Blueprint...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-current text-amber-500" />
                  Compile Rescue Booster
                </>
              )}
            </button>
          </div>

          {/* Interactive load log feedback */}
          {boosterLoading && (
            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg space-y-1 mt-3">
              {simulatedLogs.map((log, index) => (
                <div key={index} className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5 select-none animate-fade-in">
                  <span className="text-amber-500">▶</span>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Custom Booster Output */}
          {boosterOutput && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-950 border border-neutral-850 p-4 rounded-xl space-y-3 mt-3 relative"
            >
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-2">
                <span className="text-[10px] font-mono text-teal-400 flex items-center gap-1.5 uppercase font-semibold">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" /> Live Custom Boost Renders:
                </span>
                <button
                  onClick={() => handleCopyText(boosterOutput)}
                  className="p-1 px-2.5 bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 text-[9px] font-mono rounded select-all transition"
                >
                  {copied ? "Copied!" : "Copy Boost"}
                </button>
              </div>

              <div className="text-xs font-sans text-neutral-300 space-y-2 leading-relaxed overflow-x-auto whitespace-pre-wrap text-left max-h-72 scrollbar-thin">
                {boosterOutput}
              </div>
            </motion.div>
          )}

        </div>

        {/* Accomplished Execution closure interface */}
        <div className="border-t border-neutral-800 pt-6 mt-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-semibold">Verify Accomplishment</h3>
            <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
              Have you executed your 15-minute activation goal? Enter notes to track your progress and lock this win in!
            </p>
          </div>

          <textarea
            id="recovery-notes-textarea"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="E.g. Sent the scheduling email with my Calendly link! Done in 8 minutes."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 font-mono"
            rows={2}
          />

          <div className="flex items-center gap-3">
            <button
              id="btn-cancel-recovery"
              onClick={onClose}
              className="flex-1 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700 text-xs font-sans font-medium rounded-xl transition"
            >
              Keep Pending
            </button>
            <button
              id="btn-confirm-recovery"
              onClick={() => onConfirmRecovery(opportunity.id, userNotes)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-sans font-semibold rounded-xl transition shadow-lg shrink-0 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Deploy & Recover Sunk Cost!
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
