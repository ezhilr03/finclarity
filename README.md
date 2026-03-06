# FinClarity 💰

**Financial decision-support platform for salaried professionals in India.**

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 + ShadCN UI |
| State | Redux Toolkit (RTK) |
| Charts | Chart.js + react-chartjs-2 |
| Routing | React Router v7 |
| Icons | Lucide React |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # ShadCN UI base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── primitives.tsx  # Badge, Label, Progress, Separator
│   │   └── toaster.tsx
│   ├── layout/          # Navbar, Footer
│   ├── shared/          # ScoreRing, MetricCard, PageHeader, etc.
│   └── pages/
│       ├── home/        # HomePage
│       ├── tools/       # Health, EMI, Debt, Emergency, FI pages
│       └── dashboard/   # DashboardPage
├── hooks/               # useAnimatedCounter, useAppDispatch
├── services/            # financialCalculations.ts
├── store/
│   └── slices/          # financialSlice (RTK)
├── types/               # financial.ts (all TypeScript types)
├── utils/               # cn, formatCurrency, clamp, etc.
├── constants/           # NAV_LINKS, TOOLS, HOMEPAGE_STATS
└── styles/              # globals.css (Tailwind + CSS variables)
```

## 🧮 Financial Tools

1. **Financial Health Score** — 0–100 score from salary, expenses, savings, loans
2. **EMI Safety Checker** — Debt-to-income ratio with risk gauge
3. **Debt Escape Planner** — Amortization chart + accelerated repayment
4. **Emergency Fund Calculator** — 3m/6m/12m targets with progress tracking
5. **FI Tracker** — Financial Independence year using the 4% rule

## 📡 Backend Setup (Java Spring Boot)

```
finclarity-backend/
└── src/main/java/com/finclarity/
    ├── controller/    # REST controllers
    ├── service/       # Business logic
    ├── repository/    # JPA repositories
    ├── model/         # Entity classes
    ├── dto/           # Request/Response DTOs
    ├── config/        # Spring config, CORS
    └── util/          # Helper utilities
```

API Base URL: `http://localhost:8080/api/v1`

To wire the frontend to the backend, update `src/services/api/` with Axios calls.

## 🔧 Environment Variables

Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

> ⚠️ **Disclaimer**: All insights are for educational purposes only and do not constitute financial advice. Consult a SEBI-registered advisor.
