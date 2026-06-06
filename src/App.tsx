import React, { useState, useEffect, useMemo } from "react";
import { Opportunity } from "./types";
import { SEED_OPPORTUNITIES } from "./data";
import { DailyBrief } from "./components/DailyBrief";
import { IngestPipeline } from "./components/IngestPipeline";
import { GraveyardDashboard } from "./components/GraveyardDashboard";
import { RecoveryWorkspace } from "./components/RecoveryWorkspace";
import { 
  Zap, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  AlertCircle,
  TrendingUp,
  LineChart,
  Github,
  Mail,
  FileText,
  GraduationCap,
  Terminal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [celebration, setCelebration] = useState<{ show: boolean, title: string } | null>(null);

  // Load opportunities from localStorage on mount (or seed data if empty)
  useEffect(() => {
    const raw = localStorage.getItem("missed_opps_agent_vault");
    if (raw) {
      try {
        setOpportunities(JSON.parse(raw));
      } catch (e) {
        console.error("Failed loading from localStorage:", e);
        setOpportunities(SEED_OPPORTUNITIES);
      }
    } else {
      setOpportunities(SEED_OPPORTUNITIES);
    }
  }, []);

  // Sync to localStorage
  const saveToStorage = (opps: Opportunity[]) => {
    setOpportunities(opps);
    localStorage.setItem("missed_opps_agent_vault", JSON.stringify(opps));
  };

  // Find the single curated opportunity of the day: highest active Recovery Score!
  const dailyFocusOpportunity = useMemo(() => {
    const activeOpps = opportunities.filter(o => o.status === "active");
    if (activeOpps.length === 0) return null;
    
    // Sort descending by recoveryScore
    return [...activeOpps].sort((a, b) => b.recoveryScore - a.recoveryScore)[0];
  }, [opportunities]);

  // Overall Statistics calculated dynamically
  const stats = useMemo(() => {
    const active = opportunities.filter(o => o.status === "active");
    const recovered = opportunities.filter(o => o.status === "recovered");
    const archived = opportunities.filter(o => o.status === "archived");
    
    // Total Sunk Hours already paid (based on momentum retention)
    // Let's assume each item took ~12 hours of average sunk cost prep (multiplied by momentum fraction)
    const sunkHoursPaid = opportunities.reduce((acc, current) => {
      if (current.status === "active") {
        return acc + (current.momentumRetention * 1.5); // e.g. 8 * 1.5 = 12 sunk hours bleed
      }
      return acc;
    }, 0);

    const recoveredValueMultiplier = recovered.reduce((acc, current) => {
      return acc + (current.futureUpside * 150); // e.g. $150 ROI index per leverage point
    }, 0);

    return {
      activeCount: active.length,
      recoveredCount: recovered.length,
      archivedCount: archived.length,
      sunkHoursPaid: Math.round(sunkHoursPaid),
      recoveredValue: recoveredValueMultiplier
    };
  }, [opportunities]);

  // Handle adding new opportunities from ingestion pipeline
  const handleIngestion = (newOpps: Opportunity[]) => {
    const updated = [...newOpps, ...opportunities];
    saveToStorage(updated);
    
    // Auto-select the first newly ingested item for immediate recovery review
    if (newOpps.length > 0) {
      setSelectedOpportunity(newOpps[0]);
    }

    setCelebration({
      show: true,
      title: `${newOpps.length} Sunk-cost opportunities registered in your vault!`
    });
    setTimeout(() => setCelebration(null), 4000);
  };

  // Recover item action
  const handleRecoverOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    // Smooth scroll to recovery section or focus viewport
    setTimeout(() => {
      const el = document.getElementById("recovery-console-panel");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Finalize actual recovery process (called inside Recovery Workspace)
  const handleConfirmRecovery = (id: string, notes?: string) => {
    const updated = opportunities.map(o => {
      if (o.id === id) {
        return { 
          ...o, 
          status: "recovered" as const, 
          notes: notes || "Recovered successfully!", 
          dateUpdated: new Date().toISOString() 
        };
      }
      return o;
    });
    
    const index = opportunities.findIndex(o => o.id === id);
    const recoveredOpp = index !== -1 ? opportunities[index] : null;

    saveToStorage(updated);
    setSelectedOpportunity(null);

    setCelebration({
      show: true,
      title: `🎉 SECURED ROI! You finalized "${recoveredOpp?.title || "Project"}" and reclaimed hours of sunk attention cost!`
    });
    setTimeout(() => setCelebration(null), 5000);
  };

  // Archive / Let go action (supports Zeigarnik effect reduction)
  const handleArchiveOpportunity = (opp: Opportunity) => {
    const updated = opportunities.map(o => {
      if (o.id === opp.id) {
        return { 
          ...o, 
          status: "archived" as const, 
          dateUpdated: new Date().toISOString() 
        };
      }
      return o;
    });
    saveToStorage(updated);
    if (selectedOpportunity?.id === opp.id) {
      setSelectedOpportunity(null);
    }

    setCelebration({
      show: true,
      title: `🍂 PsychologicalClosure Applied: "${opp.title}" has been released. Mental space cleared!`
    });
    setTimeout(() => setCelebration(null), 4000);
  };

  // Snooze today's daily focus card
  const handlePostponeOpportunity = (opp: Opportunity) => {
    setLoadingDaily(true);
    // Mimic quick database cycle
    setTimeout(() => {
      const updated = opportunities.map(o => {
        if (o.id === opp.id) {
          // Push down its score temporarily or shift database update date
          return { 
            ...o, 
            dateUpdated: new Date().toISOString() 
          };
        }
        return o;
      });
      saveToStorage(updated);
      setLoadingDaily(false);
    }, 250);
  };

  // Restore everything back to seed state
  const handleResetToSeeds = () => {
    if (confirm("Reset current database to default seed opportunities?")) {
      saveToStorage(SEED_OPPORTUNITIES);
      setSelectedOpportunity(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 selection:bg-amber-500 selection:text-neutral-900 pb-20 overflow-x-hidden">
      
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-10 w-[500px] h-[500px] bg-teal-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      {/* Celebration Notification Toast */}
      <AnimatePresence>
        {celebration?.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
          >
            <div className="bg-neutral-900 border border-amber-500/30 text-amber-300 px-5 py-4 rounded-xl shadow-2xl text-center text-xs font-sans font-medium flex items-center justify-center gap-3 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 fill-current" />
              <span>{celebration.title}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-8 space-y-10">
        
        {/* Header Block */}
        <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 border-b border-neutral-800 pb-6 relative">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Cognitive Asset Management</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-neutral-100 flex items-center gap-2">
              Missed-Opportunity Agent
            </h1>
            
            <p className="text-sm text-neutral-400 max-w-xl font-sans">
              Stop the slow bleed of sunk costs. Our agent targets the unfinished 85% Rule files inside your digital exhaust, scoring metrics to trigger instant recovery.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={handleResetToSeeds}
              className="px-3 py-1.5 hover:bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-mono text-neutral-500 hover:text-neutral-300 transition-all cursor-pointer"
              title="Reset Vault to Seed Opportunities"
            >
              Reset Seed Data
            </button>
          </div>
        </header>

        {/* Dynamic ROI Metrics stats bar */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Active Sunk cost opportunities */}
          <div className="bg-neutral-950/50 border border-neutral-850 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              <span>Sunk Cost Bleed</span>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl md:text-3xl font-mono font-bold text-amber-400">{stats.activeCount}</span>
              <span className="text-xs text-neutral-400 font-sans">Pending Tasks</span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono">Uncompleted assets</p>
          </div>

          {/* Sunk cost hours already spent */}
          <div className="bg-neutral-950/50 border border-neutral-850 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              <span>Investment Risked</span>
              <Layers className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl md:text-3xl font-mono font-bold text-teal-400">~{stats.sunkHoursPaid}h</span>
              <span className="text-xs text-neutral-400 font-sans">Sunk Effort</span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono">Already paid in attention-cost</p>
          </div>

          {/* Recovered Value Index */}
          <div className="bg-neutral-950/50 border border-neutral-850 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              <span>Recovered ROI Index</span>
              <LineChart className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl md:text-3xl font-mono font-bold text-emerald-400">+{stats.recoveredCount}</span>
              <span className="text-xs text-neutral-400 font-sans">Leveraged wins</span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono">Reclaimed into active value</p>
          </div>

          {/* Psychological relief let-go counter */}
          <div className="bg-neutral-950/50 border border-neutral-850 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
              <span>Mental Space Cleared</span>
              <Trash2 className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl md:text-3xl font-mono font-bold text-neutral-200">{stats.archivedCount}</span>
              <span className="text-xs text-neutral-400 font-sans">Let Go</span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono">Zeigarnik closure release</p>
          </div>
        </section>

        {/* Dashboard Main Grid structure */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7/8 COLUMNS: Ingestion, Daily focal target, and Repository listings */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Daily "Recover This" focal target */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-sans font-semibold text-neutral-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  Today's Curated Choice Focus
                </h2>
                <span className="text-xs text-neutral-400 font-mono">Prevent Wall-of-Shame Friction</span>
              </div>

              <DailyBrief 
                opportunity={dailyFocusOpportunity}
                onRecover={handleRecoverOpportunity}
                onArchive={handleArchiveOpportunity}
                onPostpone={handlePostponeOpportunity}
                isLoading={loadingDaily}
              />
            </div>

            {/* Ingestion console tracker zone */}
            <IngestPipeline onIngestCompleted={handleIngestion} />

            {/* The Sunk Cost Graveyard catalog */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-sans font-semibold text-neutral-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                  Sunk-Cost Graveyard Ambitions vault
                </h2>
                <span className="text-xs text-neutral-400 font-sans">Tracked Sunk Assets List</span>
              </div>

              <GraveyardDashboard 
                opportunities={opportunities}
                onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
                onArchiveOpportunity={handleArchiveOpportunity}
                onRecoverOpportunity={handleRecoverOpportunity}
                activeId={selectedOpportunity?.id}
              />
            </div>

          </div>

          {/* RIGHT 4/5 COLUMNS: Floating Recovery console Panel workspace */}
          <div id="recovery-console-panel" className="lg:col-span-4 lg:sticky lg:top-6 space-y-6">
            {selectedOpportunity ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[calc(100vh-100px)] min-h-[500px]"
              >
                <RecoveryWorkspace 
                  opportunity={selectedOpportunity}
                  onClose={() => setSelectedOpportunity(null)}
                  onConfirmRecovery={handleConfirmRecovery}
                  onSnooze={handlePostponeOpportunity}
                />
              </motion.div>
            ) : (
              <div className="bg-neutral-900/20 border border-dashed border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-neutral-500 py-16">
                <div className="w-10 h-10 rounded-full bg-neutral-950 flex items-center justify-center text-neutral-600 mb-3 border border-neutral-850">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-sans font-semibold text-neutral-300">Terminal Dormant</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed font-sans">
                  Select any opportunity in the daily choice panel or sunk-cost graveyard repo to boot the recovery compiler and deploy custom AI rescue boosters.
                </p>
              </div>
            )}
          </div>

        </section>

      </div>
    </div>
  );
}
export { App };
