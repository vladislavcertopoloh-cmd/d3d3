import { cn } from "@/lib/utils/style";

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "positive" | "negative" | "warning"; children: React.ReactNode }) {
  const tones = {
    neutral: "bg-white/10 text-slate-200",
    positive: "bg-emerald-400/15 text-emerald-300",
    negative: "bg-rose-400/15 text-rose-300",
    warning: "bg-amber-400/15 text-amber-300"
  };

  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>{children}</span>;
}
