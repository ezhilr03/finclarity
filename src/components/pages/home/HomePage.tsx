import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/primitives";
import { ScoreRing } from "@/components/shared/ScoreRing";
import { GaugeBar } from "@/components/shared/index";
import { Footer } from "@/components/layout/Footer";
import { TOOLS, HOW_IT_WORKS, HOMEPAGE_STATS } from "@/constants";
import { useAppSelector } from "@/hooks/useAppDispatch";

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <ToolsSection />
      <HowItWorksSection />
      <TrustSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="fin-hero-bg pt-20 pb-16 px-4 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-radial from-fin-green/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-gradient-radial from-fin-blue/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div className="animate-fade-in">
          <Badge variant="green" className="mb-4">🇮🇳 Built for Indian Salaried Professionals</Badge>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-foreground leading-[1.12] font-display mb-5">
            Take Control of Your{" "}
            <span className="text-fin-blue">Financial Life</span>{" "}
            <span className="text-fin-green">in 60 Seconds</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
            FinClarity helps you evaluate financial health, manage debt, and plan your journey to financial independence — instantly, for free.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/health-score">
                <Zap className="w-4 h-4" /> Start Free Health Check
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">
                View Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {HOMEPAGE_STATS.map((s) => (
              <div key={s.value}>
                <p className="text-2xl font-extrabold text-fin-blue font-display">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Demo Card */}
        <LiveDemoCard />
      </div>
    </section>
  );
}

function LiveDemoCard() {
  const healthScore = useAppSelector((s) => s.financial.healthScore);
  const score = healthScore?.score ?? 74;
  const savingsRate = healthScore?.savingsRate ?? 22;
  const dti = healthScore?.dti ?? 35;
  const emergencyCoverage = healthScore
    ? (healthScore.emergencyCoverageDays / 180) * 100
    : 60;

  return (
    <Card className="shadow-2xl border-blue-100 animate-slide-in">
      <CardContent className="p-7">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">Financial Health Score</p>
            <p className="text-sm font-semibold" style={{ color: score >= 75 ? "#00C896" : score >= 50 ? "#F59E0B" : "#EF4444" }}>
              ● {score >= 75 ? "Excellent" : score >= 60 ? "Good" : score >= 50 ? "Stable" : "Needs Work"}
            </p>
          </div>
          <Badge variant="green">Live Demo</Badge>
        </div>

        <div className="flex items-center gap-5 mb-6">
          <ScoreRing score={score} size={110} />
          <div>
            <p className="text-4xl font-extrabold text-fin-blue font-display">
              {score}<span className="text-lg text-muted-foreground">/100</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {score >= 75 ? "Excellent financial health" : score >= 50 ? "Stable — improve emergency fund" : "Needs immediate attention"}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <GaugeBar value={savingsRate * (100 / 30)} label={`Savings Rate: ${savingsRate.toFixed(1)}%`} />
          <GaugeBar value={Math.max(100 - dti * 2, 0)} label={`Debt Health: ${(100 - dti * 1.5).toFixed(0)}%`} />
          <GaugeBar value={emergencyCoverage} label={`Emergency Coverage: ${emergencyCoverage.toFixed(0)}%`} />
        </div>

        <Button asChild className="w-full" size="lg">
          <Link to="/health-score">Calculate Your Score →</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Tools Section ────────────────────────────────────────────────────────────
function ToolsSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="blue" className="mb-3">Our Tools</Badge>
          <h2 className="text-4xl font-extrabold text-foreground font-display">
            Everything You Need to<br />
            <span className="text-fin-blue">Master Your Money</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {TOOLS.map((tool) => (
            <Card key={tool.id} className="group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                    {tool.icon}
                  </div>
                  <Badge variant={tool.badgeVariant}>{tool.badge}</Badge>
                </div>
                <h3 className="font-bold text-foreground mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{tool.description}</p>
                <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-fin-blue group-hover:text-white group-hover:border-fin-blue transition-colors">
                  <Link to={tool.path}>Open Tool →</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="green" className="mb-3">Simple Process</Badge>
        <h2 className="text-4xl font-extrabold text-foreground font-display mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="text-left">
              <p className="text-5xl font-black text-slate-200 font-display leading-none">{step.num}</p>
              <div className="w-10 h-1 rounded-full bg-gradient-to-r from-fin-blue to-fin-green my-2" />
              <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button asChild size="lg" variant="accent">
            <Link to="/health-score">Start Now — It's Free ✨</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Trust Section ────────────────────────────────────────────────────────────
function TrustSection() {
  const items = [
    { icon: <Zap className="w-5 h-5 text-fin-blue" />, title: "Instant Results", desc: "No waiting. Get your score in under 60 seconds." },
    { icon: <Shield className="w-5 h-5 text-fin-green" />, title: "100% Private", desc: "No login needed. Your data never leaves your browser." },
    { icon: <Target className="w-5 h-5 text-amber-500" />, title: "India-Specific", desc: "Built around Indian salary structures and financial norms." },
    { icon: <TrendingUp className="w-5 h-5 text-fin-blue" />, title: "Evidence-Based", desc: "Calculations rooted in proven personal finance principles." },
  ];
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} className="text-center p-5 rounded-2xl border border-border hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
              {item.icon}
            </div>
            <p className="font-semibold text-sm text-foreground mb-1">{item.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-fin-blue to-fin-blue-light">
      <div className="max-w-2xl mx-auto text-center">
        {submitted ? (
          <div className="animate-fade-in">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-extrabold text-white font-display mb-2">You're subscribed!</h2>
            <p className="text-blue-100">Watch your inbox for monthly financial insights.</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-4">📬</div>
            <h2 className="text-3xl font-extrabold text-white font-display mb-3">Monthly Financial Insights</h2>
            <p className="text-blue-100 mb-7 leading-relaxed">
              Get monthly financial score reminders and expert tips on your journey to financial independence.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border-none outline-none text-sm font-medium"
              />
              <Button
                variant="accent"
                onClick={() => email && setSubmitted(true)}
              >
                Subscribe
              </Button>
            </div>
            <p className="text-blue-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </section>
  );
}
