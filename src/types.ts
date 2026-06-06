export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: 'office' | 'personal';
  source: 'notion' | 'github' | 'outreach' | 'learning' | 'other';
  futureUpside: number;        // scale 1-10 (high, med, low internally)
  momentumRetention: number;   // scale 1-10 (how close to 100% it is)
  effortRequired: number;      // scale 1-10 (activation energy)
  decayRisk: 'high' | 'med' | 'low';
  recoveryScore: number;       // (futureUpside * momentumRetention) / effortRequired
  whyItMatters: string;        // explanation of the unrealized leverage
  activationTask: string;      // highly actionable ~15 min task
  guidanceInstructions: string; // clear code, text draft, or manual instructions to run
  status: 'active' | 'recovered' | 'archived' | 'snoozed';
  dateAdded: string;
  dateUpdated: string;
  notes?: string;
}

export type NewOpportunityInput = Omit<Opportunity, 'id' | 'recoveryScore' | 'dateAdded' | 'dateUpdated' | 'status'>;

export interface IngestionResult {
  title: string;
  description: string;
  type: 'office' | 'personal';
  source: 'notion' | 'github' | 'outreach' | 'learning' | 'other';
  futureUpside: number;
  momentumRetention: number;
  effortRequired: number;
  decayRisk: 'high' | 'med' | 'low';
  whyItMatters: string;
  activationTask: string;
  guidanceInstructions: string;
  analysisExplanation: string;
}
