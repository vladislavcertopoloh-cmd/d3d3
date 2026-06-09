import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ApiStatus } from "@/types/market";

export function MarketStatusCard({ status }: { status: ApiStatus }) {
  const tone = status.state === "live" ? "positive" : status.state === "updating" ? "warning" : "negative";

  return (
    <Card className="bg-white/[0.055]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Market status</p>
          <p className="mt-1 text-2xl font-semibold capitalize">{status.state.replace("_", " ")}</p>
        </div>
        <Badge tone={tone}>{status.state}</Badge>
      </div>
      <p className="mt-3 text-sm text-slate-400">{status.lastUpdated ? `Last updated ${new Date(status.lastUpdated).toLocaleTimeString()}` : "Waiting for first update"}</p>
    </Card>
  );
}
