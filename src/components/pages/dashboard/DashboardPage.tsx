import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, Progress } from "@/components/ui/primitives";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { GaugeBar, MetricCard } from "@/components/shared/index";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { formatCurrency, formatLakhsCrores, clamp, yearsMonths } from "@/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DashboardPage() {
  const health = useAppSelector((s) => s.financial.healthScore);
  const healthInput = useAppSelector((s) => s.financial.healthInput);
  const emi = useAppSelector((s) => s.financial.emiResult);
  const debt = useAppSelector((s) => s.financial.debtResult);
  const debtInput = useAppSelector((s) => s.financial.debtInput);
  const emergency = useAppSelector((s) => s.financial.emergencyResult);
  const emergencyInput = useAppSelector((s) => s.financial.emergencyInput);
  const fi = useAppSelector((s) => s.financial.fiResult);

  const hasAny = health || emi || debt || emergency || fi;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-9">
        <Badge variant="blue" className="mb-3">Your Overview</Badge>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fin-blue to-fin-green flex items-center justify-center text-xl">
            📊
          </div>
          <h1 className="text-3xl font-extrabold text-foreground font-display">Financial Dashboard</h1>
        </div>
        <p className="text-muted-foreground max-w-xl">A unified view of all your financial metrics from every tool.</p>
      </div>

      {!hasAny ? (
        <EmptyDashboard />
      ) : (
        <div className="space-y-7">
          {/* Top KPI Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPICard label="Health Score" value={health ? `${health.score}/100` : "—"} icon="💊" path="/health-score" />
            <KPICard label="EMI Ratio" value={emi ? `${emi.ratio.toFixed(0)}%` : "—"} icon="🏦" path="/emi-checker" />
            <KPICard label="Emergency Fund" value={emergencyInput ? formatLakhsCrores(emergencyInput.currentFund) : "—"} icon="🛡️" path="/emergency-fund" />
            <KPICard label="FI Year" value={fi ? String(fi.fiYear) : "—"} icon="🚀" path="/fi-tracker" />
          </div>

          {/* Main Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Score Panel */}
            {health && healthInput && (
              <Card>
                <CardHeader><CardTitle>Financial Health Overview</CardTitle></CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-6 mb-6">
                    <ScoreRing score={health.score} size={110} />
                    <div>
                      <p className="text-5xl font-black font-display text-fin-blue leading-none">
                        {health.score}
                        <span className="text-xl text-muted-foreground">/100</span>
                      </p>
                      <Badge
                        variant={health.score >= 75 ? "green" : health.score >= 50 ? "yellow" : "red"}
                        className="mt-2"
                      >
                        {health.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <GaugeBar value={clamp((health.savingsRate / 30) * 100, 0, 100)} label={`Savings Rate: ${health.savingsRate.toFixed(1)}%`} />
                    <GaugeBar value={clamp(100 - health.dti * 2, 0, 100)} label={`DTI Health: DTI is ${health.dti.toFixed(1)}%`} />
                    <GaugeBar value={clamp((health.emergencyCoverageDays / 180) * 100, 0, 100)} label={`Emergency Coverage: ${Math.round(health.emergencyCoverageDays)} days`} />
                  </div>
                  {health.suggestions.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                      <p className="text-xs font-semibold text-fin-blue mb-1">Top Recommendation</p>
                      <p className="text-xs text-muted-foreground">{health.suggestions[0]}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Budget Breakdown Donut */}
            {healthInput && (
              <Card>
                <CardHeader><CardTitle>Monthly Budget Breakdown</CardTitle></CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4">
                    <div style={{ width: "160px", height: "160px", flexShrink: 0 }}>
                      <Doughnut
                        data={{
                          labels: ["Expenses", "Savings", "EMI", "Surplus"],
                          datasets: [{
                            data: [
                              healthInput.expenses,
                              healthInput.savings,
                              healthInput.loans,
                              Math.max(healthInput.salary - healthInput.expenses - healthInput.savings - healthInput.loans, 0),
                            ],
                            backgroundColor: ["#F59E0B", "#00C896", "#EF4444", "#0F4C81"],
                            borderWidth: 0,
                          }],
                        }}
                        options={{
                          cutout: "65%",
                          plugins: { legend: { display: false } },
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      {[
                        { label: "Expenses", value: healthInput.expenses, color: "bg-amber-400" },
                        { label: "Savings", value: healthInput.savings, color: "bg-fin-green" },
                        { label: "EMI", value: healthInput.loans, color: "bg-red-400" },
                        { label: "Surplus", value: Math.max(healthInput.salary - healthInput.expenses - healthInput.savings - healthInput.loans, 0), color: "bg-fin-blue" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <span className="text-muted-foreground">{item.label}</span>
                          </div>
                          <span className="font-semibold">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* EMI */}
            {emi && (
              <Card>
                <CardHeader><CardTitle>EMI Safety</CardTitle></CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="text-center py-2">
                    <p className={`text-4xl font-extrabold font-display ${emi.risk === "Low" ? "text-fin-green" : emi.risk === "Moderate" ? "text-amber-500" : "text-red-500"}`}>
                      {emi.ratio.toFixed(0)}%
                    </p>
                    <Badge variant={emi.risk === "Low" ? "green" : emi.risk === "Moderate" ? "yellow" : "red"} className="mt-1">
                      {emi.risk} Risk
                    </Badge>
                  </div>
                  <GaugeBar value={clamp(emi.ratio * 1.25, 0, 100)} label={`EMI load: ${emi.ratio.toFixed(0)}%`} />
                  <p className="text-xs text-muted-foreground">Safe EMI: {formatCurrency(emi.safeEmi)}</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/emi-checker">Recalculate →</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Debt */}
            {debt && debtInput && (
              <Card>
                <CardHeader><CardTitle>Debt Escape Plan</CardTitle></CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <MetricCard label="Payoff Timeline" value={yearsMonths(debt.months)} status="warn" target={`${debt.months} EMIs remaining`} icon="📅" />
                  <MetricCard label="Interest Savings" value={formatCurrency(debt.interestSaved)} status="good" target="By paying 20% extra EMI" icon="🎯" />
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/debt-planner">Optimize Plan →</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Emergency + FI combined */}
            <Card>
              <CardHeader><CardTitle>Goals Summary</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-4">
                {emergency && emergencyInput && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-muted-foreground">Emergency Fund</span>
                      <span className="font-semibold text-fin-blue">
                        {clamp((emergencyInput.currentFund / emergency.target6m) * 100, 0, 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={clamp((emergencyInput.currentFund / emergency.target6m) * 100, 0, 100)}
                      indicatorClassName={emergencyInput.currentFund >= emergency.target6m ? "bg-fin-green" : "bg-amber-400"}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(emergencyInput.currentFund)} of {formatCurrency(emergency.target6m)} goal
                    </p>
                  </div>
                )}
                {fi && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-muted-foreground">FI Progress (est.)</span>
                      <span className="font-semibold text-fin-green">{fi.fiYear}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ~{fi.years.toFixed(1)} years to financial independence
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Corpus needed: {formatLakhsCrores(fi.corpusNeeded)}
                    </p>
                  </div>
                )}
                {!emergency && !fi && (
                  <p className="text-sm text-muted-foreground">Use the Emergency Fund and FI Tracker tools to see your goals here.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({ label, value, icon, path }: { label: string; value: string; icon: string; path: string }) {
  return (
    <Link to={path}>
      <Card className="cursor-pointer">
        <CardContent className="p-5 text-center">
          <div className="text-3xl mb-1.5">{icon}</div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-extrabold text-fin-blue font-display mt-0.5">{value}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyDashboard() {
  const toolLinks = [
    { label: "Health Score", path: "/health-score", icon: "💊" },
    { label: "EMI Checker", path: "/emi-checker", icon: "🏦" },
    { label: "Debt Planner", path: "/debt-planner", icon: "🔓" },
    { label: "Emergency Fund", path: "/emergency-fund", icon: "🛡️" },
    { label: "FI Tracker", path: "/fi-tracker", icon: "🚀" },
  ];

  return (
    <Card className="text-center p-16 bg-slate-50 border-dashed border-2 border-border">
      <div className="text-6xl mb-5">📊</div>
      <h3 className="text-2xl font-bold text-foreground mb-3">Your Dashboard is Empty</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Use the financial tools to calculate your metrics. Results will automatically appear here in a unified view.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {toolLinks.map((t) => (
          <Button key={t.path} asChild variant="outline" size="sm">
            <Link to={t.path}>{t.icon} {t.label}</Link>
          </Button>
        ))}
      </div>
    </Card>
  );
}
