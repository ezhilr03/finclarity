import { cn } from "@/utils";
import { Badge } from "@/components/ui/primitives";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/primitives";

// ─── MetricCard ──────────────────────────────────────────────────────────────
type MetricStatus = "good" | "warn" | "bad";

interface MetricCardProps {
  label: string;
  value: string;
  status: MetricStatus;
  target: string;
  icon: string;
}

const statusConfig: Record<MetricStatus, { bg: string; border: string; color: string }> = {
  good: { bg: "bg-emerald-50", border: "border-emerald-200", color: "text-fin-green" },
  warn: { bg: "bg-amber-50", border: "border-amber-200", color: "text-amber-600" },
  bad: { bg: "bg-red-50", border: "border-red-200", color: "text-red-500" },
};

export function MetricCard({ label, value, status, target, icon }: MetricCardProps) {
  const cfg = statusConfig[status];
  return (
    <div className={cn("rounded-xl p-4 border", cfg.bg, cfg.border)}>
      <div className="text-2xl mb-1.5">{icon}</div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{label}</p>
      <p className={cn("text-2xl font-extrabold font-display mt-0.5", cfg.color)}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{target}</p>
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
interface PageHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
}

export function PageHeader({ icon, title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-9 animate-fade-in">
      <Badge variant="blue" className="mb-3">{badge}</Badge>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fin-blue to-fin-green flex items-center justify-center text-xl">
          {icon}
        </div>
        <h1 className="text-3xl font-extrabold text-foreground font-display">{title}</h1>
      </div>
      <p className="text-muted-foreground max-w-xl leading-relaxed">{subtitle}</p>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[340px] rounded-2xl border-2 border-dashed border-border bg-muted/40 text-center p-8">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">{description}</p>
    </div>
  );
}

// ─── FinInput ─────────────────────────────────────────────────────────────────
interface FinInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  min?: number;
  max?: number;
}

export function FinInput({ label, value, onChange, prefix, suffix, hint }: FinInputProps) {
  return (
    <div className="mb-4">
      <Label className="block mb-1.5 text-sm font-semibold">{label}</Label>
      <div className="flex items-center rounded-xl border border-input bg-muted/40 overflow-hidden focus-within:ring-2 focus-within:ring-fin-blue focus-within:border-transparent transition-all">
        {prefix && (
          <span className="px-3 py-2.5 text-sm text-muted-foreground border-r border-input bg-muted font-medium">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="border-none bg-transparent rounded-none focus-visible:ring-0 font-medium"
        />
        {suffix && (
          <span className="px-3 text-sm text-muted-foreground">{suffix}</span>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

// ─── GaugeBar ─────────────────────────────────────────────────────────────────
interface GaugeBarProps {
  value: number; // 0–100
  label?: string;
  colorClass?: string;
}

export function GaugeBar({ value, label, colorClass }: GaugeBarProps) {
  const pct = Math.min(Math.max(value, 0), 100);
  const auto = pct < 40 ? "bg-red-400" : pct < 70 ? "bg-amber-400" : "bg-fin-green";
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className={cn("text-xs font-semibold", colorClass ?? auto.replace("bg-", "text-"))}>{pct.toFixed(0)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", colorClass ?? auto)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
