import React, { useState } from "react";
import { Opportunity } from "../types";
import { 
  Zap, 
  Trash2, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  HelpCircle,
  FileText,
  Github,
  Mail,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DailyBriefProps {
  opportunity: Opportunity | null;
  onRecover: (opp: Opportunity) => void;
  onArchive: (opp: Opportunity) => void;
  onPostpone: (opp: Opportunity) => void;
  isLoading: boolean;
}

export const DailyBrief: React.FC<DailyBriefProps> = ({
  opportunity,
  onRecover,
  onArchive,
  onPostpone,
  isLoading
}) => {
  const [showClosure, setShowClosure] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-8 text-center">
        <div className="w-12 h-12 border-2 border-neutral-700 border-t-amber-500 rounded-full animate-spin mb-4" />
        <h3 className="text-lg font-sans font-medium text-neutral-200">Finding unrealized leverage...</h3>
        <p className="text-sm text-neutral-400 mt-1">Scanning digital graveyard databases</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/40 rounded-2xl border border-neutral-800 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400 mb-4">
          <Zap className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-sans font-medium text-neutral-200">All Leverage Realized!</h3>
        <p className="text-sm text-neutral-400 mt-1 max-w-md">
          Outstanding. There are no pending missed opportunities left to recover. Clear your exhaust pipeline to ingest more data or add items manually.
        </p>
      </div>
    );
  }

  // Determine Source Icon
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "notion": return <FileText className="w-4 h-4 text-emerald-400" />;
      case "github": return <Github className="w-4 h-4 text-sky-400" />;
      case "outreach": return <Mail className="w-4 h-4 text-amber-400" />;
      case "learning": return <GraduationCap className="w-4 h-4 text-purple-400" />;
      default: return <HelpCircle className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "notion": return "Draft Notes Link";
      case "github": return "Git Repository Logs";
      case "outreach": return "Outreach Thread";
      case "learning": return "Sunk Certification Skill";
      default: return "Digital Paper Trail";
    }
  };

  const getDecayBadgeColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-950/40 text-red-400 border border-red-900/50";
      case "med": return "bg-amber-950/40 text-amber-400 border border-amber-900/50";
      default: return "bg-sky-950/40 text-sky-400 border border-sky-900/50";
    }
  };

  return (
    <div className="relative">
      <motion.div 
        key={opportunity.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        className="bg-neutral-900/70 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500via-amber-500 to-rose-500" />
        
        <div className="p-6 md:p-8">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="flex items-center gap-2 px-3 py-1 bg-neutral-800/80 rounded-full border border-neutral-700 text-xs font-mono text-neutral-300">
              {getSourceIcon(opportunity.source)}
              <span className="capitalize">{getSourceLabel(opportunity.source)}</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400">Decay Risk:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono uppercase ${getDecayBadgeColor(opportunity.decayRisk)}`}>
                {opportunity.decayRisk}
              </span>
            </div>
          </div>

          {/* Core presentation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Columns: Detail content */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <h1 className="text-2xl md:text-3xl font-sans font-semibold tracking-tight text-neutral-100 max-w-2xl leading-tight">
                  📉 Unrealized Value Alert: <span className="text-amber-400">The 85% Rule</span>
                </h1>
                <p className="text-lg text-neutral-300 font-sans mt-2 font-medium">
                  {opportunity.title}
                </p>
                <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                  {opportunity.description}
                </p>
              </div>

              {/* Formula and Sunk Cost Leverage description */}
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-3">
                <span className="text-xs font-mono text-neutral-400 tracking-wider block uppercase">Why It Matters</span>
                <p className="text-sm font-sans text-neutral-300 leading-relaxed">
                  {opportunity.whyItMatters}
                </p>
              </div>

              {/* Action Section */}
              <div className="border border-amber-500/10 bg-amber-500/[0.02] p-5 rounded-xl space-y-3">
                <span className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4 animate-pulse fill-amber-500/20" /> Immediate Recovery Protocol (~15 Min Activation)
                </span>
                <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                  {opportunity.activationTask}
                </p>
              </div>
            </div>

            {/* Right 4 Columns: Scoring metrics */}
            <div className="lg:col-span-4 bg-neutral-950/30 border border-neutral-800 rounded-xl p-5 space-y-6">
              
              {/* Radial Big Score */}
              <div className="text-center space-y-1">
                <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase block">Composite Recovery Score</span>
                <div className="relative inline-flex items-center justify-center p-3">
                  {/* Gauge */}
                  <div className="w-24 h-24 rounded-full border-4 border-neutral-800 flex flex-col items-center justify-center bg-neutral-950">
                    <span className="text-3xl font-mono font-bold text-teal-400">
                      {opportunity.recoveryScore.toFixed(1)}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-500">MAX 100.0</span>
                  </div>
                  
                  {/* Visual pulses around score */}
                  <span className="absolute w-[100px] h-[100px] rounded-full border-2 border-teal-500/10 animate-ping duration-2000 pointer-events-none" />
                </div>
              </div>

              {/* In-depth meters */}
              <div className="space-y-4 text-xs font-mono">
                {/* Future Upside */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>Future Upside (Leverage):</span>
                    <span className="text-teal-400 font-bold">{opportunity.futureUpside}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${opportunity.futureUpside * 10}%` }} />
                  </div>
                </div>

                {/* Momentum Retention - how much is already done */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>Momentum Retention (Sunk Cost):</span>
                    <span className="text-amber-400 font-bold">{opportunity.momentumRetention * 10}% Paid</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${opportunity.momentumRetention * 10}%` }} />
                  </div>
                </div>

                {/* Effort Required */}
                <div className="space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>Activation Effort (Obstacle):</span>
                    <span className="text-rose-400 font-bold">{opportunity.effortRequired}/10</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${opportunity.effortRequired * 10}%` }} />
                  </div>
                </div>
              </div>

              {/* Core Equation display */}
              <div className="text-[10px] font-mono text-neutral-500 text-center border-t border-neutral-800/80 pt-4 leading-relaxed">
                {"$$\\text{Score} = \\frac{\\text{Upside} \\times \\text{Momentum}}{\\text{Effort}}$$"}
                <div className="mt-1 text-neutral-400 font-bold">
                  ({opportunity.futureUpside} × {opportunity.momentumRetention}) ÷ {opportunity.effortRequired} = {opportunity.recoveryScore.toFixed(2)}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-neutral-800">
            <button
              id="btn-recover-daily"
              onClick={() => onRecover(opportunity)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-sans font-semibold rounded-xl text-sm transition-all shadow-lg active:scale-[0.98] cursor-pointer"
            >
              🚀 Recover It Now!
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <button
                id="btn-snooze-daily"
                onClick={() => onPostpone(opportunity)}
                className="flex-1 sm:flex-none px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 hover:text-white font-sans font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                Snooze Today
              </button>

              <button
                id="btn-archive-daily"
                onClick={() => setShowClosure(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-neutral-950 hover:bg-red-950/20 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900/30 font-sans font-medium rounded-xl text-xs transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Let It Go (Archive)
              </button>
            </div>
          </div>

        </div>
      </motion.div>

      {/* Psychological Closure Confirmation Modal */}
      <AnimatePresence>
        {showClosure && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl relative"
            >
              <h3 className="text-lg font-sans font-semibold text-neutral-100 flex items-center gap-2">
                🍂 Choosing Psychological Closure
              </h3>
              
              <p className="text-sm text-neutral-300 leading-relaxed">
                Keeping dozens of half-finished drafts and side-ideas causes unaddressed cognitive friction. By choosing to <strong className="text-rose-400 font-semibold">archive and let go</strong> of *&ldquo;{opportunity.title}&rdquo;*, you are clearing valuable mental capacity to focus on your actual active targets.
              </p>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800/60">
                <span className="text-[11px] font-mono text-neutral-500 uppercase block tracking-wider mb-1">Mantra / Relief</span>
                <p className="text-xs italic text-neutral-400 leading-relaxed font-sans">
                  &ldquo;I have paid the cost, learned the lessons, and I release the expectation. This is no longer sitting uncompleted in my mind.&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  id="btn-confirm-closure-cancel"
                  onClick={() => setShowClosure(false)}
                  className="px-3.5 py-2 hover:bg-neutral-800 rounded-lg text-xs font-sans font-medium text-neutral-400 hover:text-neutral-200 border border-transparent hover:border-neutral-700 transition"
                >
                  Go Back
                </button>
                <button
                  id="btn-confirm-closure"
                  onClick={() => {
                    setShowClosure(false);
                    onArchive(opportunity);
                  }}
                  className="px-4 py-2 bg-red-650 hover:bg-red-500 text-white rounded-lg text-xs font-sans font-semibold border border-red-700 hover:border-red-500 transition shadow-lg shadow-red-950/20 cursor-pointer"
                >
                  Release Forever
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
