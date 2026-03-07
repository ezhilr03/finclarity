import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/primitives";
import { PageHeader, EmptyState, FinInput } from "@/components/shared/index";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { setFIResult } from "@/store/slices/financialSlice";
import { calculateFI } from "@/services/financialCalculations";
import { formatCurrency, formatLakhsCrores } from "@/utils";
import type { FIInput } from "@/types/financial";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export function FITrackerPage() {
  const dispatch = useAppDispatch();
  const savedResult = useAppSelector((s) => s.financial.fiResult);
  const savedInput = useAppSelector((s) => s.financial.fiInput);

  const [form, setForm] = useState<FIInput>(
    savedInput ?? { monthlyInvestment: 15000, expectedReturns: 12, desiredExpenses: 50000 }
  );

  const handleCalculate = () => {
    const r = calculateFI(form);
    dispatch(setFIResult({ result: r, input: form }));
  };

  const result = savedResult;

  // Build growth chart data
  const buildChartData = () => {
    if (!result) return null;
    const monthlyRate = form.expectedReturns / 100 / 12;
    const totalMonths = Math.ceil(result.years * 12);
    const step = Math.max(1, Math.floor(totalMonths / 20));
    const labels: string[] = [];
    const values: number[] = [];

    for (let m = 0; m <= totalMonths; m += step) {
      const fv = monthlyRate === 0
        ? form.monthlyInvestment * m
        : form.monthlyInvestment * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate);
      labels.push(`Y${Math.floor(m / 12)}`);
      values.push(Math.round(fv));
    }
    return { labels, values };
  };

  const chartInfo = buildChartData();

  const chartData = chartInfo
    ? {
        labels: chartInfo.labels,
        datasets: [
          {
            label: "Corpus (₹)",
            data: chartInfo.values,
            borderColor: "#0F4C81",
            backgroundColor: "rgba(15, 76, 129, 0.08)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: "Target",
            data: chartInfo.labels.map(() => result!.corpusNeeded),
            borderColor: "#00C896",
            borderDash: [5, 5],
            backgroundColor: "transparent",
            pointRadius: 0,
            borderWidth: 1.5,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" as const } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: {
        grid: { color: "#F1F5F9" },
        ticks: {
          font: { size: 10 },
          callback: (v: string | number) => `₹${formatLakhsCrores(Number(v)).replace("₹", "")}`,
        },
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        icon="🚀"
        title="Financial Independence Tracker"
        subtitle="Discover when you can retire and live off your investments forever."
        badge="Plan Your Freedom"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-7">
        {/* Input */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-base mb-5">Your Investment Plan</h3>
            <FinInput
              label="Monthly Investment Amount"
              value={form.monthlyInvestment}
              onChange={(v) => setForm({ ...form, monthlyInvestment: v })}
              prefix="₹"
              hint="SIP, mutual funds, stocks, etc."
            />
            <FinInput
              label="Expected Annual Returns"
              value={form.expectedReturns}
              onChange={(v) => setForm({ ...form, expectedReturns: v })}
              suffix="%"
              hint="Conservative: 10–12% for equity mutual funds"
            />
            <FinInput
              label="Desired Monthly Lifestyle Expenses"
              value={form.desiredExpenses}
              onChange={(v) => setForm({ ...form, desiredExpenses: v })}
              prefix="₹"
              hint="The lifestyle you want after retirement"
            />
            <Button onClick={handleCalculate} variant="accent" size="lg" className="w-full mt-2">
              Find My FI Date →
            </Button>

            <div className="mt-5 p-4 bg-emerald-50 rounded-xl">
              <p className="text-xs font-semibold text-fin-green uppercase tracking-wider mb-2">📌 4% Rule Explained</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Financial independence = corpus of <strong>25× annual expenses</strong>. You can safely withdraw 4% per year indefinitely.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result ? (
          <div className="flex flex-col gap-5">
            {/* FI Date Banner */}
            <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200 text-center">
              <CardContent className="p-8">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2">
                  🎯 Your Financial Independence Year
                </p>
                <p className="text-8xl font-black text-fin-green font-display leading-none">
                  {result.fiYear}
                </p>
                <p className="text-muted-foreground mt-2 text-base">
                  In approximately <strong>{result.years.toFixed(1)} years</strong>
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    Corpus Needed: {formatLakhsCrores(result.corpusNeeded)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Growth Chart */}
            {chartData && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-sm mb-4">Investment Corpus Growth</h3>
                  <div style={{ height: "180px" }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Milestones */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-4">🏁 Journey Milestones</h3>
                <div className="space-y-4">
                  {result.milestones.map((m) => (
                    <div key={m.pct}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-foreground">
                          {m.pct}% FI — {formatCurrency(m.amount)}
                        </span>
                        <span className="text-muted-foreground">In {m.years} years</span>
                      </div>
                      <Progress
                        value={m.pct}
                        indicatorClassName={m.pct === 100 ? "bg-fin-green" : "bg-fin-blue"}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-5">
                <p className="text-sm text-emerald-800 leading-relaxed">
                  💡 Increasing your monthly investment by just <strong className="text-fin-blue">₹5,000</strong> could
                  bring your FI date forward by approximately{" "}
                  <strong>{Math.round(result.years * 0.08 * 12)} months</strong>. Small increases compound to
                  huge differences over time.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState
            icon="🚀"
            title="Discover Your Freedom Date"
            description="Enter your investment amount and lifestyle expenses to calculate your Financial Independence year."
          />
        )}
      </div>
    </div>
  );
}
