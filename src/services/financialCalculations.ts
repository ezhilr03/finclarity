import { clamp } from "@/utils";
import type {
  HealthScoreInput,
  HealthScoreResult,
  EMIInput,
  EMIResult,
  DebtInput,
  DebtResult,
  AmortizationEntry,
  EmergencyInput,
  EmergencyResult,
  FIInput,
  FIResult,
} from "@/types/financial";

// ─── Health Score ───────────────────────────────────────────────────────────
export function calculateHealthScore(input: HealthScoreInput): HealthScoreResult {
  const { salary, expenses, savings, loans } = input;
  if (salary <= 0) throw new Error("Salary must be positive");

  const savingsRate = (savings / salary) * 100;
  const dti = (loans / salary) * 100;
  const emergencyCoverageDays = savings > 0 && expenses > 0 ? (savings / expenses) * 30 : 0;
  const monthSurplus = salary - expenses - loans;

  // Scoring (max 100)
  const savingsScore = clamp((savingsRate / 30) * 35, 0, 35);
  const dtiScore = clamp(((50 - dti) / 50) * 30, 0, 30);
  const emergencyScore = clamp((emergencyCoverageDays / 180) * 20, 0, 20);
  const surplusScore = clamp((monthSurplus / salary) * 15, 0, 15);
  const score = Math.round(savingsScore + dtiScore + emergencyScore + surplusScore);

  const status: HealthScoreResult["status"] =
    score >= 80 ? "Excellent"
    : score >= 65 ? "Good"
    : score >= 50 ? "Stable"
    : score >= 35 ? "Fair"
    : "Needs Attention";

  const suggestions: string[] = [];
  if (savingsRate < 20)
    suggestions.push(`Increase savings to ₹${Math.round(salary * 0.2).toLocaleString("en-IN")}/month (20% rule)`);
  if (dti > 40)
    suggestions.push("Prepay high-interest loans to reduce DTI below 40%");
  if (emergencyCoverageDays < 90)
    suggestions.push(`Build emergency fund to ₹${Math.round(expenses * 3).toLocaleString("en-IN")} (3 months expenses)`);
  if (monthSurplus < 0)
    suggestions.push("Your expenses exceed income — review and cut discretionary spending immediately");

  return { score, status, savingsRate, dti, emergencyCoverageDays, monthSurplus, suggestions };
}

// ─── EMI Checker ────────────────────────────────────────────────────────────
export function calculateEMISafety(input: EMIInput): EMIResult {
  const { salary, emi } = input;
  const ratio = (emi / salary) * 100;
  const risk: EMIResult["risk"] = ratio > 50 ? "High" : ratio > 35 ? "Moderate" : "Low";
  return {
    ratio,
    risk,
    safeEmi: salary * 0.35,
    maxEmi: salary * 0.5,
    surplus: salary - emi,
  };
}

// ─── Debt Planner ───────────────────────────────────────────────────────────
export function calculateDebtPlan(input: DebtInput): DebtResult {
  const { principal, rate, emi } = input;
  const monthlyRate = rate / 100 / 12;

  // Months to payoff
  const months = monthlyRate === 0
    ? Math.ceil(principal / emi)
    : Math.ceil(-Math.log(1 - (principal * monthlyRate) / emi) / Math.log(1 + monthlyRate));

  const totalPaid = emi * months;
  const totalInterest = totalPaid - principal;

  // Accelerated: 20% extra
  const extraEmi = emi * 1.2;
  const months2 = monthlyRate === 0
    ? Math.ceil(principal / extraEmi)
    : Math.ceil(-Math.log(1 - (principal * monthlyRate) / extraEmi) / Math.log(1 + monthlyRate));
  const totalPaid2 = extraEmi * months2;
  const interestSaved = Math.max(totalPaid - totalPaid2, 0);
  const monthsSaved = Math.max(months - months2, 0);

  // Amortization schedule (up to 60 months for chart)
  const amortization: AmortizationEntry[] = [];
  let balance = principal;
  for (let m = 1; m <= Math.min(months, 60); m++) {
    const interestPaid = balance * monthlyRate;
    const principalPaid = Math.min(emi - interestPaid, balance);
    balance -= principalPaid;
    amortization.push({ month: m, balance: Math.max(balance, 0), interestPaid, principalPaid });
    if (balance <= 0) break;
  }

  return { months, totalInterest, totalPaid, interestSaved, monthsSaved, extraEmi, amortization };
}

// ─── Emergency Fund ─────────────────────────────────────────────────────────
export function calculateEmergencyFund(input: EmergencyInput): EmergencyResult {
  const { expenses, currentFund } = input;
  const target6m = expenses * 6;
  const gap = Math.max(target6m - currentFund, 0);
  const monthsCoverage = expenses > 0 ? currentFund / expenses : 0;
  const monthsToGoal = gap > 0 ? Math.ceil(gap / (expenses * 0.1)) : 0;
  return {
    target3m: expenses * 3,
    target6m,
    target12m: expenses * 12,
    monthsCoverage,
    gap,
    monthsToGoal,
  };
}

// ─── FI Tracker ─────────────────────────────────────────────────────────────
export function calculateFI(input: FIInput): FIResult {
  const { monthlyInvestment, expectedReturns, desiredExpenses } = input;
  const annualExpenses = desiredExpenses * 12;
  const corpusNeeded = annualExpenses * 25; // 4% rule
  const monthlyRate = expectedReturns / 100 / 12;

  const n = monthlyRate === 0
    ? corpusNeeded / monthlyInvestment
    : Math.log((corpusNeeded * monthlyRate) / monthlyInvestment + 1) / Math.log(1 + monthlyRate);

  const years = n / 12;
  const fiYear = new Date().getFullYear() + Math.ceil(years);

  const milestones = [25, 50, 75, 100].map((pct) => {
    const target = (corpusNeeded * pct) / 100;
    const nM = monthlyRate === 0
      ? target / monthlyInvestment
      : Math.log((target * monthlyRate) / monthlyInvestment + 1) / Math.log(1 + monthlyRate);
    return { pct, years: parseFloat((nM / 12).toFixed(1)), amount: target };
  });

  return { years, fiYear, corpusNeeded, milestones };
}
