/** Shared, deterministic reading aids. These functions never request an AI analysis. */
export type Reading = "ACHETER" | "VENDRE" | "ATTENDRE";
export type Horizon = { period: string; decision: string };
const order = ["15m", "30m", "45m", "1h", "4h", "1d", "1w", "1mo", "6mo", "1y"];
export const isReading = (value: unknown): value is Reading =>
  value === "ACHETER" || value === "VENDRE" || value === "ATTENDRE";

export function compareHorizons(values: readonly Horizon[]) {
  const unique = new Map<string, Horizon>();
  const conflicts = new Set<string>();
  for (const item of values) {
    if (!order.includes(item.period) || !isReading(item.decision)) continue;
    if (unique.has(item.period) && unique.get(item.period)?.decision !== item.decision) conflicts.add(item.period);
    unique.set(item.period, item);
  }
  const items = [...unique.values()].filter(item => !conflicts.has(item.period))
    .sort((a, b) => order.indexOf(a.period) - order.indexOf(b.period));
  const decisions = new Set(items.map(item => item.decision));
  const state = items.length < 2 ? "insufficient" : decisions.size === 1 ? "aligned"
    : decisions.has("ACHETER") && decisions.has("VENDRE") ? "opposed" : "mixed";
  return { state, items, shortest: items[0], longest: items.at(-1) } as const;
}

export type SnapshotEvidence = {
  sourceVersion?: 2;
  assetKey?: string;
  engine?: string;
  recordedAtIso?: string;
  technicalDecision?: string;
  summary?: string;
  invalidation?: string;
  source?: string;
  dataUpdatedAt?: number | null;
};
export type ComparableSnapshot = SnapshotEvidence & {
  symbol: string; period: string; decision: string; price: number | null;
};

export function latestComparableSnapshot<T extends ComparableSnapshot>(
  snapshots: readonly T[], current: { assetKey: string; period: string; engine: string }, now = Date.now(),
): T | null {
  return snapshots.filter(item => item && item.sourceVersion === 2 && item.assetKey === current.assetKey
    && item.period === current.period && item.engine === current.engine && isReading(item.decision)
    && typeof item.price === "number" && Number.isFinite(item.price) && item.price > 0
    && typeof item.recordedAtIso === "string" && Number.isFinite(Date.parse(item.recordedAtIso))
    && Date.parse(item.recordedAtIso) <= now)
    .sort((a, b) => Date.parse(b.recordedAtIso!) - Date.parse(a.recordedAtIso!))[0] ?? null;
}

export function observedPriceChange(previous: number | null, current: number | null): number | null {
  if (previous === null || current === null || !Number.isFinite(previous) || !Number.isFinite(current) || previous <= 0 || current <= 0) return null;
  return (current / previous - 1) * 100;
}

export function snapshotReady(technical: { unavailable: boolean; stale?: boolean; last: number | null; decision: string } | null, busy: boolean) {
  return Boolean(technical && !busy && !technical.unavailable && !technical.stale
    && technical.last !== null && Number.isFinite(technical.last) && technical.last > 0 && isReading(technical.decision));
}
