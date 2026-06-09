import { cn } from "@/lib/utils/style";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("rounded-lg border border-white/10 bg-slate-950/45 p-4 shadow-soft backdrop-blur-xl", className)}>{children}</section>;
}
