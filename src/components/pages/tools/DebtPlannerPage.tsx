import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard, PageHeader, EmptyState, FinInput } from "@/components/shared/index";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setDebtResult } from "@/store/slices/financialSlice";
import { calculateDebtPlan } from "@/services/financialCalculations";
import { formatCurrency, yearsMonths } from "@/utils";
import type { DebtInput } from "@/types/financial";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function DebtPlannerPage() {
  const dispatch = useAppDispatch();
  const savedResult = useAppSelector((s) => s.financial.debtResult);
  const savedInput = useAppSelector((s) => s.financial.debtInput);

  const [form, setForm] = useState<DebtInput>(savedInput ?? { principal: 500000, rate: 12, emi: 15000 });

  const handleCalculate = () => {
    try {
      const r = calculateDebtPlan(form);
      dispatch(setDebtResult({ result: r, input: form }));
    } catch (e) {
      alert("Invalid values — ensure EMI is greater than monthly interest.");
    }
  };

  const result = savedResult;

  const chartData = result
    ? {
        labels: result.amortization.map((a) => `M${a.month}`),
        datasets: [
          {
            label: "Principal",
            data: result.amortization.map((a) => a.principalPaid),
            backgroundColor: "#00C896",
            borderRadius: 3,
            stack: "a",
          },
          {
            label: "Interest",
            data: result.amortization.map((a) => a.interestPaid),
            backgroundColor: "#EF4444",
            borderRadius: 3,
            stack: "a",
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 }, maxTicksLimit: 12 } },
      y: { grid: { color: "#F1F5F9" }, ticks: { font: { size: 10 } } },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        icon="🔓"
        title="Debt Escape Planner"
        subtitle="Find the fastest path out of debt and calculate how much interest you can save."
        badge="Optimize Repayment"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-7 items-start">
        {/* Input */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-base mb-5">Loan Details</h3>
            <FinInput
              label="Outstanding Loan Amount"
              value={form.principal}
              onChange={(v) => setForm({ ...form, principal: v })}
              prefix="₹"
            />
            <FinInput
              label="Annual Interest Rate"
              value={form.rate}
              onChange={(v) => setForm({ ...form, rate: v })}
              suffix="%"
              hint="e.g. 12 for 12% p.a."
            />
            <FinInput
              label="Current Monthly EMI"
              value={form.emi}
              onChange={(v) => setForm({ ...form, emi: v })}
              prefix="₹"
            />
            <Button onClick={handleCalculate} size="lg" className="w-full mt-2">
              Plan My Escape →
            </Button>
          </CardContent>
        </Card>

        {/* Result */}
        {result ? (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                label="Payoff Timeline"
                value={yearsMonths(result.months)}
                status="warn"
                target={`${result.months} monthly EMIs`}
                icon="📅"
              />
              <MetricCard
                label="Total Interest"
                value={formatCurrency(result.totalInterest)}
                status="bad"
                target="At current EMI"
                icon="💸"
              />
              <MetricCard
                label="Interest Saved"
                value={formatCurrency(result.interestSaved)}
                status="good"
                target={`Pay 20% extra → save ${result.monthsSaved}m`}
                icon="🎯"
              />
            </div>

            {/* Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-4">Principal vs Interest Per Month</h3>
                <div style={{ height: "200px" }}>
                  {chartData && <Bar data={chartData} options={chartOptions} />}
                </div>
              </CardContent>
            </Card>

            {/* Accelerated Plan */}
            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm text-foreground mb-2">🚀 Accelerated Repayment Plan</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  By increasing your EMI by just 20% to{" "}
                  <strong className="text-fin-blue">{formatCurrency(result.extraEmi)}</strong>, you can:
                </p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-3xl font-extrabold text-fin-green font-display">{result.monthsSaved}</p>
                    <p className="text-xs text-muted-foreground">months saved from tenure</p>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-fin-green font-display">
                      {formatCurrency(result.interestSaved)}
                    </p>
                    <p className="text-xs text-muted-foreground">interest saved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState
            icon="🔓"
            title="Enter Your Loan Details"
            description="Input your loan amount, interest rate, and EMI to get your personalized debt escape plan."
          />
        )}
      </div>
    </div>
  );
}
