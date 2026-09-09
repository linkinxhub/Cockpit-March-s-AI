import assert from "node:assert/strict";
import test, { after, afterEach, beforeEach } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({
  appType: "custom", configFile: false, root,
  resolve: { alias: { "@": root } },
  server: { middlewareMode: true, hmr: false, watch: null },
  plugins: [{
    name: "analysis-test-auth",
    enforce: "pre",
    resolveId(id) {
      if (id === `${root}lib/access-control` || id.endsWith("/lib/access-control")) return "\0test-account";
      if (id.endsWith("/lib/ai-settings")) return "\0test-settings";
      if (id.endsWith("/lib/ai-allowance")) return "\0test-allowance";
      if (id.endsWith("/lib/usage-store")) return "\0test-usage";
      if (id === "next/server") return "\0test-response";
    },
    load(id) {
      if (id === "\0test-settings") return "export async function getAICredentials(){return {apiKey:process.env.OPENAI_API_KEY,model:\"test-model\"};}";
      if (id === "\0test-allowance") return "export async function reserveAIAllowance(){globalThis.__analysisUsageCalls++;return {id:\"test\"};} export async function refundAIAllowance(){globalThis.__analysisRefunds++;}";
      if (id === "\0test-account") return "export async function authorizeFeatureApi() { return globalThis.__analysisTestAccess; }";
      if (id === "\0test-usage") return "export class UsageLimitError extends Error {} export async function consumeMonthlyUsage() { globalThis.__analysisUsageCalls++; }";
      if (id === "\0test-response") return "export const NextResponse = Response;";
    },
  }],
});
const { GET, POST } = await vite.ssrLoadModule("/app/api/ai-analysis/route.ts");
const { isLiveContext, quoteIsStale, includeActiveTimeframe } = await vite.ssrLoadModule("/lib/analysis-context.ts");
const { assets } = await vite.ssrLoadModule("/lib/market-data.ts");
const originalFetch = globalThis.fetch;
const originalKey = process.env.OPENAI_API_KEY;
let user = 0;
let upstreamCalls = 0;
const analysis = {
  decision: "ATTENDRE", confidence: 55, summary: "Données mitigées.",
  drivers: ["Tendance"], risks: ["Volatilité"], invalidation: "Cassure confirmée.",
  horizon: "1 jour", disclaimer: "Analyse éducative.",
};
const snapshot = () => ({ locale: "fr", timeframe: "1d", asset: { symbol: "BTC/USDT", price: 100 } });
const post = (body) => POST(new Request("https://example.test/api/ai-analysis", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
}));
beforeEach(() => {
  process.env.OPENAI_API_KEY = "test-placeholder";
  globalThis.__analysisTestAccess = { context: { identity: { id: `test-user-${++user}` }, membership: { role: "EXPERT" } } };
  upstreamCalls = 0;
  globalThis.__analysisUsageCalls = 0;globalThis.__analysisRefunds=0;
  globalThis.fetch = async () => { upstreamCalls++; throw new Error("Unexpected external request"); };
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalKey;
  delete globalThis.__analysisTestAccess;
  delete globalThis.__analysisUsageCalls;
});
after(() => vite.close());

test("missing key reports configuration without calling the provider", async () => {
  delete process.env.OPENAI_API_KEY;
  const status = await GET();
  assert.equal(status.status, 200);
  assert.deepEqual(await status.json(), { configured: false });
  assert.equal(status.headers.get("Cache-Control"), "no-store");
  const response = await post(snapshot());
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { code: "OPENAI_NOT_CONFIGURED" });
  assert.equal(upstreamCalls, 0);
  assert.equal(globalThis.__analysisUsageCalls, 0);
});

test("configuration and analysis both enforce account access", async () => {
  for (const [status, code] of [[401, "AUTH_REQUIRED"], [403, "PLAN_UPGRADE_REQUIRED"], [403, "ACCOUNT_SUSPENDED"]]) {
    globalThis.__analysisTestAccess = { response: Response.json({code}, {status}) };
    assert.equal((await GET()).status, status);
    assert.equal((await post(snapshot())).status, status);
  }
  assert.equal(upstreamCalls, 0);
  assert.equal(globalThis.__analysisUsageCalls, 0);
});

test("invalid payloads fail with 400 instead of crashing", async () => {
  for (const body of [null, { ...snapshot(), news: {} }, { ...snapshot(), news: [null] }, { ...snapshot(), timeframe: "toString" }, { ...snapshot(), asset: { symbol: "BTC/USDT", price: -1 } }]) {
    assert.equal((await post(body)).status, 400);
  }
  assert.equal(upstreamCalls, 0);
  assert.equal(globalThis.__analysisUsageCalls, 0);
});

test("historical macro snapshots and old news are excluded from AI input", async () => {
  let sent;
  globalThis.fetch = async (_url, options) => {
    assert.ok(options.signal instanceof AbortSignal);
    sent = JSON.parse(JSON.parse(options.body).input.split("\n").slice(1).join("\n"));
    return Response.json({ model: "test-model", output_text: JSON.stringify(analysis) });
  };
  const response = await post({
    ...snapshot(), bigdata: { asset: "BTC/USDT", connected: false, updatedAt: "2026-08-28T21:22:00.000Z", bias: -3 },
    news: [{ title: "Old headline", publishedAt: Date.now() - 72 * 60 * 60_000 }, { title: "Current headline", publishedAt: Date.now() }],
  });
  assert.equal(response.status, 200);
  assert.equal(sent.bigdata, null);
  assert.deepEqual(sent.news.map((n) => n.title), ["Current headline"]);
  assert.deepEqual((await response.json()).analysis, analysis);
});

test("invalid provider output cannot reach the UI", async () => {
  globalThis.fetch = async () => Response.json({ output_text: JSON.stringify({ ...analysis, drivers: "invalid" }) });
  const response = await post(snapshot());
  assert.equal(response.status, 502);
  assert.equal((await response.json()).code, "OPENAI_ERROR");
});

test("provider timeout is a recoverable response", async () => {
  globalThis.fetch = async () => { throw new DOMException("Timed out", "TimeoutError"); };
  const response = await post(snapshot());
  assert.equal(response.status, 504);
  assert.equal((await response.json()).code, "OPENAI_TIMEOUT");
  assert.equal(globalThis.__analysisRefunds,1);
});

test("all cryptocurrencies reject seven-hour-old quotes", () => {
  const now = Date.now();
  const cryptos = assets.filter((asset) => asset.kind === "Crypto");
  assert.ok(cryptos.length > 10);
  for (const asset of cryptos) assert.equal(quoteIsStale(asset.kind, now - 7 * 60 * 60_000, now), true, asset.key);
  assert.equal(quoteIsStale("Indices", now - 48 * 60 * 60_000, now), false);
});

test("macro context must match the asset and freshness window", () => {
  const now = Date.now();
  const context = { asset: "BTC/USDT", connected: true, updatedAt: new Date(now).toISOString() };
  assert.equal(isLiveContext(context, "BTC/USDT", now), true);
  assert.equal(isLiveContext(context, "ETH/USDT", now), false);
  assert.equal(isLiveContext(context, "BTC/USDT", now + 31 * 60_000), false);
  assert.equal(isLiveContext({ ...context, connected: false }, "BTC/USDT", now), false);
});

test("30m, 45m and 6mo use the active forecast rather than the first comparison", () => {
  for (const period of ["30m", "45m", "6mo", "1d"]) {
    const current = { period, decision: "VENDRE", price: 90 };
    const result = includeActiveTimeframe([{ period: "15m", decision: "ACHETER", price: 100 }, { period: "1d", decision: "ACHETER", price: 100 }], current);
    assert.deepEqual(result.find((item) => item.period === period), current);
    assert.equal(result.filter((item) => item.period === period).length, 1);
  }
});
