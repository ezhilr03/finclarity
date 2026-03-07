import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { MetricCard, PageHeader, EmptyState, FinInput, GaugeBar } from "@/components/shared/index";
import { SEO, schemas } from "@/components/shared/SEO";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { useHealthScore } from "@/hooks/useCalculator";
import { formatCurrency } from "@/utils";
import type { HealthScoreInput } from "@/types/financial";

export function HealthScorePage() {
  const { calculate, status } = useHealthScore();
  const savedResult = useAppSelector((s) => s.financial.healthScore);
  const savedInput  = useAppSelector((s) => s.financial.healthInput);

  const [form, setForm] = useState<HealthScoreInput>(
    savedInput ?? { salary: 85000, expenses: 45000, savings: 15000, loans: 12000 }
  );

  const result = savedResult;
  const isLoading = status === "loading";

  const handleCalculate = async () => {
    try { await calculate(form); } catch { /* local fallback already handled */ }
  };

  const scoreColor = result
    ? result.score >= 75 ? "text-fin-green" : result.score >= 50 ? "text-amber-500" : "text-red-500"
    : "text-fin-blue";

  return (
    <>
      <SEO
        title="Financial Health Score Calculator"
        description="Calculate your free Financial Health Score based on your salary, expenses, savings and loans. Get a 0-100 score with actionable tips for Indian salaried professionals."
        keywords="financial health score calculator India, savings rate calculator, debt to income ratio India, personal finance score"
        canonical="/health-score"
        schema={schemas.financialTool(
          "Financial Health Score Calculator",
          "Calculate your financial health score 0-100 based on salary, savings, expenses and loans.",
          "/health-score"
        )}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <PageHeader
          icon="💊"
          title="Financial Health Score"
          subtitle="Get a comprehensive 0–100 score based on your income, savings, debt, and expenses."
          badge="Takes 60 seconds"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-7 items-start">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-base mb-5">Your Financial Details</h3>
              <FinInput label="Monthly Salary (Take-home)" value={form.salary} onChange={(v) => setForm({ ...form, salary: v })} prefix="₹" hint="After TDS & PF deductions" />
              <FinInput label="Monthly Expenses" value={form.expenses} onChange={(v) => setForm({ ...form, expenses: v })} prefix="₹" hint="Rent, food, utilities, transport" />
              <FinInput label="Monthly Savings" value={form.savings} onChange={(v) => setForm({ ...form, savings: v })} prefix="₹" hint="SIPs, RD, FD top-ups" />
              <FinInput label="Total Monthly EMI / Loans" value={form.loans} onChange={(v) => setForm({ ...form, loans: v })} prefix="₹" hint="Sum of all active loan EMIs" />
              <Button onClick={handleCalculate} size="lg" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Calculating...</> : "Calculate My Score →"}
              </Button>
            </CardContent>
          </Card>

          {result ? (
            <div className="flex flex-col gap-5 animate-fade-in">
              <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-100">
                <CardContent className="p-7 flex items-center gap-7">
                  <ScoreRing score={result.score} size={130} />
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">Financial Health Score</p>
                    <p className={`text-6xl font-black font-display leading-none ${scoreColor}`}>
                      {result.score}<span className="text-2xl text-muted-foreground">/100</span>
                    </p>
                    <div className="mt-2">
                      <Badge variant={result.score >= 75 ? "green" : result.score >= 50 ? "yellow" : "red"}>
                        Status: {result.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-sm">Score Breakdown</h3>
                  <GaugeBar value={Math.min((result.savingsRate / 30) * 100, 100)} label={`Savings Rate: ${result.savingsRate.toFixed(1)}% (target ≥ 20%)`} />
                  <GaugeBar value={Math.max(100 - result.dti * 2, 0)} label={`DTI Health: ${result.dti.toFixed(1)}% debt-to-income (safe < 40%)`} />
                  <GaugeBar value={Math.min((result.emergencyCoverageDays / 180) * 100, 100)} label={`Emergency Coverage: ${Math.round(result.emergencyCoverageDays)} days`} />
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Savings Rate" value={`${result.savingsRate.toFixed(1)}%`} status={result.savingsRate >= 20 ? "good" : "warn"} target="Target: ≥ 20%" icon="💰" />
                <MetricCard label="Debt-to-Income" value={`${result.dti.toFixed(1)}%`} status={result.dti <= 40 ? "good" : "bad"} target="Safe: < 40%" icon="📊" />
                <MetricCard label="Emergency Coverage" value={`${Math.round(result.emergencyCoverageDays)} days`} status={result.emergencyCoverageDays >= 180 ? "good" : result.emergencyCoverageDays >= 60 ? "warn" : "bad"} target="Target: 180 days (6m)" icon="🛡️" />
                <MetricCard label="Monthly Surplus" value={formatCurrency(result.monthSurplus)} status={result.monthSurplus > 0 ? "good" : "bad"} target="Should be positive" icon="✅" />
              </div>

              {result.suggestions.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-sm mb-3">💡 Recommendations</h3>
                    <ul className="space-y-2.5">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                          <span className="text-fin-green font-bold shrink-0">→</span>{s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button asChild variant="outline" className="flex-1"><Link to="/dashboard">View Dashboard</Link></Button>
                <Button asChild variant="ghost" className="flex-1"><Link to="/emi-checker">Check EMI Safety →</Link></Button>
              </div>
            </div>
          ) : (
            <EmptyState icon="💊" title="Your Score Awaits" description="Fill in your financial details and click calculate to get your personalized health score." />
          )}
        </div>
      </div>
    </>
  );
}
