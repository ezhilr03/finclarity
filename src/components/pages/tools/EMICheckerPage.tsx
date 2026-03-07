import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard, PageHeader, EmptyState, FinInput } from "@/components/shared/index";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setEMIResult } from "@/store/slices/financialSlice";
import { calculateEMISafety } from "@/services/financialCalculations";
import { formatCurrency, clamp } from "@/utils";
import type { EMIInput } from "@/types/financial";

export function EMICheckerPage() {
  const dispatch = useAppDispatch();
  const savedResult = useAppSelector((s) => s.financial.emiResult);
  const savedInput = useAppSelector((s) => s.financial.emiInput);

  const [form, setForm] = useState<EMIInput>(savedInput ?? { salary: 75000, emi: 35000 });

  const handleCalculate = () => {
    const r = calculateEMISafety(form);
    dispatch(setEMIResult({ result: r, input: form }));
  };

  const result = savedResult;

  const riskColor = {
    Low: "text-fin-green",
    Moderate: "text-amber-500",
    High: "text-red-500",
  };
  const riskBadge = {
    Low: "green" as const,
    Moderate: "yellow" as const,
    High: "red" as const,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        icon="🏦"
        title="EMI Safety Checker"
        subtitle="Check if your loan EMI burden is safe or risky relative to your monthly income."
        badge="Instant Analysis"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-7">
        {/* Input */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-base mb-5">Your Details</h3>
            <FinInput
              label="Monthly Take-home Salary"
              value={form.salary}
              onChange={(v) => setForm({ ...form, salary: v })}
              prefix="₹"
            />
            <FinInput
              label="Total Monthly EMI"
              value={form.emi}
              onChange={(v) => setForm({ ...form, emi: v })}
              prefix="₹"
              hint="Sum of all active loan EMIs"
            />
            <Button onClick={handleCalculate} size="lg" className="w-full mt-2">
              Check EMI Safety →
            </Button>

            <div className="mt-5 p-4 bg-blue-50 rounded-xl">
              <p className="text-xs font-semibold text-fin-blue uppercase tracking-wider mb-2">📌 Safe EMI Guidelines</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><span className="font-semibold text-fin-green">Safe Zone:</span> EMI &lt; 35% of salary</li>
                <li><span className="font-semibold text-amber-600">Caution Zone:</span> 35–50% of salary</li>
                <li><span className="font-semibold text-red-500">Danger Zone:</span> &gt;50% of salary</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result ? (
          <div className="flex flex-col gap-5">
            {/* Main Gauge */}
            <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-blue-100">
              <CardContent className="p-7 text-center">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2">
                  EMI-to-Income Ratio
                </p>
                <p className={`text-7xl font-black font-display ${riskColor[result.risk]}`}>
                  {result.ratio.toFixed(0)}
                  <span className="text-3xl">%</span>
                </p>
                <div className="mt-2 mb-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${result.risk === "Low" ? "bg-emerald-100 text-emerald-800" : result.risk === "Moderate" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                    Risk Level: {result.risk}
                  </span>
                </div>

                {/* Visual Gauge Bar */}
                <div className="max-w-sm mx-auto">
                  <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-fin-green via-amber-400 to-red-500">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full border-2 shadow-md transition-all duration-700"
                      style={{
                        left: `${clamp(result.ratio, 0, 80)}%`,
                        borderColor: result.risk === "Low" ? "#00C896" : result.risk === "Moderate" ? "#F59E0B" : "#EF4444",
                        transform: "translateX(-50%) translateY(-50%)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-fin-green font-medium">0% Safe</span>
                    <span className="text-xs text-amber-500 font-medium">35%</span>
                    <span className="text-xs text-red-500 font-medium">50%+ Danger</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                label="Suggested Safe EMI"
                value={formatCurrency(result.safeEmi)}
                status="good"
                target="35% of salary"
                icon="✅"
              />
              <MetricCard
                label="Max Allowed EMI"
                value={formatCurrency(result.maxEmi)}
                status="warn"
                target="50% of salary"
                icon="⚠️"
              />
              <MetricCard
                label="Monthly Surplus"
                value={formatCurrency(result.surplus)}
                status={result.surplus > 0 ? "good" : "bad"}
                target="After all EMI deductions"
                icon="💰"
              />
              <MetricCard
                label="Current EMI"
                value={formatCurrency(form.emi)}
                status={result.risk === "Low" ? "good" : result.risk === "Moderate" ? "warn" : "bad"}
                target={`Risk: ${result.risk}`}
                icon="🏦"
              />
            </div>

            {result.risk !== "Low" && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-5">
                  <h3 className="font-bold text-sm text-amber-900 mb-2">⚠️ Action Recommended</h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Your EMI is {result.risk === "High" ? "dangerously" : "moderately"} high. Consider prepaying{" "}
                    <strong>{formatCurrency(form.emi - result.safeEmi)}</strong> of outstanding principal, or avoid
                    taking new loans until your EMI ratio drops below 35%.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <EmptyState
            icon="🏦"
            title="Enter Your EMI Details"
            description="Fill in your salary and EMI to check your financial safety ratio."
          />
        )}
      </div>
    </div>
  );
}
