import { assets, history, snapshot, unavailableRow } from '@/lib/market-data';
import { authorizeApiRequest } from '@/lib/access-control';
import { canAccess } from '@/lib/entitlements';
import { quoteIsStale } from '@/lib/analysis-context';

export async function GET() {
  const auth = await authorizeApiRequest();
  if (auth.response) return auth.response;
  const visibleAssets = canAccess('ALL_ASSETS', auth.context.membership) ? assets : assets.slice(0, 12);
  const settled = await Promise.allSettled(visibleAssets.map(async asset => {
    const points = await history(asset.key);
    const dataUpdatedAt = points.at(-1)?.t ?? 0;
    const stale = quoteIsStale(asset.kind, dataUpdatedAt);
    const source = asset.kind === 'Crypto' ? 'Binance / Yahoo Finance' : 'Yahoo Finance';
    return stale
      ? { ...unavailableRow(asset), stale, dataUpdatedAt, source }
      : { ...asset, ...snapshot(asset.key, points), stale, dataUpdatedAt, source };
  }));
  return Response.json({
    rows: settled.map((result, index) => result.status === 'fulfilled' ? result.value : unavailableRow(visibleAssets[index])),
    limited: visibleAssets.length < assets.length,
    totalAssets: assets.length,
    updatedAt: new Date().toISOString(),
  }, { headers: { 'Cache-Control': 'private, max-age=120' } });
}
