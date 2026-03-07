import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/primitives";
import { MetricCard, PageHeader, EmptyState, FinInput } from "@/components/shared/index";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setEmergencyResult } from "@/store/slices/financialSlice";
import { calculateEmergencyFund } from "@/services/financialCalculations";
import { formatCurrency, clamp } from "@/utils";
import type { EmergencyInput } from "@/types/financial";

export function EmergencyFundPage() {
  const dispatch = useAppDispatch();
  const savedResult = useAppSelector((s) => s.financial.emergencyResult);
  const savedInput = useAppSelector((s) => s.financial.emergencyInput);

  const [form, setForm] = useState<EmergencyInput>(
    savedInput ?? { expenses: 40000, currentFund: 80000 }
  );

  const handleCalculate = () => {
    const r = calculateEmergencyFund(form);
    dispatch(setEmergencyResult({ result: r, input: form }));
  };

  const result = savedResult;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        icon="🛡️"
        title="Emergency Fund Calculator"
        subtitle="Calculate your ideal emergency fund — your financial safety net for unexpected events."
        badge="Essential Tool"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-7">
        {/* Input */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-base mb-5">Your Monthly Expenses</h3>
            <FinInput
              label="Total Monthly Expenses"
              value={form.expenses}
              onChange={(v) => setForm({ ...form, expenses: v })}
              prefix="₹"
              hint="Rent, food, utilities, transport, etc."
            />
            <FinInput
              label="Current Emergency Fund"
              value={form.currentFund}
              onChange={(v) => setForm({ ...form, currentFund: v })}
              prefix="₹"
              hint="Savings in liquid accounts (FD, savings account)"
            />
            <Button onClick={handleCalculate} size="lg" className="w-full mt-2">
              Calculate Fund Size →
            </Button>

            <div className="mt-5 p-4 bg-emerald-50 rounded-xl">
              <p className="text-xs font-semibold text-fin-green uppercase tracking-wider mb-2">🛡️ Emergency Fund Rules</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><strong>Minimum:</strong> 3 months of expenses</li>
                <li><strong>Recommended:</strong> 6 months of expenses</li>
                <li><strong>Ideal:</strong> 12 months (self-employed / freelancers)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result ? (
          <div className="flex flex-col gap-5">
            {/* Target Cards */}
            <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-4">Your Emergency Fund Targets</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: "Minimum (3m)", value: result.target3m, icon: "⚡", color: "text-amber-600" },
                    { label: "Recommended (6m)", value: result.target6m, icon: "🛡️", color: "text-fin-blue" },
                    { label: "Ideal (12m)", value: result.target12m, icon: "🏆", color: "text-fin-green" },
                  ].map((t) => (
                    <div key={t.label}>
                      <div className="text-2xl mb-1">{t.icon}</div>
                      <p className="text-xs text-muted-foreground mb-1">{t.label}</p>
                      <p className={`text-lg font-extrabold font-display ${t.color}`}>
                        {formatCurrency(t.value)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                label="Current Fund"
                value={formatCurrency(form.currentFund)}
                status={result.monthsCoverage >= 6 ? "good" : result.monthsCoverage >= 3 ? "warn" : "bad"}
                target={`${result.monthsCoverage.toFixed(1)} months coverage`}
                icon="💰"
              />
              <MetricCard
                label="Gap to 6-Month Goal"
                value={formatCurrency(result.gap)}
                status={result.gap === 0 ? "good" : result.gap < result.target6m * 0.5 ? "warn" : "bad"}
                target={result.gap === 0 ? "Goal achieved! 🎉" : "Need to build more"}
                icon="🎯"
              />
            </div>

            {/* Coverage Progress */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-4">Current Coverage Progress</h3>
                <div className="space-y-3">
                  {[
                    { label: "Vs 3-Month Target", value: clamp((form.currentFund / result.target3m) * 100, 0, 100) },
                    { label: "Vs 6-Month Target (Recommended)", value: clamp((form.currentFund / result.target6m) * 100, 0, 100) },
                    { label: "Vs 12-Month Ideal", value: clamp((form.currentFund / result.target12m) * 100, 0, 100) },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{bar.label}</span>
                        <span className="font-semibold text-fin-blue">{bar.value.toFixed(0)}%</span>
                      </div>
                      <Progress value={bar.value} indicatorClassName={bar.value >= 100 ? "bg-fin-green" : bar.value >= 50 ? "bg-amber-400" : "bg-red-400"} />
                    </div>
                  ))}
                </div>

                {result.gap > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                    <p className="text-xs text-amber-800">
                      💡 Set aside <strong>{formatCurrency(form.expenses * 0.1)}/month</strong> (10% of expenses) to reach your
                      6-month goal in approximately <strong>{result.monthsToGoal} months</strong>.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState
            icon="🛡️"
            title="Calculate Your Safety Net"
            description="Enter your monthly expenses to find out how much emergency fund you need."
          />
        )}
      </div>
    </div>
  );
}
