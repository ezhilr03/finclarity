// Financial Health Score
export interface HealthScoreInput {
  salary: number;
  expenses: number;
  savings: number;
  loans: number;
}

export interface HealthScoreResult {
  score: number;
  status: "Excellent" | "Good" | "Stable" | "Fair" | "Needs Attention";
  savingsRate: number;
  dti: number;
  emergencyCoverageDays: number;
  monthSurplus: number;
  suggestions: string[];
}

// EMI Checker
export interface EMIInput {
  salary: number;
  emi: number;
}

export interface EMIResult {
  ratio: number;
  risk: "Low" | "Moderate" | "High";
  safeEmi: number;
  maxEmi: number;
  surplus: number;
}

// Debt Planner
export interface DebtInput {
  principal: number;
  rate: number;
  emi: number;
}

export interface AmortizationEntry {
  month: number;
  balance: number;
  interestPaid: number;
  principalPaid: number;
}

export interface DebtResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  interestSaved: number;
  monthsSaved: number;
  extraEmi: number;
  amortization: AmortizationEntry[];
}

// Emergency Fund
export interface EmergencyInput {
  expenses: number;
  currentFund: number;
}

export interface EmergencyResult {
  target3m: number;
  target6m: number;
  target12m: number;
  monthsCoverage: number;
  gap: number;
  monthsToGoal: number;
}

// FI Tracker
export interface FIInput {
  monthlyInvestment: number;
  expectedReturns: number;
  desiredExpenses: number;
}

export interface FIMilestone {
  pct: number;
  years: number;
  amount: number;
}

export interface FIResult {
  years: number;
  fiYear: number;
  corpusNeeded: number;
  milestones: FIMilestone[];
}

// Redux state shapes
export interface FinancialState {
  healthScore: HealthScoreResult | null;
  healthInput: HealthScoreInput | null;
  emiResult: EMIResult | null;
  emiInput: EMIInput | null;
  debtResult: DebtResult | null;
  debtInput: DebtInput | null;
  emergencyResult: EmergencyResult | null;
  emergencyInput: EmergencyInput | null;
  fiResult: FIResult | null;
  fiInput: FIInput | null;
}
