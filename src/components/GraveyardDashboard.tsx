import React, { useState, useMemo } from "react";
import { Opportunity } from "../types";
import { 
  Briefcase, 
  User, 
  Search, 
  ChevronRight, 
  Zap, 
  Clock, 
  TrendingUp, 
  Filter, 
  CheckCircle2, 
  Trash2,
  FileText,
  Github,
  Mail,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Archive,
  ArrowUpDown
} from "lucide-react";
import { motion } from "motion/react";

interface GraveyardDashboardProps {
  opportunities: Opportunity[];
  onSelectOpportunity: (opp: Opportunity) => void;
  onArchiveOpportunity: (opp: Opportunity) => void;
  onRecoverOpportunity: (opp: Opportunity) => void;
  activeId?: string;
}

export const GraveyardDashboard: React.FC<GraveyardDashboardProps> = ({
  opportunities,
  onSelectOpportunity,
  onArchiveOpportunity,
  onRecoverOpportunity,
  activeId
}) => {
  // Tabs: Office vs Personal vs Archived vs Recovered
  const [activeContextTab, setActiveContextTab] = useState<'office' | 'personal'>('office');
  const [statusFilter, setStatusFilter] = useState<'active' | 'recovered' | 'archived'>('active');
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [decayFilter, setDecayFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'recoveryScore' | 'momentum' | 'effort' | 'added'>('recoveryScore');

  // Stats Counters
  const countStats = useMemo(() => {
    return {
      officeActive: opportunities.filter(o => o.type === 'office' && o.status === 'active').length,
      personalActive: opportunities.filter(o => o.type === 'personal' && o.status === 'active').length,
      recovered: opportunities.filter(o => o.status === 'recovered').length,
      archived: opportunities.filter(o => o.status === 'archived').length
    };
  }, [opportunities]);

  // Derived filter list
  const filteredOpps = useMemo(() => {
    return opportunities.filter(opp => {
      // 1. Filter by Context tab (Office vs Personal)
      if (opp.type !== activeContextTab) return false;

      // 2. Filter by status (Active vs Recovered vs Archived)
      if (opp.status !== statusFilter) return false;

      // 3. Filter by Source
      if (sourceFilter !== "all" && opp.source !== sourceFilter) return false;

      // 4. Filter by Decay
      if (decayFilter !== "all" && opp.decayRisk !== decayFilter) return false;

      // 5. Filter by Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const inTitle = opp.title.toLowerCase().includes(query);
        const inDesc = opp.description.toLowerCase().includes(query);
        const inWhy = opp.whyItMatters.toLowerCase().includes(query);
        if (!inTitle && !inDesc && !inWhy) return false;
      }

      return true;
    }).sort((a, b) => {
      // 6. Sort
      if (sortBy === "recoveryScore") {
        return b.recoveryScore - a.recoveryScore;
      } else if (sortBy === "momentum") {
        return b.momentumRetention - a.momentumRetention;
      } else if (sortBy === "effort") {
        return a.effortRequired - b.effortRequired; // lowest activation energy first
      } else {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });
  }, [opportunities, activeContextTab, statusFilter, sourceFilter, decayFilter, searchQuery, sortBy]);

  // Icon selector
  const getSourceDetails = (source: string) => {
    switch (source) {
      case "notion": return { icon: <FileText className="w-3.5 h-3.5 text-emerald-400" />, label: "Notion / Obsidian" };
      case "github": return { icon: <Github className="w-3.5 h-3.5 text-sky-400" />, label: "Git Repository" };
      case "outreach": return { icon: <Mail className="w-3.5 h-3.5 text-amber-400" />, label: "Email / Outreach" };
      case "learning": return { icon: <GraduationCap className="w-3.5 h-3.5 text-purple-400" />, label: "Certifications" };
      default: return { icon: <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />, label: "Uncategorized Exhaust" };
    }
  };

  const getDecayBadgeColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-950/20 text-red-400 border border-red-900/40";
      case "med": return "bg-amber-950/20 text-amber-400 border border-amber-900/40";
      default: return "bg-sky-950/20 text-sky-400 border border-sky-900/40";
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Context Split Title Tab bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-neutral-800 pb-3">
        
        {/* Bifurcated tabs: Office vs Personal */}
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-850 self-start">
          <button
            id="tab-context-office"
            onClick={() => setActiveContextTab('office')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
              activeContextTab === 'office' 
                ? 'bg-neutral-850 text-white shadow-md font-semibold' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            Office Work
            <span className="ml-1.5 px-1.5 py-0.5 bg-neutral-900 rounded-md border border-neutral-800 text-[10px]">
              {countStats.officeActive}
            </span>
          </button>

          <button
            id="tab-context-personal"
            onClick={() => setActiveContextTab('personal')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer ${
              activeContextTab === 'personal' 
                ? 'bg-neutral-850 text-white shadow-md font-semibold' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-purple-400" />
            Personal Growth
            <span className="ml-1.5 px-1.5 py-0.5 bg-neutral-900 rounded-md border border-neutral-800 text-[10px]">
              {countStats.personalActive}
            </span>
          </button>
        </div>

        {/* Global filter tabs: Active vs Recovered vs Archived */}
        <div className="flex items-center gap-2 text-xs font-sans text-neutral-400 font-medium">
          <span className="hidden sm:inline">Folder:</span>
          <button
            id="filter-status-active"
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              statusFilter === 'active' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-900/50' 
                : 'bg-transparent border-transparent hover:bg-neutral-900 text-neutral-400'
            }`}
          >
            Sunk Costs (Active)
          </button>

          <button
            id="filter-status-recovered"
            onClick={() => setStatusFilter('recovered')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              statusFilter === 'recovered' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-900/50' 
                : 'bg-transparent border-transparent hover:bg-neutral-900 text-neutral-400'
            }`}
          >
            Recovered ({countStats.recovered})
          </button>

          <button
            id="filter-status-archived"
            onClick={() => setStatusFilter('archived')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              statusFilter === 'archived' 
                ? 'bg-red-500/10 text-rose-400 border-red-900/40' 
                : 'bg-transparent border-transparent hover:bg-neutral-900 text-neutral-400'
            }`}
          >
            Let Go ({countStats.archived})
          </button>
        </div>

      </div>

      {/* Interactive Toolbar Filter Board */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-neutral-900/20 border border-neutral-800/80 p-4 rounded-xl items-center">
        
        {/* Search Input */}
        <div className="col-span-12 md:col-span-4 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeContextTab} graveyard...`}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-neutral-700 focus:outline-none rounded-lg p-2 pl-9 text-xs font-sans text-neutral-300 placeholder-neutral-500"
          />
        </div>

        {/* Source Dropdown */}
        <div className="col-span-6 sm:col-span-3 md:col-span-2 flex items-center gap-1">
          <span className="text-[10px] font-mono text-neutral-500 hidden xl:inline">Origin:</span>
          <select
            id="origin-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-neutral-700 text-xs text-neutral-300 py-2 px-2.5 rounded-lg font-sans"
          >
            <option value="all">All Sources</option>
            <option value="notion">Notion / Obsidian</option>
            <option value="github">Git Repositories</option>
            <option value="outreach">Outreach Calls</option>
            <option value="learning">Certifications</option>
          </select>
        </div>

        {/* Decay risk dropdown */}
        <div className="col-span-6 sm:col-span-3 md:col-span-2 flex items-center gap-1">
          <span className="text-[10px] font-mono text-neutral-500 hidden xl:inline">Decay:</span>
          <select
            id="decay-select"
            value={decayFilter}
            onChange={(e) => setDecayFilter(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-neutral-700 text-xs text-neutral-300 py-2 px-2.5 rounded-lg font-sans"
          >
            <option value="all">All Decay Rates</option>
            <option value="high">High Decay Risk</option>
            <option value="med">Med Decay Risk</option>
            <option value="low">Low Decay Risk</option>
          </select>
        </div>

        {/* Sort by dropdown */}
        <div className="col-span-12 sm:col-span-6 md:col-span-4 flex items-center gap-2">
          <span className="text-[10px] font-mono text-neutral-500 shrink-0">Sort By:</span>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-neutral-950 border border-neutral-800 focus:outline-none focus:border-neutral-700 text-xs text-neutral-300 py-2 px-2.5 rounded-lg font-sans"
          >
            <option value="recoveryScore">Recovery Score (Highest ROI)</option>
            <option value="momentum">Momentum Paid (85% Rule)</option>
            <option value="effort">Activation Energy (Lowest effort first)</option>
            <option value="added">Recently Logged</option>
          </select>
        </div>

      </div>

      {/* Grid of Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOpps.length > 0 ? (
          filteredOpps.map((opp) => {
            const { icon, label } = getSourceDetails(opp.source);
            const isSelected = activeId === opp.id;

            return (
              <motion.div
                key={opp.id}
                layoutId={`card-${opp.id}`}
                onClick={() => onSelectOpportunity(opp)}
                className={`flex flex-col justify-between bg-neutral-900/40 hover:bg-neutral-900/80 border text-left p-5 rounded-xl transition-all cursor-pointer relative ${
                  isSelected 
                    ? "border-amber-500/50 shadow-lg shadow-amber-950/10 ring-1 ring-amber-500/20" 
                    : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {/* Visual border pulse on active selected node */}
                {isSelected && (
                  <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">
                      {icon}
                      {label}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${getDecayBadgeColor(opp.decayRisk)}`}>
                      {opp.decayRisk}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-sans font-semibold text-neutral-100 leading-snug hover:text-amber-400 transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>
                  </div>
                </div>

                {/* Score indicators at base */}
                <div className="border-t border-neutral-850/80 mt-4 pt-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Recovery Score value tag */}
                    <div className="text-center">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase block leading-none">Score</span>
                      <strong className="text-sm font-mono text-teal-400 block">{opp.recoveryScore.toFixed(1)}</strong>
                    </div>

                    <div className="w-[1px] h-6 bg-neutral-800" />

                    {/* Sunk level */}
                    <div className="text-center">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase block leading-none">Already Paid</span>
                      <strong className="text-xs font-mono text-amber-500 block">{opp.momentumRetention * 10}%</strong>
                    </div>

                    <div className="w-[1px] h-6 bg-neutral-800" />

                    {/* Activation Energy */}
                    <div className="text-center">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase block leading-none">Activation</span>
                      <strong className="text-xs font-mono text-rose-500 block">{opp.effortRequired}/10</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {opp.status === "active" ? (
                      <>
                        {/* Quick Action buttons */}
                        <button
                          id={`btn-graveyard-archive-${opp.id}`}
                          title="Let this go / Archive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onArchiveOpportunity(opp);
                          }}
                          className="p-1 px-1.5 hover:bg-neutral-800 rounded border border-transparent hover:border-neutral-700 text-neutral-400 hover:text-red-400 transition-all cursor-pointer text-[10px] font-sans"
                        >
                          Let Go
                        </button>
                        <button
                          id={`btn-graveyard-recover-${opp.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecoverOpportunity(opp);
                          }}
                          className="p-1 px-2.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-neutral-950 border border-amber-900/20 rounded font-sans transition-all cursor-pointer text-[10px] font-semibold"
                        >
                          Recover
                        </button>
                      </>
                    ) : opp.status === "recovered" ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                        <CheckCircle2 className="w-3 h-3" /> Recovered
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-rose-400 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-900/30">
                        <Archive className="w-3 h-3" /> Let Go
                      </span>
                    )}

                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-12 flex flex-col items-center justify-center py-16 bg-neutral-900/10 border border-dashed border-neutral-800 rounded-xl p-8 text-center text-neutral-500">
            <span className="text-lg mb-1">📭 Empty Vault Section</span>
            <p className="text-xs text-neutral-400 max-w-sm">No items in the {activeContextTab} ({statusFilter}) repository match your filters. Try clearing inputs or change categories.</p>
          </div>
        )}
      </div>

    </div>
  );
};
