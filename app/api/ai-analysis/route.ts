import {getAICredentials} from '@/lib/ai-settings';
import { NextRequest, NextResponse } from "next/server";
import { authorizeFeatureApi } from "@/lib/access-control";
import { consumeMonthlyUsage, UsageLimitError } from "@/lib/usage-store";
import { isLiveContext, isRecentTimestamp } from "@/lib/analysis-context";
import { chartPeriods } from "@/lib/market-data";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 12;
const requests = new Map<string, { count: number; resetAt: number }>();
const locales = new Set(["fr", "en", "de", "nl"]);
const analysisSchema = z.object({
  decision: z.enum(["ACHETER", "VENDRE", "ATTENDRE"]),
  confidence: z.number().int().min(0).max(100),
  summary: z.string().min(1), drivers: z.array(z.string()), risks: z.array(z.string()),
  invalidation: z.string(), horizon: z.string(), disclaimer: z.string(),
});

export async function GET() {
  const access = await authorizeFeatureApi("AI_INSTANT_ANALYSIS");
  if (access.response) return access.response;
  try{const config=await getAICredentials();return NextResponse.json({configured:!!config.apiKey},{headers:{"Cache-Control":"no-store"}});}catch{return NextResponse.json({code:"AI_SETTINGS_UNAVAILABLE"},{status:503});}
}

function limited(ip: string) {
  const now = Date.now();
  for (const [key, entry] of requests) if (entry.resetAt <= now) requests.delete(key);
  const entry = requests.get(ip);
  if (!entry || entry.resetAt <= now) {
    requests.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function clean(value: unknown, max = 400) {
  return String(value ?? "").replace(/[\u0000-\u001f]/g, " ").slice(0, max);
}

function extractText(data: any) {
  if (typeof data?.output_text === "string") return data.output_text;
  for (const item of data?.output || [])
    for (const content of item?.content || [])
      if (content?.type === "output_text" && typeof content.text === "string")
        return content.text;
  return "";
}

export async function POST(request: NextRequest) {
  const access = await authorizeFeatureApi("AI_INSTANT_ANALYSIS");
  if (access.response) return access.response;
  let config;try{config=await getAICredentials();}catch{return NextResponse.json({code:"AI_SETTINGS_UNAVAILABLE"},{status:503});}
  const apiKey=config.apiKey;
  if (!apiKey)
    return NextResponse.json({ code: "OPENAI_NOT_CONFIGURED" }, { status: 503 });

  if (limited(access.context.identity.id))
    return NextResponse.json({ code: "RATE_LIMITED" }, { status: 429 });

  let body: any;
  try {
    const raw = await request.text();
    if (raw.length > 32_000) return NextResponse.json({ code: "PAYLOAD_TOO_LARGE" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });
  }
  const locale = locales.has(body?.locale) ? body.locale : "fr";
  const asset = body?.asset || {};
  if (typeof asset.symbol !== "string" || !asset.symbol.trim() ||
      !Object.hasOwn(chartPeriods, body?.timeframe) ||
      !Number.isFinite(asset.price) || asset.price <= 0 ||
      (body?.news != null && (!Array.isArray(body.news) || body.news.some((n: unknown) => !n || typeof n !== "object"))))
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });

  const currentBigdata = isLiveContext(body?.bigdata, asset.symbol, Date.now()) ? body.bigdata : null;
  if (currentBigdata && (!Array.isArray(currentBigdata.catalysts) || !Array.isArray(currentBigdata.risks) || currentBigdata.catalysts.some((c: unknown) => !c || typeof c !== "object")))
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400 });

  try{await consumeMonthlyUsage("AI_INSTANT_ANALYSIS",access.context.membership)}catch(error){if(error instanceof UsageLimitError)return NextResponse.json({code:"USAGE_LIMIT_REACHED",feature:error.feature,used:error.used,limit:error.limit,resetAt:error.resetAt},{status:429});throw error}

  const marketContext = {
    locale,
    timeframe: clean(body.timeframe, 12),
    asset: {
      symbol: clean(asset.symbol, 30), name: clean(asset.name, 80), kind: clean(asset.kind, 30),
      price: Number.isFinite(asset.price) ? asset.price : null,
      changePercent: Number.isFinite(asset.change) ? asset.change : null,
      technicalDecision: clean(asset.decision, 20),
      technicalConfidence: Number.isFinite(asset.confidence) ? asset.confidence : null,
      risk: clean(asset.risk, 30), rsi: asset.rsi ?? null, ema20: asset.ema20 ?? null,
      ema50: asset.ema50 ?? null, volatility: asset.volatility ?? null,
      support: asset.support ?? null, resistance: asset.resistance ?? null,
    },
    forecast: body?.forecast || null,
    bigdata: currentBigdata ? {
      updatedAt: currentBigdata.updatedAt, connected: true,
      bias: currentBigdata.bias, confidence: currentBigdata.confidence,
      summary: clean(currentBigdata.summary, 800),
      catalysts: currentBigdata.catalysts.slice(0, 3).map((c: any) => ({
        title: clean(c.title, 160), detail: clean(c.detail, 300), impact: clean(c.impact, 30),
      })), risks: currentBigdata.risks.slice(0, 4).map((r: unknown) => clean(r, 220)),
    } : null,
    news: (body?.news || []).filter((n: any) => isRecentTimestamp(n.publishedAt, Date.now(), 48 * 60 * 60_000)).slice(0, 5).map((n: any) => ({
      title: clean(n.title, 240), publisher: clean(n.publisher, 80),
      publishedAt: Number.isFinite(n.publishedAt) ? new Date(n.publishedAt).toISOString() : null,
    })),
  };

  const language = { fr: "French", en: "English", de: "German", nl: "Dutch" }[locale as "fr"];
  const schema = {
    type: "object",
    properties: {
      decision: { type: "string", enum: ["ACHETER", "VENDRE", "ATTENDRE"] },
      confidence: { type: "integer", minimum: 0, maximum: 100 },
      summary: { type: "string" },
      drivers: { type: "array", items: { type: "string" } },
      risks: { type: "array", items: { type: "string" } },
      invalidation: { type: "string" },
      horizon: { type: "string" },
      disclaimer: { type: "string" },
    },
    required: ["decision", "confidence", "summary", "drivers", "risks", "invalidation", "horizon", "disclaimer"],
    additionalProperties: false,
  };

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: AbortSignal.timeout(35_000),
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        store: false,
        instructions: `You are the educational market-analysis layer of Cockpit Marchés AI. Answer only in ${language}. Analyze only the supplied snapshot; never invent prices, news, government decisions, sources, or certainty. Reconcile technical indicators, the quantitative forecast, Bigdata context, and news freshness. The decision must be conditional and one of ACHETER, VENDRE, ATTENDRE. Confidence measures evidence alignment, not probability of profit. Give concise, concrete drivers and risks, an explicit invalidation condition, and state that trading can cause loss of capital and this is not personalized financial advice.`,
        input: `Analyze this current application snapshot as JSON:\n${JSON.stringify(marketContext)}`,
        text: { format: { type: "json_schema", name: "market_analysis", strict: true, schema } },
      }),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      const status = upstream.status === 401 ? 502 : upstream.status === 429 ? 429 : 502;
      return NextResponse.json({ code: upstream.status === 401 ? "OPENAI_AUTH_ERROR" : upstream.status === 429 ? "OPENAI_LIMIT" : "OPENAI_ERROR" }, { status });
    }
    const text = extractText(data);
    if (!text) throw new Error("empty");
    const analysis = analysisSchema.parse(JSON.parse(text));
    return NextResponse.json({ analysis, generatedAt: new Date().toISOString(), model: data.model || config.model }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const timeout = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json({ code: timeout ? "OPENAI_TIMEOUT" : "OPENAI_ERROR" }, { status: timeout ? 504 : 502 });
  }
}
