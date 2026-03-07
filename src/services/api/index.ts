import apiClient from "./client";
import type {
  HealthScoreInput,
  HealthScoreResult,
  EMIInput,
  EMIResult,
  DebtInput,
  DebtResult,
  EmergencyInput,
  EmergencyResult,
  FIInput,
  FIResult,
} from "@/types/financial";

// ─── Generic API wrapper ──────────────────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

async function post<TReq, TRes>(url: string, body: TReq): Promise<TRes> {
  const res = await apiClient.post<ApiResponse<TRes>>(url, body);
  return res.data.data;
}

async function get<TRes>(url: string): Promise<TRes> {
  const res = await apiClient.get<ApiResponse<TRes>>(url);
  return res.data.data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthPayload {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  fullName: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterInput) =>
    post<RegisterInput, AuthPayload>("/auth/register", data),

  login: (data: LoginInput) =>
    post<LoginInput, AuthPayload>("/auth/login", data),
};

// ─── Calculators ──────────────────────────────────────────────────────────────
// These call the Spring Boot backend and return typed results.
// If the API call fails (offline / no backend), we fall back to local calculations.

export const calculatorApi = {
  healthScore: (data: HealthScoreInput) =>
    post<HealthScoreInput, HealthScoreResult>("/calculator/health-score", data),

  emiSafety: (data: EMIInput) =>
    post<EMIInput, EMIResult>("/calculator/emi-safety", data),

  debtPlan: (data: DebtInput) =>
    post<DebtInput, DebtResult>("/calculator/debt-plan", {
      principal: data.principal,
      annualRate: data.rate,
      emi: data.emi,
    } as unknown as DebtInput),

  emergencyFund: (data: EmergencyInput) =>
    post<EmergencyInput, EmergencyResult>("/calculator/emergency-fund", {
      monthlyExpenses: data.expenses,
      currentFund: data.currentFund,
    } as unknown as EmergencyInput),

  fiTracker: (data: FIInput) =>
    post<FIInput, FIResult>("/calculator/fi-tracker", {
      monthlyInvestment: data.monthlyInvestment,
      expectedReturns: data.expectedReturns,
      desiredExpenses: data.desiredExpenses,
    } as unknown as FIInput),
};

// ─── User ─────────────────────────────────────────────────────────────────────
export interface HealthScoreHistoryItem {
  id: number;
  score: number;
  status: string;
  savingsRate: number;
  dti: number;
  createdAt: string;
}

export const userApi = {
  getHealthScoreHistory: (limit = 12) =>
    get<HealthScoreHistoryItem[]>(`/user/health-score/history?limit=${limit}`),
};

// ─── Newsletter ───────────────────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) =>
    post<{ email: string }, string>("/newsletter/subscribe", { email }),

  unsubscribe: (email: string) =>
    post<{ email: string }, string>("/newsletter/unsubscribe", { email }),
};
