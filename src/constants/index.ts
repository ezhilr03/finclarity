export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Health Score", path: "/health-score" },
  { label: "EMI Checker", path: "/emi-checker" },
  { label: "Debt Planner", path: "/debt-planner" },
  { label: "Emergency Fund", path: "/emergency-fund" },
  { label: "FI Tracker", path: "/fi-tracker" },
  { label: "Dashboard", path: "/dashboard" },
] as const;

export const TOOLS = [
  {
    id: "health-score",
    path: "/health-score",
    icon: "💊",
    title: "Financial Health Score",
    description: "Get a comprehensive 0–100 score based on savings, debt, and expenses.",
    badge: "Popular",
    badgeVariant: "blue" as const,
  },
  {
    id: "emi-checker",
    path: "/emi-checker",
    icon: "🏦",
    title: "EMI Safety Checker",
    description: "Check if your EMI load is safe or risky relative to your income.",
    badge: "Quick Check",
    badgeVariant: "green" as const,
  },
  {
    id: "debt-planner",
    path: "/debt-planner",
    icon: "🔓",
    title: "Debt Escape Planner",
    description: "Find the fastest route out of debt and see total interest saved.",
    badge: "Save Money",
    badgeVariant: "yellow" as const,
  },
  {
    id: "emergency-fund",
    path: "/emergency-fund",
    icon: "🛡️",
    title: "Emergency Fund Calculator",
    description: "Calculate your ideal emergency fund — your financial safety net.",
    badge: "Essential",
    badgeVariant: "blue" as const,
  },
  {
    id: "fi-tracker",
    path: "/fi-tracker",
    icon: "🚀",
    title: "FI Tracker",
    description: "Discover your Financial Independence date based on investments.",
    badge: "Long-term",
    badgeVariant: "green" as const,
  },
  {
    id: "dashboard",
    path: "/dashboard",
    icon: "📊",
    title: "Full Dashboard",
    description: "See all your financial metrics in one unified view.",
    badge: "Overview",
    badgeVariant: "blue" as const,
  },
] as const;

export const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Enter Income & Expenses",
    description: "Input your monthly salary and spending patterns in under a minute.",
  },
  {
    num: "02",
    title: "Add Loans & Savings",
    description: "Tell us about your EMIs, savings, and investment amounts.",
  },
  {
    num: "03",
    title: "Receive Instant Insights",
    description: "Get your personalized financial health score and actionable recommendations.",
  },
] as const;

export const HOMEPAGE_STATS = [
  { value: "2.4L+", label: "Users Helped" },
  { value: "₹84Cr+", label: "Savings Optimized" },
  { value: "4.9★", label: "User Rating" },
  { value: "60s", label: "To Get Insights" },
] as const;
