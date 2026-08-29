"use client";
import "./modules.css";
import "./news.css";
import "./ribbon.css";
import "./decision.css";
import "./mood.css";
import "./opportunities.css";
import "./languages.css";
import "./metals.css";
import "./scanner-table.css";
import "./timeframes.css";
import "./interactions.css";
import "./trust.css";
import "./forecast.css";
import "./forecast-chart.css";
import "./bigdata.css";
import "./risk-warning.css";
import "./top-forecast.css";
import "./ai-analysis.css";
import "./panorama-collapse.css";
import "./interactive-guide.css";
import "./openai-auto.css";
import "./chart-forecast.css";
import "./sticky-toggle.css";
import "./asset-search.css";
import "./headline-assets.css";
import "./audit-improvements.css";
import "./decision-audit.css";
import "./technical-indicators.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ExternalLink,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  Newspaper,
  Pin,
  PinOff,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Trash2,
  UserRound,
  Wifi,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { translateText, type Lang } from "@/lib/i18n";
import { assets as marketAssets } from "@/lib/market-data";
import { InteractiveGuide } from "./interactive-guide";

type Row = {
  symbol: string;
  key: string;
  name: string;
  kind: string;
  last: number | null;
  change: number | null;
  decision: string;
  confidence: number | null;
  risk: string;
  rsi: number | null;
  ema20: number | null;
  ema50: number | null;
  volatility: number | null;
  support: number | null;
  resistance: number | null;
  unavailable: boolean;
};
type ChartPoint = { t: number; price: number; high?: number; low?: number; ema: number };
type News = {
  id: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: number;
  thumbnail: string | null;
  asset?: string;
  key?: string;
};
type Timeframe =
  "15m" | "30m" | "45m" | "1h" | "4h" | "1d" | "1w" | "1mo" | "6mo" | "1y";
type TimeframeComparison = {
  period: Timeframe;
  decision: string;
  confidence: number;
  change: number;
  rsi: number;
  risk: string;
};
type TraderProfile = {
  level: string;
  style: string;
  capital: number;
  riskPercent: number;
  dailyLoss: number;
};
type Passport = {
  id: number;
  symbol: string;
  kind: string;
  period: Timeframe;
  decision: string;
  coherence: number | null;
  price: number | null;
  support: number | null;
  resistance: number | null;
  risk: string;
  alignment: string;
  dataQuality: string;
  createdAt: string;
  positionSize: number | null;
  reliability?: number | null;
  newsCount?: number;
  aiModel?: string;
  evidence?: string;
};
type DecisionEvent = {
  id: number;
  key: string;
  symbol: string;
  previous: string;
  next: string;
  cause: string;
  period: Timeframe;
  price: number | null;
  createdAt: string;
};
type BigdataIntel = {
  provider: string;
  mode: string;
  connected: boolean;
  asset: string;
  updatedAt: string;
  bias: number;
  confidence: number;
  summary: string;
  catalysts: {
    title: string;
    detail: string;
    impact: string;
    window: string;
    url: string;
  }[];
  risks: string[];
  sources: { title: string; url: string }[];
  error?: string;
};
type OpenAiAnalysis = {
  decision: "ACHETER" | "VENDRE" | "ATTENDRE";
  confidence: number;
  summary: string;
  drivers: string[];
  risks: string[];
  invalidation: string;
  horizon: string;
  disclaimer: string;
  generatedAt: string;
  model: string;
};
const timeframes: [Timeframe, string][] = [
  ["15m", "15 min"],
  ["30m", "30 min"],
  ["45m", "45 min"],
  ["1h", "1 h"],
  ["4h", "4 h"],
  ["1d", "1 j"],
  ["1w", "1 sem."],
  ["1mo", "1 mois"],
  ["6mo", "6 mois"],
  ["1y", "1 an"],
];
const base = marketAssets.map(
  (a) => [a.symbol, a.key, a.name, a.kind] as const,
);
const seed: Row[] = base.map((x) => ({
  symbol: x[0],
  key: x[1],
  name: x[2],
  kind: x[3],
  last: null,
  change: null,
  decision: "INDISPONIBLE",
  confidence: null,
  risk: "—",
  rsi: null,
  ema20: null,
  ema50: null,
  volatility: null,
  support: null,
  resistance: null,
  unavailable: true,
}));

const indexSessions: Record<string, { venue: string; zone: string; ranges: [number, number][] }> = {
  SP500:{venue:"New York",zone:"America/New_York",ranges:[[570,960]]},NASDAQ100:{venue:"New York",zone:"America/New_York",ranges:[[570,960]]},DOWJONES:{venue:"New York",zone:"America/New_York",ranges:[[570,960]]},RUSSELL2000:{venue:"New York",zone:"America/New_York",ranges:[[570,960]]},
  DAX40:{venue:"Francfort",zone:"Europe/Berlin",ranges:[[540,1050]]},CAC40:{venue:"Paris",zone:"Europe/Paris",ranges:[[540,1050]]},STOXX50:{venue:"Europe",zone:"Europe/Paris",ranges:[[540,1050]]},STOXX600:{venue:"Europe",zone:"Europe/Paris",ranges:[[540,1050]]},
  FTSE100:{venue:"Londres",zone:"Europe/London",ranges:[[480,990]]},NIKKEI225:{venue:"Tokyo",zone:"Asia/Tokyo",ranges:[[540,690],[750,930]]},HANGSENG:{venue:"Hong Kong",zone:"Asia/Hong_Kong",ranges:[[570,720],[780,960]]},ASX200:{venue:"Sydney",zone:"Australia/Sydney",ranges:[[600,960]]},
  CSI300:{venue:"Shanghai",zone:"Asia/Shanghai",ranges:[[570,690],[780,900]]},SSECOMP:{venue:"Shanghai",zone:"Asia/Shanghai",ranges:[[570,690],[780,900]]},NIFTY50:{venue:"Mumbai",zone:"Asia/Kolkata",ranges:[[555,930]]},KOSPI:{venue:"Séoul",zone:"Asia/Seoul",ranges:[[540,930]]},
  AEX25:{venue:"Amsterdam",zone:"Europe/Amsterdam",ranges:[[540,1050]]},BEL20:{venue:"Bruxelles",zone:"Europe/Brussels",ranges:[[540,1050]]},SMI20:{venue:"Zurich",zone:"Europe/Zurich",ranges:[[540,1050]]},IBEX35:{venue:"Madrid",zone:"Europe/Madrid",ranges:[[540,1050]]},FTSEMIB:{venue:"Milan",zone:"Europe/Rome",ranges:[[540,1050]]},
  TSX60:{venue:"Toronto",zone:"America/Toronto",ranges:[[570,960]]},IBOVESPA:{venue:"São Paulo",zone:"America/Sao_Paulo",ranges:[[600,1020]]},OMX30:{venue:"Stockholm",zone:"Europe/Stockholm",ranges:[[540,1050]]},
};
function indexMarketStatus(key: string, date: Date) {
  const schedule = indexSessions[key];
  if (!schedule) return null;
  const parts = new Intl.DateTimeFormat("en-US", { timeZone:schedule.zone, weekday:"short", hour:"2-digit", minute:"2-digit", hourCycle:"h23" }).formatToParts(date);
  const value = (type:string) => parts.find((part) => part.type === type)?.value || "";
  const weekday = value("weekday"), minutes = Number(value("hour")) * 60 + Number(value("minute"));
  const weekdayOpen = !["Sat","Sun"].includes(weekday), open = weekdayOpen && schedule.ranges.some(([start,end]) => minutes >= start && minutes < end);
  return { ...schedule, open, localTime:`${value("hour")}:${value("minute")}` };
}
const nav = [
  [LayoutDashboard, "Cockpit"],
  [Gauge, "Opportunités"],
  [TrendingUp, "Prévisions"],
  [Star, "Favoris"],
  [ChartNoAxesCombined, "Marchés"],
  [Bot, "Scanner IA"],
  [FlaskConical, "Backtest"],
  [ClipboardCheck, "Passeports"],
  [Bell, "Alertes"],
  [Newspaper, "Actualités"],
  [BookOpen, "Journal"],
  [Settings, "Paramètres"],
] as const;
const horizonFactor: Record<Timeframe, number> = {
  "15m": 0.35,
  "30m": 0.5,
  "45m": 0.65,
  "1h": 0.8,
  "4h": 1.25,
  "1d": 1.8,
  "1w": 3,
  "1mo": 5,
  "6mo": 8,
  "1y": 11,
};
const macroSources = [
  {
    zone: "États-Unis",
    title: "Fed : taux maintenu à 3,50–3,75 %",
    detail:
      "Conditions financières encore restrictives : soutien potentiel au dollar, vigilance sur les actions de croissance et la crypto.",
    url: "https://www.federalreserve.gov/newsevents/pressreleases/monetary20260729a.htm",
  },
  {
    zone: "Zone euro",
    title: "BCE : taux inchangés après la hausse de juin",
    detail:
      "Énergie volatile et incertitude élevée : impact direct sur EUR, DAX, CAC 40 et Euro Stoxx 50.",
    url: "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.mp260723~29f24d99bc.en.html",
  },
  {
    zone: "Royaume-Uni",
    title: "BoE : Bank Rate maintenu à 3,75 %",
    detail:
      "Trois membres souhaitaient une hausse : facteur de volatilité pour GBP et FTSE 100.",
    url: "https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/july-2026",
  },
  {
    zone: "Monde",
    title: "FMI : croissance mondiale 2026 estimée à 3,0 %",
    detail:
      "Croissance inégale, choc énergétique et demande technologique : contexte mixte pour indices, métaux et devises.",
    url: "https://www.imf.org/en/publications/weo/issues/2026/07/08/world-economic-outlook-update-july-2026",
  },
];
const number = (v: number | null, d = 2) =>
  Number.isFinite(v)
    ? (v as number).toLocaleString("fr-FR", { maximumFractionDigits: d })
    : "—";
const percent = (v: number | null) =>
  Number.isFinite(v)
    ? `${(v as number) >= 0 ? "+" : ""}${(v as number).toFixed(2)}%`
    : "—";
const tone = (d: string) =>
  d === "ACHETER" ? "buy" : d === "VENDRE" ? "sell" : "wait";
const originalText = new WeakMap<Text, string>(),
  originalAttrs = new WeakMap<Element, Record<string, string>>();
const moodFor = (rows: Row[], kind: string) => {
  const valid = rows.filter((r) => r.kind === kind && !r.unavailable);
  if (!valid.length)
    return {
      score: 0,
      label: "Indisponible",
      color: "moodOff",
      detail: "Données insuffisantes",
    };
  const score = Math.round(
    valid.reduce((sum, r) => {
      const signal =
          r.decision === "ACHETER" ? 68 : r.decision === "VENDRE" ? 32 : 50,
        trend = (r.ema20 ?? 0) > (r.ema50 ?? 0) ? 6 : -6,
        move = Math.max(-8, Math.min(8, (r.change ?? 0) * 3)),
        confidence = ((r.confidence ?? 50) - 50) * 0.12;
      return sum + signal + trend + move + confidence;
    }, 0) / valid.length,
  );
  const safe = Math.max(0, Math.min(100, score));
  return safe >= 72
    ? {
        score: safe,
        label: "Très optimiste",
        color: "moodStrong",
        detail: "Large dynamique positive",
      }
    : safe >= 58
      ? {
          score: safe,
          label: "Optimiste",
          color: "moodUp",
          detail: "Acheteurs légèrement dominants",
        }
      : safe >= 43
        ? {
            score: safe,
            label: "Neutre",
            color: "moodFlat",
            detail: "Marché partagé ou en attente",
          }
        : safe >= 30
          ? {
              score: safe,
              label: "Prudent",
              color: "moodCaution",
              detail: "Pression vendeuse modérée",
            }
          : {
              score: safe,
              label: "Baissier",
              color: "moodDown",
              detail: "Vendeurs dominants",
            };
};

export default function Home() {
  const [rows, setRows] = useState<Row[]>(seed),
    [active, setActive] = useState<Row>(seed[0]),
    [view, setView] = useState("Cockpit"),
    [kind, setKind] = useState("Tous"),
    [query, setQuery] = useState(""),
    [chart, setChart] = useState<ChartPoint[]>([]),
    [timeframe, setTimeframe] = useState<Timeframe>("1d"),
    [chartLoading, setChartLoading] = useState(true),
    [timeframeComparisons, setTimeframeComparisons] = useState<
      TimeframeComparison[]
    >([]),
    [comparisonLoading, setComparisonLoading] = useState(true),
    [analysisRevision, setAnalysisRevision] = useState(0),
    [scanning, setScanning] = useState(true),
    [updated, setUpdated] = useState("");
  const scanRequest = useRef(0);
  const [autoRefresh, setAutoRefresh] = useState(true),
    [explanations, setExplanations] = useState(true),
    [alertPrice, setAlertPrice] = useState(""),
    [alerts, setAlerts] = useState<
      { id: number; symbol: string; price: string }[]
    >([]),
    [note, setNote] = useState(""),
    [journal, setJournal] = useState<
      { id: number; text: string; date: string }[]
    >([]);
  const [profile, setProfile] = useState<TraderProfile>({
      level: "Débutant",
      style: "Swing",
      capital: 10000,
      riskPercent: 1,
      dailyLoss: 3,
    }),
    [passports, setPassports] = useState<Passport[]>([]),
    [decisionEvents, setDecisionEvents] = useState<DecisionEvent[]>([]),
    [storageReady, setStorageReady] = useState(false);
  const decisionSnapshot = useRef<Record<string, string>>({});
  const [news, setNews] = useState<Record<string, News[]>>({}),
    [newsUpdated, setNewsUpdated] = useState(""),
    [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [bigdata, setBigdata] = useState<BigdataIntel | null>(null),
    [bigdataLoading, setBigdataLoading] = useState(false);
  const [openAiAnalysis, setOpenAiAnalysis] = useState<OpenAiAnalysis | null>(null),
    [openAiLoading, setOpenAiLoading] = useState(false),
    [openAiError, setOpenAiError] = useState("");
  const openAiRequest = useRef(0);
  const openAiLastKey = useRef("");
  const [favorites, setFavorites] = useState<string[]>([]),
    [favoritesReady, setFavoritesReady] = useState(false);
  const [language, setLanguage] = useState<Lang>("fr");
  const [panoramaOpen, setPanoramaOpen] = useState(true);
  const [panoramaCountdown, setPanoramaCountdown] = useState(10);
  const panoramaRef = useRef<HTMLElement>(null);
  const [stickyEnabled, setStickyEnabled] = useState(true);
  const [currentNow, setCurrentNow] = useState(() => new Date());
  const [inlineForecastOpen, setInlineForecastOpen] = useState(false);
  const [headlineCategory, setHeadlineCategory] = useState("Indices");
  const [assetSearchOpen, setAssetSearchOpen] = useState(false);
  const assetSearchRef = useRef<HTMLDivElement>(null);
  const locale = { fr: "fr-FR", en: "en-US", de: "de-DE", nl: "nl-NL" }[
    language
  ];
  const scan = async () => {
    const request = ++scanRequest.current;
    setScanning(true);
    try {
      const response = await fetch(`/api/scanner?refresh=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("scan");
      const d = await response.json();
      if (request !== scanRequest.current) return;
      let changesSeed = 0;
      const changes: DecisionEvent[] = d.rows.flatMap((row: Row) => {
        const previous = decisionSnapshot.current[row.key];
        if (!previous || previous === row.decision || row.unavailable) return [];
        const trend = (row.ema20 ?? 0) >= (row.ema50 ?? 0) ? "EMA 20 au-dessus de l’EMA 50" : "EMA 20 sous l’EMA 50";
        const momentum = row.rsi === null ? "RSI indisponible" : `RSI ${row.rsi.toFixed(1)}`;
        return [{
          id: Date.now() + changesSeed++, key: row.key, symbol: row.symbol,
          previous, next: row.decision, cause: `${trend} · ${momentum} · confiance ${row.confidence ?? "—"}%`,
          period: timeframe, price: row.last, createdAt: new Date().toISOString(),
        }];
      });
      decisionSnapshot.current = Object.fromEntries(d.rows.map((row: Row) => [row.key, row.decision]));
      if (changes.length) setDecisionEvents((events) => [...changes, ...events].slice(0, 100));
      setRows(d.rows);
      setActive(
        (a) =>
          d.rows.find((x: Row) => x.key === a.key) ||
          d.rows.find((x: Row) => !x.unavailable) ||
          a,
      );
      setUpdated(d.updatedAt);
      setAnalysisRevision((v) => v + 1);
    } catch {
    } finally {
      if (request === scanRequest.current) setScanning(false);
    }
  };
  useEffect(() => {
    const clock = window.setInterval(() => setCurrentNow(new Date()), 30000);
    return () => window.clearInterval(clock);
  }, []);
  useEffect(() => {
    if (!panoramaOpen) return;
    const interval = window.setInterval(() => {
      setPanoramaCountdown((seconds) => {
        if (seconds <= 1) {
          setPanoramaOpen(false);
          return 10;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [panoramaOpen]);
  useEffect(() => {
    const collapseOutside = (event: PointerEvent) => {
      if (
        panoramaOpen &&
        panoramaRef.current &&
        !panoramaRef.current.contains(event.target as Node)
      )
        setPanoramaOpen(false);
    };
    document.addEventListener("pointerdown", collapseOutside);
    return () => document.removeEventListener("pointerdown", collapseOutside);
  }, [panoramaOpen]);
  useEffect(() => {
    scan();
  }, []);
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(scan, 300000);
    return () => clearInterval(id);
  }, [autoRefresh]);
  useEffect(() => {
    const controller = new AbortController();
    setChartLoading(true);
    fetch(
      `/api/history?symbol=${active.key}&period=${timeframe}&refresh=${analysisRevision}`,
      { cache: "no-store", signal: controller.signal },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        let ema = 0,
          a = 2 / 21;
        setChart(
          d.points.map((p: any, i: number) => {
            ema = i ? p.price * a + ema * (1 - a) : p.price;
            return { ...p, ema };
          }),
        );
        if (d.analysis)
          setActive((current) =>
            current.key === d.analysis.key
              ? { ...current, ...d.analysis }
              : current,
          );
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setChart([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setChartLoading(false);
      });
    return () => controller.abort();
  }, [active.key, timeframe, analysisRevision]);
  useEffect(() => {
    const controller = new AbortController();
    setComparisonLoading(true);
    setTimeframeComparisons([]);
    fetch(
      `/api/history?symbol=${active.key}&period=1d&compare=1&refresh=${analysisRevision}`,
      { cache: "no-store", signal: controller.signal },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setTimeframeComparisons(d.comparisons || []))
      .catch(() => setTimeframeComparisons([]))
      .finally(() => {
        if (!controller.signal.aborted) setComparisonLoading(false);
      });
    return () => controller.abort();
  }, [active.key, analysisRevision]);
  const formatChartTime = (value: number) => {
    const d = new Date(value);
    return timeframe === "1y" || timeframe === "6mo" || timeframe === "1mo"
      ? d.toLocaleDateString(locale, { day: "2-digit", month: "short" })
      : timeframe === "1w"
        ? d.toLocaleDateString(locale, { weekday: "short", hour: "2-digit" })
        : d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  };
  useEffect(() => {
    fetch("/api/news")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        setNews(d.byAsset || {});
        setNewsUpdated(d.updatedAt || "");
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    setBigdataLoading(true);
    fetch(`/api/bigdata?asset=${active.key}&period=${timeframe}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setBigdata)
      .catch(() => setBigdata(null))
      .finally(() => {
        if (!controller.signal.aborted) setBigdataLoading(false);
      });
    return () => controller.abort();
  }, [active.key, timeframe, analysisRevision]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cockpit-favorites");
      setFavorites(saved ? JSON.parse(saved) : []);
    } catch {
    } finally {
      setFavoritesReady(true);
    }
  }, []);
  useEffect(() => {
    if (favoritesReady)
      localStorage.setItem("cockpit-favorites", JSON.stringify(favorites));
  }, [favorites, favoritesReady]);
  useEffect(() => {
    try {
      const a = localStorage.getItem("cockpit-alerts-v1"),
        j = localStorage.getItem("cockpit-journal-v1"),
        p = localStorage.getItem("cockpit-profile-v1"),
        d = localStorage.getItem("cockpit-passports-v1"),
        e = localStorage.getItem("cockpit-decision-events-v1");
      if (a) setAlerts(JSON.parse(a));
      if (j) setJournal(JSON.parse(j));
      if (p) setProfile(JSON.parse(p));
      if (d) setPassports(JSON.parse(d));
      if (e) setDecisionEvents(JSON.parse(e));
    } catch {
    } finally {
      setStorageReady(true);
    }
  }, []);
  useEffect(() => {
    if (!storageReady) return;
    localStorage.setItem("cockpit-alerts-v1", JSON.stringify(alerts));
    localStorage.setItem("cockpit-journal-v1", JSON.stringify(journal));
    localStorage.setItem("cockpit-profile-v1", JSON.stringify(profile));
    localStorage.setItem("cockpit-passports-v1", JSON.stringify(passports));
    localStorage.setItem("cockpit-decision-events-v1", JSON.stringify(decisionEvents));
  }, [alerts, journal, profile, passports, decisionEvents, storageReady]);
  useEffect(() => {
    const saved = localStorage.getItem("cockpit-language") as Lang | null;
    if (saved && ["fr", "en", "de", "nl"].includes(saved)) setLanguage(saved);
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem("cockpit-sticky-enabled");
    if (saved !== null) setStickyEnabled(saved === "true");
  }, []);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!assetSearchRef.current?.contains(event.target as Node)) setAssetSearchOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  useEffect(() => {
    localStorage.setItem("cockpit-language", language);
    document.documentElement.lang = language;
    const apply = (root: Node, mutation = false) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      if (root.nodeType === Node.TEXT_NODE) nodes.push(root as Text);
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      nodes.forEach((n) => {
        let source = originalText.get(n);
        if (!source) {
          source = n.data;
          originalText.set(n, source);
        } else if (mutation && n.data !== translateText(source, language)) {
          source = n.data;
          originalText.set(n, source);
        }
        const next = translateText(source, language);
        if (n.data !== next) n.data = next;
      });
      const elements =
        root.nodeType === Node.ELEMENT_NODE
          ? [
              root as Element,
              ...Array.from((root as Element).querySelectorAll("*")),
            ]
          : [];
      elements.forEach((el) => {
        let saved = originalAttrs.get(el) || {};
        for (const attr of ["placeholder", "title", "aria-label"]) {
          const current = el.getAttribute(attr);
          if (current && !saved[attr]) saved[attr] = current;
          if (saved[attr])
            el.setAttribute(attr, translateText(saved[attr], language));
        }
        originalAttrs.set(el, saved);
      });
    };
    apply(document.body);
    const observer = new MutationObserver((ms) =>
      ms.forEach((m) => {
        if (m.type === "characterData") apply(m.target, true);
        else m.addedNodes.forEach((n) => apply(n));
      }),
    );
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [language]);
  const visible = useMemo(
    () =>
      rows.filter(
        (r) =>
          (view !== "Favoris" || favorites.includes(r.key)) &&
          (kind === "Tous" || r.kind === kind) &&
          (r.symbol + " " + r.name).toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, kind, query, view, favorites],
  );
  const searchGroups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const order = ["Crypto", "Forex", "Indices", "Métaux", "Baromètres"];
    return order.map((category) => ({
      category,
      items: rows.filter((row) => row.kind === category && (!term || `${row.symbol} ${row.name}`.toLowerCase().includes(term))),
    })).filter((group) => group.items.length);
  }, [rows, query]);
  const addAlert = () => {
    if (!alertPrice || !Number(alertPrice)) return;
    setAlerts((a) => [
      { id: Date.now(), symbol: active.symbol, price: alertPrice },
      ...a,
    ]);
    setAlertPrice("");
  };
  const addNote = () => {
    if (!note.trim()) return;
    setJournal((j) => [
      {
        id: Date.now(),
        text: note.trim(),
        date: new Date().toLocaleString(locale),
      },
      ...j,
    ]);
    setNote("");
  };
  const goMarket = (category: string) => {
    setKind(category);
    setView("Marchés");
    void scan();
    window.setTimeout(
      () =>
        document
          .getElementById("market-zone")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  };
  const selectTimeframe = (period: Timeframe) => {
    setTimeframe(period);
    window.setTimeout(
      () =>
        document
          .getElementById("chart-zone")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      60,
    );
  };
  const openAnalysisDetail = (index: number) => {
    document
      .querySelectorAll(".analysisGrid article")
      [index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const toggleFavorite = (key: string) =>
    setFavorites((f) =>
      f.includes(key) ? f.filter((x) => x !== key) : [...f, key],
    );
  const savePassport = () => {
    const stop =
        active.decision === "ACHETER"
          ? active.support
          : active.decision === "VENDRE"
            ? active.resistance
            : null,
      riskDistance =
        active.last !== null && stop !== null
          ? Math.abs(active.last - stop)
          : null,
      positionSize =
        riskDistance && riskDistance > 0
          ? (profile.capital * (profile.riskPercent / 100)) / riskDistance
          : null;
    setPassports((p) =>
      [
        {
          id: Date.now(),
          symbol: active.symbol,
          kind: active.kind,
          period: timeframe,
          decision: active.decision,
          coherence: active.confidence,
          price: active.last,
          support: active.support,
          resistance: active.resistance,
          risk: active.risk,
          alignment: `${alignedComparisons}/${timeframeComparisons.length}`,
          dataQuality: active.unavailable ? "Indisponible" : "Complète",
          createdAt: new Date().toLocaleString(locale),
          positionSize,
          reliability: selectedForecast?.reliability ?? null,
          newsCount: news[active.key]?.length || 0,
          aiModel: openAiAnalysis?.model || "Moteur quantitatif explicable",
          evidence: `${updated || "Source marché"} · ${timeframeLabel}`,
        },
        ...p,
      ].slice(0, 100),
    );
    setView("Passeports");
  };
  const backtest = useMemo(() => {
    if (chart.length < 25) return null;
    let trades = 0,
      wins = 0,
      net = 0,
      grossProfit = 0,
      grossLoss = 0,
      peak = 0,
      maxDrawdown = 0;
    for (let i = 21; i < chart.length - 1; i++) {
      const prev = chart[i - 1],
        cur = chart[i],
        next = chart[Math.min(i + 5, chart.length - 1)];
      if (prev.price <= prev.ema && cur.price > cur.ema) {
        const ret = ((next.price - cur.price) / cur.price) * 100 - 0.12;
        trades++;
        if (ret > 0) { wins++; grossProfit += ret; }
        else grossLoss += Math.abs(ret);
        net += ret;
        peak = Math.max(peak, net);
        maxDrawdown = Math.max(maxDrawdown, peak - net);
      }
    }
    const first = chart[0]?.price,
      last = chart.at(-1)?.price,
      buyHold = first && last ? ((last - first) / first) * 100 : 0;
    return {
      trades,
      wins,
      winRate: trades ? (wins / trades) * 100 : 0,
      net,
      maxDrawdown,
      averageTrade: trades ? net / trades : 0,
      profitFactor: grossLoss ? grossProfit / grossLoss : grossProfit ? Infinity : 0,
      buyHold,
      sampleQuality: trades >= 30 ? "Robuste" : trades >= 20 ? "À confirmer" : "Insuffisant",
    };
  }, [chart]);
  const available = rows.filter((r) => !r.unavailable),
    buyCount = available.filter((r) => r.decision === "ACHETER").length,
    sellCount = available.filter((r) => r.decision === "VENDRE").length,
    waitCount = available.filter((r) => r.decision === "ATTENDRE").length,
    breadth = available.length
      ? Math.round(((buyCount - sellCount) / available.length) * 50 + 50)
      : 50;
  const timeframeLabel =
      timeframes.find(([key]) => key === timeframe)?.[1] || timeframe,
    alignedComparisons = timeframeComparisons.filter(
      (x) => x.decision === active.decision,
    ).length,
    consensusDecision = timeframeComparisons.length
      ? ["ACHETER", "ATTENDRE", "VENDRE"].sort(
          (a, b) =>
            timeframeComparisons.filter((x) => x.decision === b).length -
            timeframeComparisons.filter((x) => x.decision === a).length,
        )[0]
      : "INDISPONIBLE";
  const moods = {
    Crypto: moodFor(rows, "Crypto"),
    Forex: moodFor(rows, "Forex"),
    Indices: moodFor(rows, "Indices"),
    Baromètres: moodFor(rows, "Baromètres"),
    Métaux: moodFor(rows, "Métaux"),
  };
  const opportunities = available
    .map((r) => {
      const directional = r.decision === "ACHETER" || r.decision === "VENDRE",
        entry = r.last,
        stop =
          r.decision === "ACHETER"
            ? r.support
            : r.decision === "VENDRE"
              ? r.resistance
              : null,
        target =
          r.decision === "ACHETER"
            ? r.resistance
            : r.decision === "VENDRE"
              ? r.support
              : null,
        risk = entry !== null && stop !== null ? Math.abs(entry - stop) : 0,
        reward =
          entry !== null && target !== null ? Math.abs(target - entry) : 0,
        rr = risk > 0 ? reward / risk : 0,
        aligned =
          (r.decision === "ACHETER" && (r.ema20 ?? 0) > (r.ema50 ?? 0)) ||
          (r.decision === "VENDRE" && (r.ema20 ?? 0) < (r.ema50 ?? 0)),
        mood = moods[r.kind as keyof typeof moods]?.score ?? 50;
      let score =
        (r.confidence ?? 50) +
        (directional ? 5 : -18) +
        (aligned ? 8 : 0) +
        (rr >= 2 ? 10 : rr >= 1 ? 3 : -5) +
        (r.risk === "Faible" ? 7 : r.risk === "Élevé" ? -12 : 0) +
        (mood - 50) * 0.12 +
        Math.min(4, news[r.key]?.length || 0);
      score = Math.max(0, Math.min(100, Math.round(score)));
      return {
        ...r,
        opportunityScore: score,
        entry,
        stop,
        target,
        rr,
        aligned,
        mood,
        label:
          score >= 78
            ? "Forte"
            : score >= 65
              ? "Confirmée"
              : score >= 52
                ? "À surveiller"
                : "Faible",
      };
    })
    .filter((r) => kind === "Tous" || r.kind === kind)
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
  const allNews = useMemo(
    () =>
      rows
        .flatMap((r) =>
          (news[r.key] || []).map((n) => ({
            ...n,
            asset: r.symbol,
            key: r.key,
          })),
        )
        .sort((a, b) => b.publishedAt - a.publishedAt),
    [news, rows],
  );
  const forecasts = useMemo(() => {
    const positive =
        /gain|rise|rally|growth|beat|approval|deal|easing|cut|record|hausse|croissance|accord/i,
      negative =
        /fall|drop|loss|war|tariff|inflation|crisis|risk|sanction|probe|baisse|guerre|déficit/i,
      titles = news[active.key] || [],
      newsScore = titles.reduce(
        (s, n) =>
          s +
          (positive.test(n.title) ? 1 : 0) -
          (negative.test(n.title) ? 1 : 0),
        0,
      ),
      macroBias =
        active.kind === "Métaux"
          ? 4
          : active.kind === "Crypto"
            ? -2
            : ["SP500", "NASDAQ100", "DOWJONES", "RUSSELL2000"].includes(
                  active.key,
                )
              ? -3
              : ["DAX40", "CAC40", "STOXX50"].includes(active.key)
                ? -2
                : active.key === "FTSE100"
                  ? -3
                  : 0,
      items = timeframeComparisons.length
        ? timeframeComparisons
        : [
            {
              period: timeframe,
              decision: active.decision,
              confidence: active.confidence ?? 50,
              change: active.change ?? 0,
              rsi: active.rsi ?? 50,
              risk: active.risk,
            },
          ];
    return items.map((item) => {
      const trend =
          item.decision === "ACHETER"
            ? 16
            : item.decision === "VENDRE"
              ? -16
              : 0,
        rsiBias =
          item.rsi > 70 ? -7 : item.rsi < 30 ? 7 : (item.rsi - 50) * 0.18,
        score = Math.max(
          15,
          Math.min(
            85,
            Math.round(
              50 +
                trend +
                rsiBias +
                Math.max(-8, Math.min(8, newsScore * 3)) +
                macroBias +
                (bigdata?.bias ?? 0),
            ),
          ),
        ),
        vol =
          Math.max(0.15, active.volatility ?? 0.6) * horizonFactor[item.period],
        drift = Math.max(
          -vol * 0.8,
          Math.min(vol * 0.8, item.change * 0.35 + (score - 50) * 0.055),
        ),
        center = active.last === null ? null : active.last * (1 + drift / 100),
        low = center === null ? null : center * (1 - vol / 100),
        high = center === null ? null : center * (1 + vol / 100),
        bull = Math.max(15, Math.min(65, Math.round(30 + (score - 50) * 0.65))),
        bear = Math.max(15, Math.min(65, Math.round(30 - (score - 50) * 0.65))),
        neutral = 100 - bull - bear,
        reliability = Math.max(
          25,
          Math.min(
            82,
            Math.round(
              (item.confidence ?? 50) * 0.65 +
                (titles.length ? 10 : 0) +
                (timeframeComparisons.length ? 8 : 0),
            ),
          ),
        );
      return {
        ...item,
        score,
        drift,
        center,
        low,
        high,
        bull,
        bear,
        neutral,
        reliability,
        newsScore,
        macroBias,
        outlook: score >= 62 ? "HAUSSIER" : score <= 38 ? "BAISSIER" : "NEUTRE",
      };
    });
  }, [active, news, timeframeComparisons, timeframe, bigdata?.bias]);
  const selectedForecast =
    forecasts.find((f) => f.period === timeframe) || forecasts[0];
  const technicalStudy = useMemo(() => {
    if (chart.length < 52) return null;
    const midpoint = (end:number, period:number) => {
        const window = chart.slice(Math.max(0, end - period + 1), end + 1),
          highs = window.map((point) => Number.isFinite(point.high) ? Number(point.high) : point.price),
          lows = window.map((point) => Number.isFinite(point.low) ? Number(point.low) : point.price);
        return (Math.max(...highs) + Math.min(...lows)) / 2;
      },
      emaValue = (values:number[], period:number) => {
        const alpha = 2 / (period + 1);
        return values.reduce((value, next, index) => index ? next * alpha + value * (1 - alpha) : next, values[0]);
      },
      ichimokuData = chart.map((point,index) => {
        const tenkan = index >= 8 ? midpoint(index,9) : null,
          kijun = index >= 25 ? midpoint(index,26) : null,
          spanB = index >= 51 ? midpoint(index,52) : null;
        return { ...point, tenkan, kijun, spanA:tenkan !== null && kijun !== null ? (tenkan + kijun) / 2 : null, spanB };
      }),
      latest = ichimokuData.at(-1)!, prices = chart.map((point) => point.price),
      cloudTop = Math.max(latest.spanA ?? latest.price, latest.spanB ?? latest.price),
      cloudBottom = Math.min(latest.spanA ?? latest.price, latest.spanB ?? latest.price),
      cloudWidth = latest.price ? ((cloudTop - cloudBottom) / latest.price) * 100 : 0,
      cloudPosition = latest.price > cloudTop ? "au-dessus" : latest.price < cloudBottom ? "en dessous" : "dans",
      cross = (latest.tenkan ?? 0) > (latest.kijun ?? 0) ? "haussier" : "baissier",
      cloudDirection = (latest.spanA ?? 0) > (latest.spanB ?? 0) ? "haussier" : "baissier",
      macd = emaValue(prices.slice(-80),12) - emaValue(prices.slice(-80),26),
      last20 = prices.slice(-20), mean = last20.reduce((sum,value) => sum + value,0) / last20.length,
      deviation = Math.sqrt(last20.reduce((sum,value) => sum + Math.pow(value - mean,2),0) / last20.length),
      bollingerUpper = mean + deviation * 2, bollingerLower = mean - deviation * 2,
      atrWindow = chart.slice(-14), atr = atrWindow.reduce((sum,point) => sum + ((point.high ?? point.price) - (point.low ?? point.price)),0) / atrWindow.length;
    const shape = cloudWidth < .18 ? "nuage comprimé" : cloudWidth > 1.2 ? "nuage épais" : "nuage équilibré";
    return {
      data:ichimokuData.slice(-80), tenkan:latest.tenkan, kijun:latest.kijun, spanA:latest.spanA, spanB:latest.spanB,
      chikou:chart.at(-27)?.price ?? null, cloudPosition, cross, cloudDirection, cloudWidth, shape, macd,
      bollingerUpper, bollingerLower, atr,
      bias:cloudPosition === "au-dessus" && cross === "haussier" && cloudDirection === "haussier" ? "HAUSSIER" : cloudPosition === "en dessous" && cross === "baissier" && cloudDirection === "baissier" ? "BAISSIER" : "MIXTE",
    };
  }, [chart]);
  const opposingHorizons = timeframeComparisons.filter(
      (item) => item.decision !== active.decision && item.decision !== "ATTENDRE",
    ),
    latestDecisionEvent = decisionEvents.find((event) => event.key === active.key),
    evidenceScore = active.unavailable
      ? 0
      : Math.min(100, Math.round(
          35 +
          (timeframeComparisons.length ? 20 : 0) +
          ((news[active.key]?.length || 0) ? 15 : 0) +
          (bigdata?.connected ? 15 : 0) +
          (openAiAnalysis ? 15 : 0),
        )),
    conditionalSignal = active.decision === "ACHETER"
      ? `Biais haussier seulement au-dessus de ${number(active.resistance, 5)} ; invalidation sous ${number(active.support, 5)}.`
      : active.decision === "VENDRE"
        ? `Biais baissier seulement sous ${number(active.support, 5)} ; invalidation au-dessus de ${number(active.resistance, 5)}.`
        : `Rester en observation entre ${number(active.support, 5)} et ${number(active.resistance, 5)} jusqu’à une clôture confirmée.`;
  const marketSession = active.kind === "Indices" ? indexMarketStatus(active.key,currentNow) : null;
  const runOpenAiAnalysis = async (force = false, signal?: AbortSignal) => {
    if (!selectedForecast || active.unavailable) return;
    const analysisKey = [active.key, timeframe, language, analysisRevision, active.last,
      active.decision, selectedForecast.outlook, selectedForecast.reliability,
      bigdata?.updatedAt || "", newsUpdated].join("|");
    if (!force && openAiLastKey.current === analysisKey) return;
    const requestId = ++openAiRequest.current;
    setOpenAiLoading(true);
    setOpenAiError("");
    try {
      const response = await fetch("/api/ai-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          locale: language,
          timeframe,
          asset: {
            symbol: active.symbol, name: active.name, kind: active.kind,
            price: active.last, change: active.change, decision: active.decision,
            confidence: active.confidence, risk: active.risk, rsi: active.rsi,
            ema20: active.ema20, ema50: active.ema50, volatility: active.volatility,
            support: active.support, resistance: active.resistance,
          },
          forecast: {
            outlook: selectedForecast.outlook, reliability: selectedForecast.reliability,
            low: selectedForecast.low, center: selectedForecast.center, high: selectedForecast.high,
            bull: selectedForecast.bull, neutral: selectedForecast.neutral, bear: selectedForecast.bear,
            newsScore: selectedForecast.newsScore, macroBias: selectedForecast.macroBias,
          },
          bigdata,
          news: (news[active.key] || []).slice(0, 5),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.code || "OPENAI_ERROR");
      if (requestId !== openAiRequest.current) return;
      setOpenAiAnalysis({ ...data.analysis, generatedAt: data.generatedAt, model: data.model });
      openAiLastKey.current = analysisKey;
    } catch (error) {
      if (signal?.aborted || requestId !== openAiRequest.current) return;
      const code = error instanceof Error ? error.message : "OPENAI_ERROR";
      setOpenAiError(code);
    } finally {
      if (requestId === openAiRequest.current) setOpenAiLoading(false);
    }
  };
  useEffect(() => {
    if (view !== "Prévisions" || !selectedForecast || active.unavailable || chartLoading || comparisonLoading || bigdataLoading) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => void runOpenAiAnalysis(false, controller.signal), 1100);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [view, active.key, active.last, active.decision, timeframe, language, analysisRevision,
    selectedForecast?.outlook, selectedForecast?.reliability, bigdata?.updatedAt,
    newsUpdated, chartLoading, comparisonLoading, bigdataLoading]);
  const forecastChartData = forecasts.map((f) => ({
    period: timeframes.find(([key]) => key === f.period)?.[1] || f.period,
    range: f.low !== null && f.high !== null ? [f.low, f.high] : null,
    center: f.center,
    support: active.support,
    resistance: active.resistance,
    reliability: f.reliability,
  }));
  const openNews = (n: News, asset = active.symbol, key = active.key) => {
    setSelectedNews({ ...n, asset, key });
  };
  const DecisionCenter = ({ r }: { r: Row }) => {
    const isBuy = r.decision === "ACHETER",
      isSell = r.decision === "VENDRE",
      entry = r.last,
      stop = isBuy ? r.support : isSell ? r.resistance : null,
      target = isBuy ? r.resistance : isSell ? r.support : null,
      risk = entry !== null && stop !== null ? Math.abs(entry - stop) : null,
      reward =
        entry !== null && target !== null ? Math.abs(target - entry) : null,
      rr = risk && reward ? reward / risk : null,
      checks = [
        { label: "Données complètes", ok: !r.unavailable },
        {
          label: "Tendance et décision cohérentes",
          ok:
            !r.unavailable &&
            ((isBuy && (r.ema20 ?? 0) > (r.ema50 ?? 0)) ||
              (isSell && (r.ema20 ?? 0) < (r.ema50 ?? 0)) ||
              r.decision === "ATTENDRE"),
        },
        {
          label: "RSI hors zone extrême",
          ok: r.rsi !== null && r.rsi > 30 && r.rsi < 70,
        },
        { label: "Risque faible ou modéré", ok: r.risk !== "Élevé" },
        { label: "Actualité vérifiée", ok: (news[r.key]?.length || 0) > 0 },
      ];
    return (
      <section className="decisionCenter">
        <div className="dcHead">
          <div>
            <p>CENTRE DE DÉCISION</p>
            <h2>Plan de lecture avant positionnement</h2>
          </div>
          <button
            className={favorites.includes(r.key) ? "saved" : ""}
            onClick={() => toggleFavorite(r.key)}
          >
            <Star fill={favorites.includes(r.key) ? "currentColor" : "none"} />
            {favorites.includes(r.key)
              ? "Dans mes favoris"
              : "Ajouter aux favoris"}
          </button>
        </div>
        <div className="breadth">
          <div>
            <span>État global des actifs disponibles</span>
            <b>
              {breadth >= 60
                ? "Orientation positive"
                : breadth <= 40
                  ? "Orientation négative"
                  : "Marché partagé"}
            </b>
            <small>
              {buyCount} achats · {waitCount} attentes · {sellCount} ventes
            </small>
          </div>
          <i>
            <em style={{ width: breadth + "%" }} />
          </i>
          <strong>{breadth}/100</strong>
        </div>
        <div className="planGrid">
          <article>
            <span>Zone d’observation</span>
            <b>{number(entry, 5)}</b>
            <small>Cours actuel, pas un ordre d’entrée</small>
          </article>
          <article>
            <span>Invalidation technique</span>
            <b>{number(stop, 5)}</b>
            <small>
              {isBuy
                ? "Support récent"
                : isSell
                  ? "Résistance récente"
                  : "Attendre un signal directionnel"}
            </small>
          </article>
          <article>
            <span>Objectif technique</span>
            <b>{number(target, 5)}</b>
            <small>
              {isBuy
                ? "Résistance récente"
                : isSell
                  ? "Support récent"
                  : "Aucun objectif sans confirmation"}
            </small>
          </article>
          <article>
            <span>Rendement / risque</span>
            <b>{rr ? rr.toFixed(2) + " : 1" : "—"}</b>
            <small>
              {rr && rr >= 2
                ? "Rapport théorique favorable"
                : rr
                  ? "Rapport à améliorer"
                  : "Non calculable en mode attente"}
            </small>
          </article>
        </div>
        <div className="decisionChecklist">
          <div>
            <h3>Checklist de validation</h3>
            {checks.map((x) => (
              <span key={x.label} className={x.ok ? "ok" : "warn"}>
                <i>{x.ok ? "✓" : "!"}</i>
                {x.label}
              </span>
            ))}
          </div>
          <div className="positionAdvice">
            <h3>Lecture finale</h3>
            <p>
              {r.unavailable
                ? "Ne pas se positionner tant que les données ne sont pas disponibles."
                : r.decision === "ATTENDRE"
                  ? "Les conditions ne sont pas assez alignées. Surveiller une cassure confirmée avant de construire un scénario."
                  : rr && rr >= 2
                    ? "Les indicateurs sont cohérents et le rapport théorique est exploitable, mais la confirmation du prix reste indispensable."
                    : "Le signal existe, mais le rapport entre objectif et invalidation demande de la prudence ou une meilleure zone."}
            </p>
            <div>
              <button
                onClick={() => {
                  setAlertPrice(
                    number(target, 5).replace(/\s/g, "").replace(",", "."),
                  );
                  setView("Alertes");
                }}
              >
                <Bell />
                Créer une alerte
              </button>
              <button
                onClick={() => {
                  setNote(
                    `${r.symbol} — ${r.decision}. Entrée observée: ${number(entry, 5)}, invalidation: ${number(stop, 5)}, objectif: ${number(target, 5)}. Raisonnement: `,
                  );
                  setView("Journal");
                }}
              >
                <BookOpen />
                Préparer le journal
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  };
  const MarketExplanation = ({ r }: { r: Row }) => {
    if (r.unavailable)
      return (
        <section className="deepAnalysis">
          <div className="analysisTitle">
            <Bot />
            <div>
              <p>EXPLICATION DE LA DÉCISION</p>
              <h2>Analyse temporairement indisponible</h2>
            </div>
          </div>
          <p>
            Les données nécessaires ne sont pas assez complètes pour expliquer
            ou produire une décision fiable. Le cockpit préfère suspendre le
            signal plutôt que d’inventer une conclusion.
          </p>
        </section>
      );
    const trend = (r.ema20 ?? 0) > (r.ema50 ?? 0),
      momentum = r.rsi ?? 50,
      nearSupport =
        r.last !== null && r.support !== null
          ? Math.abs((r.last - r.support) / r.last) * 100
          : null,
      nearResistance =
        r.last !== null && r.resistance !== null
          ? Math.abs((r.resistance - r.last) / r.last) * 100
          : null;
    return (
      <section className="deepAnalysis">
        <div className="analysisTitle">
          <Bot />
          <div>
            <p>EXPLICATION EXHAUSTIVE DU MARCHÉ</p>
            <h2>
              Pourquoi le cockpit indique « {r.decision} » sur {timeframeLabel}
            </h2>
          </div>
          <span className={tone(r.decision)}>{r.confidence}% de confiance</span>
        </div>
        <div className="analysisLead">
          Cette décision est recalculée pour la période <b>{timeframeLabel}</b>{" "}
          à partir de la tendance, du momentum, de la volatilité et de la
          position du prix entre support et résistance. Elle décrit cet horizon
          précis, pas une certitude sur son évolution future.
        </div>
        <div className="analysisGrid">
          <article>
            <h3>1. Structure de tendance</h3>
            <p>
              L’EMA 20 est <b>{trend ? "au-dessus" : "en dessous"}</b> de l’EMA
              50. La structure est donc{" "}
              <b className={trend ? "buy" : "sell"}>
                {trend ? "haussière" : "baissière"}
              </b>
              . Le cours actuel ({number(r.last, 5)}) est comparé aux moyennes
              pour mesurer la direction dominante.
            </p>
          </article>
          <article>
            <h3>2. Momentum RSI</h3>
            <p>
              Le RSI est à <b>{r.rsi?.toFixed(1)}</b>.{" "}
              {momentum > 70
                ? "Le marché est en zone de surachat : la hausse peut continuer, mais le risque de respiration augmente."
                : momentum < 30
                  ? "Le marché est en zone de survente : la pression vendeuse est forte, avec possibilité de rebond technique."
                  : momentum >= 50
                    ? "Le momentum reste positif sans être dans une zone extrême."
                    : "Le momentum est inférieur à 50, ce qui traduit une demande encore fragile."}
            </p>
          </article>
          <article>
            <h3>3. Volatilité et risque</h3>
            <p>
              La variation moyenne observée est de{" "}
              <b>{r.volatility?.toFixed(2)} %</b>. Le risque est classé{" "}
              <b>{r.risk}</b>. Plus la volatilité est élevée, plus les écarts de
              prix et la taille de protection nécessaires peuvent être
              importants.
            </p>
          </article>
          <article>
            <h3>4. Niveaux déterminants</h3>
            <p>
              Support : <b>{number(r.support)}</b> · Résistance :{" "}
              <b>{number(r.resistance)}</b>. Le prix se situe à environ{" "}
              <b>{nearSupport?.toFixed(2)} %</b> du support et{" "}
              <b>{nearResistance?.toFixed(2)} %</b> de la résistance.
            </p>
          </article>
        </div>
        <div className="scenarios">
          <div>
            <h3>Scénario de confirmation</h3>
            <p>
              {r.decision === "ACHETER"
                ? "Maintien au-dessus de l’EMA 20 puis franchissement confirmé de la résistance avec un RSI non excessif."
                : r.decision === "VENDRE"
                  ? "Maintien sous l’EMA 20 puis rupture confirmée du support avec momentum faible."
                  : "Sortie claire de la zone actuelle, accompagnée d’un alignement EMA 20/50 et d’un RSI cohérent."}
            </p>
          </div>
          <div>
            <h3>Ce qui invaliderait la lecture</h3>
            <p>
              {r.decision === "ACHETER"
                ? "Retour durable sous le support ou croisement baissier des moyennes."
                : r.decision === "VENDRE"
                  ? "Reprise durable au-dessus de la résistance ou retournement haussier des moyennes."
                  : "Fausse cassure, retournement brutal du RSI ou actualité majeure modifiant la volatilité."}
            </p>
          </div>
          <div>
            <h3>Prudence recommandée</h3>
            <p>
              Vérifier l’actualité, définir à l’avance le niveau d’invalidation
              et limiter l’exposition. Le score de confiance mesure la cohérence
              des indicateurs, jamais la probabilité garantie d’un gain.
            </p>
          </div>
        </div>
      </section>
    );
  };

  const MarketTable = () => (
    <div className="table marketTable">
      <div className="tr th">
        <span>Actif</span>
        <span>Classe</span>
        <span>Prix</span>
        <span>Variation</span>
        <span>Décision</span>
        <span>Confiance</span>
        <span>Risque</span>
      </div>
      {visible.map((r) => (
        <button
          key={r.key}
          className={"tr " + (active.key === r.key ? "active" : "")}
          onClick={() => {
            setActive(r);
            setView("Cockpit");
          }}
        >
          <span className="asset" data-label="Actif">
            <Star
              className={favorites.includes(r.key) ? "favOn" : ""}
              fill={favorites.includes(r.key) ? "currentColor" : "none"}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(r.key);
              }}
            />
            <span className="assetIdentity">
              <b>{r.symbol}</b>
              <small>{r.name}</small>
            </span>
            {(news[r.key]?.length || 0) > 0 && (
              <i
                className="newsPill"
                title={`${news[r.key].length} actualités liées`}
              >
                <Bell />
                {news[r.key].length}
              </i>
            )}
          </span>
          <span data-label="Classe">{r.kind}</span>
          <span data-label="Prix" className="numericValue">
            {number(r.last, 5)}
          </span>
          <span
            data-label="Variation"
            className={(r.change ?? 0) >= 0 ? "up" : "down"}
          >
            {percent(r.change)}
          </span>
          <span
            data-label="Décision"
            className={"signalBadge " + tone(r.decision)}
          >
            {r.unavailable ? "INDISPONIBLE" : r.decision}
          </span>
          <span data-label="Confiance">
            {r.confidence === null ? "—" : r.confidence + "%"}
          </span>
          <span data-label="Risque" className="riskValue">
            <i /> {r.risk}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <TrendingUp />
          <span>
            Cockpit Marchés
            <br />
            AI
          </span>
        </div>
        <nav data-guide="navigation">
          {nav.map(([Icon, name]) => (
            <button
              className={view === name ? "selected" : ""}
              key={name}
              onClick={() => setView(name)}
            >
              <Icon />
              {name}
            </button>
          ))}
        </nav>
        <div className="safe">
          <ShieldCheck />
          <span>
            Analyse éducative<small>Aucun ordre exécuté</small>
          </span>
        </div>
      </aside>
      <main className={stickyEnabled ? "stickyEnabled" : "stickyDisabled"}>
        <header data-guide="search-language">
          <div className="assetSearch" ref={assetSearchRef}>
            <label>
              <Search />
              <input
                role="combobox"
                placeholder="Rechercher ou choisir un actif…"
                value={query}
                onFocus={() => setAssetSearchOpen(true)}
                onChange={(e) => { setQuery(e.target.value); setAssetSearchOpen(true); }}
                aria-expanded={assetSearchOpen}
                aria-controls="global-asset-list"
              />
              <button type="button" onClick={() => setAssetSearchOpen((open) => !open)} aria-label="Afficher tous les actifs"><ChevronDown /></button>
            </label>
            {assetSearchOpen && (
              <div className="assetSearchMenu" id="global-asset-list">
                <div className="assetSearchSummary"><b>Tous les actifs de la plateforme</b><span>{rows.length} actifs · {searchGroups.length} catégories</span></div>
                <div className="assetSearchGroups">
                  {searchGroups.map((group) => (
                    <section key={group.category}>
                      <h3><span>{group.category}</span><small>{group.items.length}</small></h3>
                      <div>
                        {group.items.map((row) => (
                          <button key={row.key} className={active.key === row.key ? "active" : ""} onClick={() => {
                            setActive(row); setQuery(""); setAssetSearchOpen(false); setView("Cockpit");
                          }}>
                            <span><b>{row.symbol}</b><small>{row.name}</small></span>
                            <em className={row.unavailable ? "off" : (row.change ?? 0) >= 0 ? "up" : "down"}>{row.unavailable ? "Indisponible" : percent(row.change)}</em>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                  {!searchGroups.length && <p className="assetSearchEmpty">Aucun actif ne correspond à cette recherche.</p>}
                </div>
              </div>
            )}
          </div>
          <div className="languageSwitch" aria-label="Langue / Language">
            {(
              [
                { code: "fr", flag: "🇫🇷", label: "FR" },
                { code: "en", flag: "🇬🇧", label: "EN" },
                { code: "de", flag: "🇩🇪", label: "DE" },
                { code: "nl", flag: "🇳🇱", label: "NL" },
              ] as const
            ).map((l) => (
              <button
                key={l.code}
                className={language === l.code ? "on" : ""}
                onClick={() => setLanguage(l.code)}
                title={l.label}
              >
                <span>{l.flag}</span>
                <b>{l.label}</b>
              </button>
            ))}
          </div>
          <button
            className={"stickyToggle " + (stickyEnabled ? "on" : "")}
            onClick={() => {
              const next = !stickyEnabled;
              setStickyEnabled(next);
              localStorage.setItem("cockpit-sticky-enabled", String(next));
            }}
            aria-pressed={stickyEnabled}
            title={stickyEnabled ? "Désactiver le mode sticky" : "Activer le mode sticky"}
          >
            {stickyEnabled ? <Pin /> : <PinOff />}
            <span>{stickyEnabled ? "Sticky activé" : "Sticky désactivé"}</span>
          </button>
          <div className="liveState">
            <i className={scanning ? "pulse" : ""} />
            <span>
              {scanning ? "Analyse des marchés…" : "Marchés actualisés"}
            </span>
          </div>
        </header>
        <section className="regulatoryWarning" role="alert">
          <AlertTriangle />
          <p>
            <b>Avertissement sur les risques</b>
            <span>
              Le trading comporte un risque élevé de perte en capital. Les CFD
              sont des instruments complexes à effet de levier : selon l’ESMA,
              entre 74 % et 89 % des comptes d’investisseurs particuliers
              perdent de l’argent. N’investissez que des fonds que vous pouvez
              vous permettre de perdre.
            </span>
          </p>
          <a
            href="https://www.fsma.be/en/news/risks-associated-speculative-transactions-foreign-currencies"
            target="_blank"
            rel="noreferrer"
          >
            Consulter la FSMA <ExternalLink />
          </a>
        </section>
        <button
          className="forecastTopBanner"
          data-guide="live-forecast"
          onClick={() => setView("Prévisions")}
          aria-label="Ouvrir les prévisions détaillées"
        >
          <span className="forecastTopIcon">
            <TrendingUp />
          </span>
          <span className="forecastTopTitle">
            <small>PRÉVISION EN DIRECT</small>
            <b>
              {active.symbol} · {timeframeLabel}
            </b>
          </span>
          <span
            className={
              "forecastTopOutlook " +
              (selectedForecast?.outlook === "HAUSSIER"
                ? "buy"
                : selectedForecast?.outlook === "BAISSIER"
                  ? "sell"
                  : "wait")
            }
          >
            <small>Orientation</small>
            <b>
              {active.unavailable
                ? "INDISPONIBLE"
                : selectedForecast?.outlook || "ANALYSE…"}
            </b>
          </span>
          <span className="forecastTopRange">
            <small>Fourchette projetée</small>
            <b>
              {selectedForecast
                ? `${number(selectedForecast.low, 5)} — ${number(selectedForecast.high, 5)}`
                : "—"}
            </b>
          </span>
          <span className="forecastTopReliability">
            <small>Fiabilité indicative</small>
            <b>{selectedForecast ? selectedForecast.reliability + "%" : "—"}</b>
          </span>
          <span className="forecastTopAction">
            Voir le rapport complet <ExternalLink />
          </span>
        </button>
        <section
          ref={panoramaRef}
          className="panoramaSection"
          aria-label="Panorama des marchés"
          data-guide="panorama"
          onPointerDownCapture={() => panoramaOpen && setPanoramaCountdown(10)}
        >
          <button
            className="panoramaToggle"
            onClick={() => setPanoramaOpen((open) => { if (!open) setPanoramaCountdown(10); return !open; })}
            aria-expanded={panoramaOpen}
            aria-controls="panorama-content"
          >
            <span>
              <Gauge />
              <b>Panorama mondial et mood du marché</b>
              <small>{panoramaOpen ? "Réduire cette zone" : `${rows.length} actifs surveillés · afficher les catégories et le sentiment`}</small>
              {panoramaOpen && (
                <em className="panoramaCountdown" aria-live="polite">
                  Repli automatique dans {panoramaCountdown} s
                </em>
              )}
            </span>
            {panoramaOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          <div id="panorama-content" className={panoramaOpen ? "panoramaContent open" : "panoramaContent"}>
        <section className="marketRibbon" aria-label="Navigation des marchés">
          <div className="ribbonIntro">
            <span>Panorama mondial</span>
            <small>{rows.length} actifs surveillés</small>
          </div>
          <button
            className={kind === "Tous" ? "on" : ""}
            onClick={() => goMarket("Tous")}
          >
            <Gauge />
            <span>
              <b>Tous les marchés</b>
              <small>
                {rows.filter((r) => !r.unavailable).length} disponibles
              </small>
            </span>
          </button>
          <button
            className={kind === "Crypto" ? "on" : ""}
            onClick={() => goMarket("Crypto")}
          >
            <Activity />
            <span>
              <b>Cryptomonnaies</b>
              <small>
                {
                  rows.filter((r) => r.kind === "Crypto" && !r.unavailable)
                    .length
                }{" "}
                / {rows.filter((r) => r.kind === "Crypto").length} disponibles
              </small>
            </span>
          </button>
          <button
            className={kind === "Forex" ? "on" : ""}
            onClick={() => goMarket("Forex")}
          >
            <TrendingUp />
            <span>
              <b>Forex</b>
              <small>
                {
                  rows.filter((r) => r.kind === "Forex" && !r.unavailable)
                    .length
                }{" "}
                / {rows.filter((r) => r.kind === "Forex").length} disponibles
              </small>
            </span>
          </button>
          <button
            className={kind === "Indices" ? "on" : ""}
            onClick={() => goMarket("Indices")}
          >
            <ChartNoAxesCombined />
            <span>
              <b>Indices mondiaux</b>
              <small>
                {
                  rows.filter((r) => r.kind === "Indices" && !r.unavailable)
                    .length
                }{" "}
                / {rows.filter((r) => r.kind === "Indices").length} disponibles
              </small>
            </span>
          </button>
          <button
            className={kind === "Baromètres" ? "on" : ""}
            onClick={() => goMarket("Baromètres")}
          >
            <Activity />
            <span>
              <b>Baromètres</b>
              <small>
                {
                  rows.filter((r) => r.kind === "Baromètres" && !r.unavailable)
                    .length
                }{" "}
                / {rows.filter((r) => r.kind === "Baromètres").length}{" "}
                disponibles
              </small>
            </span>
          </button>
          <button
            className={kind === "Métaux" ? "on" : ""}
            onClick={() => goMarket("Métaux")}
          >
            <Gauge />
            <span>
              <b>Métaux précieux</b>
              <small>
                {
                  rows.filter((r) => r.kind === "Métaux" && !r.unavailable)
                    .length
                }{" "}
                / 2 disponibles
              </small>
            </span>
          </button>
        </section>
        <section className="moodTicker">
          <div className="moodTitle">
            <Activity />
            <span>
              <b>Mood du marché</b>
              <small>Sentiment technique calculé en direct</small>
            </span>
          </div>
          {(
            ["Crypto", "Forex", "Indices", "Baromètres", "Métaux"] as const
          ).map((k) => {
            const m = moods[k];
            return (
              <button key={k} className={m.color} onClick={() => goMarket(k)}>
                <span>
                  <b>{k}</b>
                  <em>{m.label}</em>
                </span>
                <strong>{m.score}%</strong>
                <i>
                  <u style={{ width: m.score + "%" }} />
                </i>
                <small>{m.detail}</small>
              </button>
            );
          })}
          <div className="moodScale">
            <span>0 Baissier</span>
            <span>50 Neutre</span>
            <span>100 Optimiste</span>
          </div>
        </section>
          </div>
        </section>

        {view === "Cockpit" && (
          <>
            <section className="headline" data-guide="asset-summary">
              <div>
                <i>
                  {active.kind === "Crypto"
                    ? "₿"
                    : active.kind === "Forex"
                      ? "↕"
                      : "∑"}
                </i>
                <span>
                  <h1>{active.symbol}</h1>
                  <p>
                    {active.name} ·{" "}
                    {active.unavailable
                      ? "données en attente"
                      : "scanner actualisé"}
                  </p>
                </span>
              </div>
              {marketSession && (
                <div className={"marketSession " + (marketSession.open ? "open" : "closed")} title="Horaire indicatif hors jours fériés et interruptions exceptionnelles">
                  <i />
                  <span>
                    <b>{marketSession.open ? "MARCHÉ OUVERT" : "MARCHÉ FERMÉ"}</b>
                    <small>{marketSession.venue} · {marketSession.localTime} heure locale</small>
                  </span>
                </div>
              )}
              <div className="headlineAssets" aria-label="Accès rapide aux actifs">
                <div className="headlineAssetKinds">
                  {(["Indices", "Crypto", "Forex", "Métaux", "Baromètres"] as const).map((category) => (
                    <button key={category} className={headlineCategory === category ? "on" : ""} onClick={() => setHeadlineCategory(category)}>
                      {category}
                    </button>
                  ))}
                  <button className="all" onClick={() => setAssetSearchOpen(true)}>Tous ({rows.length})</button>
                </div>
                <div className="headlineAssetRail">
                  {rows.filter((row) => row.kind === headlineCategory).map((row) => (
                    <button key={row.key} className={active.key === row.key ? "active" : ""} onClick={() => { setActive(row); setView("Cockpit"); }} title={`${row.symbol} · ${row.name}`}>
                      <b>{row.symbol}</b>
                      <small className={row.unavailable ? "off" : (row.change ?? 0) >= 0 ? "up" : "down"}>{row.unavailable ? "—" : percent(row.change)}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="price">
                <b>{number(active.last, 5)}</b>
                <em className={(active.change ?? 0) >= 0 ? "up" : "down"}>
                  {percent(active.change)}
                </em>
              </div>
            </section>
            <div className="workspace">
              <section className="chart" id="chart-zone">
                <div className="chartbar timeframeHeader">
                  <div>
                    <span>{inlineForecastOpen ? "Graphique prévisionnel multi-horizons" : "Historique réel · EMA 20"}</span>
                    <small>
                      {inlineForecastOpen ? `${active.symbol} · période active ${timeframeLabel}` : timeframes.find(([key]) => key === timeframe)?.[1]}
                    </small>
                  </div>
                  <button
                    className="chartForecastButton"
                    onClick={() => {
                      setInlineForecastOpen((open) => !open);
                    }}
                    aria-expanded={inlineForecastOpen}
                    aria-controls="inline-forecast-result"
                    aria-label={`Voir la prévision de ${active.symbol} sur ${timeframeLabel}`}
                  >
                    <TrendingUp />
                    <span>{inlineForecastOpen ? "Voir l’historique" : "Voir la prévision"}</span>
                  </button>
                </div>
                <div
                  className="timeframePicker"
                  data-guide="timeframes"
                  aria-label="Période du graphique"
                >
                  {timeframes.map(([key, label]) => (
                    <button
                      key={key}
                      className={timeframe === key ? "on" : ""}
                      onClick={() => selectTimeframe(key)}
                      aria-pressed={timeframe === key}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {inlineForecastOpen && selectedForecast && !active.unavailable ? (
                  <div className="inlineForecastChart" id="inline-forecast-result">
                    <ResponsiveContainer width="100%" height={315}>
                      <ComposedChart data={forecastChartData} margin={{ top: 20, right: 24, left: 8, bottom: 4 }}>
                        <defs>
                          <linearGradient id="inlineForecastBand" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#2edb99" stopOpacity=".32" />
                            <stop offset="1" stopColor="#2edb99" stopOpacity=".04" />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#1e303c" vertical={false} />
                        <XAxis dataKey="period" tick={{ fill: "#8397a3", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis orientation="right" domain={["auto", "auto"]} tick={{ fill: "#8397a3", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(value: any, name: string | number | undefined) => [
                            Array.isArray(value) ? value.map((v) => number(Number(v), 5)).join(" — ") : number(Number(value), 5),
                            name === "range" ? "Fourchette projetée" : "Scénario central",
                          ]}
                          contentStyle={{ background: "#08141d", border: "1px solid #29404e", borderRadius: 8 }}
                        />
                        <Area type="monotone" dataKey="range" stroke="#2edb99" strokeOpacity=".5" fill="url(#inlineForecastBand)" connectNulls />
                        <Line type="monotone" dataKey="center" stroke="#42e7ac" strokeWidth={3} dot={{ r: 4, fill: "#07131c", stroke: "#42e7ac", strokeWidth: 2 }} connectNulls />
                        <ReferenceLine x={timeframeLabel} stroke="#ffb321" strokeDasharray="4 4" label={{ value: "Période active", fill: "#ffb321", fontSize: 9, position: "insideTopRight" }} />
                        <ReferenceLine y={active.support ?? undefined} stroke="#ff6b73" strokeDasharray="5 5" />
                        <ReferenceLine y={active.resistance ?? undefined} stroke="#f5b84b" strokeDasharray="5 5" />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <div className="inlineForecastSummary">
                      <span><small>Orientation</small><b className={selectedForecast.outlook === "HAUSSIER" ? "buy" : selectedForecast.outlook === "BAISSIER" ? "sell" : "wait"}>{selectedForecast.outlook}</b></span>
                      <span><small>Fourchette projetée</small><b>{number(selectedForecast.low, 5)} — {number(selectedForecast.high, 5)}</b></span>
                      <span><small>Fiabilité indicative</small><b>{selectedForecast.reliability}%</b></span>
                      <button onClick={() => { setView("Prévisions"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Rapport prévisionnel complet <ExternalLink /></button>
                    </div>
                  </div>
                ) : chartLoading ? (
                  <div className="empty chartLoading">
                    <i />
                    Chargement de la période…
                  </div>
                ) : chart.length ? (
                  <ResponsiveContainer width="100%" height={315}>
                    <AreaChart data={chart}>
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0"
                            stopColor="#28d997"
                            stopOpacity=".3"
                          />
                          <stop
                            offset="1"
                            stopColor="#28d997"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#1e2d38" vertical={false} />
                      <XAxis
                        dataKey="t"
                        tickFormatter={formatChartTime}
                        minTickGap={38}
                        tick={{ fill: "#71838f", fontSize: 9 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        orientation="right"
                        domain={["auto", "auto"]}
                        tick={{ fill: "#8293a0", fontSize: 11 }}
                      />
                      <Tooltip
                        labelFormatter={(v) =>
                          new Date(Number(v)).toLocaleString("fr-FR")
                        }
                        contentStyle={{
                          background: "#0d1922",
                          border: "1px solid #263845",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#2bdd99"
                        fill="url(#g)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="ema"
                        stroke="#f3ad22"
                        fill="transparent"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty">
                    Historique indisponible pour cette période
                  </div>
                )}
              </section>
              <section className="decision" data-guide="decision">
                <div className="muted">
                  Décision IA · période {timeframeLabel}
                </div>
                <div className={"verdict " + tone(active.decision)}>
                  <Gauge />
                  <b>{active.unavailable ? "INDISPONIBLE" : active.decision}</b>
                </div>
                <p>Confiance sur {timeframeLabel}</p>
                <div className="confidence">
                  <strong>
                    {active.confidence === null ? "—" : active.confidence + "%"}
                  </strong>
                  <span>
                    <i style={{ width: (active.confidence ?? 0) + "%" }} />
                  </span>
                </div>
                <hr />
                <h3>Lecture technique recalculée</h3>
                {explanations && (
                  <p>
                    {active.unavailable
                      ? "Le fournisseur ne répond pas. Aucun signal n’est inventé."
                      : active.decision === "ACHETER"
                        ? "La tendance et le momentum convergent sur la période sélectionnée. Une entrée fractionnée reste plus prudente."
                        : active.decision === "VENDRE"
                          ? "La structure technique s’affaiblit sur la période sélectionnée. La protection du capital reste prioritaire."
                          : "Les signaux de la période restent partagés. Attendre une confirmation améliore le rapport risque/rendement."}
                  </p>
                )}
                <div className="facts">
                  <span>
                    RSI {timeframeLabel}
                    <b>{active.rsi === null ? "—" : active.rsi.toFixed(1)}</b>
                  </span>
                  <span>
                    Risque<b>{active.risk}</b>
                  </span>
                </div>
              </section>
            </div>
            <section className="metrics">
              {[
                [
                  "Tendance",
                  active.unavailable
                    ? "—"
                    : (active.ema20 ?? 0) > (active.ema50 ?? 0)
                      ? "Haussière"
                      : "Baissière",
                  `EMA 20 / EMA 50 · ${timeframeLabel}`,
                ],
                [
                  "Momentum RSI",
                  active.rsi === null ? "—" : active.rsi.toFixed(1),
                  `14 périodes · ${timeframeLabel}`,
                ],
                [
                  "Volatilité",
                  active.volatility === null
                    ? "—"
                    : active.volatility.toFixed(2) + " %",
                  `Moyenne sur ${timeframeLabel}`,
                ],
                [
                  "Niveaux",
                  active.support === null || active.resistance === null
                    ? "—"
                    : number(active.support) +
                      " / " +
                      number(active.resistance),
                  `Support / résistance · ${timeframeLabel}`,
                ],
              ].map((m, i) => (
                <button
                  type="button"
                  key={m[0]}
                  onClick={() => openAnalysisDetail(i)}
                  title={`Voir l’explication : ${m[0]}`}
                >
                  <Activity />
                  <span>{m[0]}</span>
                  <b className={i ? "amber" : "green"}>{m[1]}</b>
                  <small>{m[2]} · cliquer pour comprendre</small>
                </button>
              ))}
            </section>
            <section className="technicalIndicators" data-guide="technical-indicators">
              <div className="technicalHead">
                <div>
                  <p>INDICATEURS TECHNIQUES</p>
                  <h2>Lecture instantanée sur {timeframeLabel}</h2>
                  <span>Les calculs utilisent exactement l’historique de la période active et se recalculent lors de chaque changement.</span>
                </div>
                <strong>{technicalStudy ? `${active.symbol} · ${technicalStudy.bias}` : "Historique insuffisant"}</strong>
              </div>
              <div className="indicatorSummary">
                <article><span>EMA 20 / EMA 50</span><b className={(active.ema20 ?? 0) >= (active.ema50 ?? 0) ? "buy" : "sell"}>{(active.ema20 ?? 0) >= (active.ema50 ?? 0) ? "Tendance haussière" : "Tendance baissière"}</b><small>Direction moyenne du prix</small></article>
                <article><span>RSI 14</span><b>{active.rsi === null ? "—" : active.rsi.toFixed(1)}</b><small>{active.rsi === null ? "Indisponible" : active.rsi > 70 ? "Zone de surachat" : active.rsi < 30 ? "Zone de survente" : "Zone équilibrée"}</small></article>
                <article><span>MACD 12/26</span><b className={(technicalStudy?.macd ?? 0) >= 0 ? "buy" : "sell"}>{technicalStudy ? number(technicalStudy.macd,5) : "—"}</b><small>{technicalStudy ? (technicalStudy.macd >= 0 ? "Momentum moyen positif" : "Momentum moyen négatif") : "Historique insuffisant"}</small></article>
                <article><span>Bandes de Bollinger</span><b>{technicalStudy ? `${number(technicalStudy.bollingerLower,4)} — ${number(technicalStudy.bollingerUpper,4)}` : "—"}</b><small>Zone statistique autour de la moyenne 20</small></article>
                <article><span>ATR 14</span><b>{technicalStudy ? number(technicalStudy.atr,5) : "—"}</b><small>Amplitude moyenne, pas une direction</small></article>
              </div>
              {technicalStudy ? (
                <div className="ichimokuFocus">
                  <div className="ichimokuTitle">
                    <div><Activity /><span><p>INDICATEUR MIS EN ÉVIDENCE</p><h2>Ichimoku Kinko Hyo</h2></span></div>
                    <strong className={technicalStudy.bias === "HAUSSIER" ? "buy" : technicalStudy.bias === "BAISSIER" ? "sell" : "wait"}>{technicalStudy.bias}</strong>
                  </div>
                  <div className="ichimokuLayout">
                    <div className="ichimokuChart">
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={technicalStudy.data}>
                          <CartesianGrid stroke="#1e3039" vertical={false}/>
                          <XAxis dataKey="t" tickFormatter={formatChartTime} minTickGap={40} tick={{fill:"#728690",fontSize:9}} axisLine={false}/>
                          <YAxis orientation="right" domain={["auto","auto"]} tick={{fill:"#82959f",fontSize:10}}/>
                          <Tooltip labelFormatter={(value) => new Date(Number(value)).toLocaleString(locale)} contentStyle={{background:"#08141d",border:"1px solid #29404e"}}/>
                          <Area type="monotone" dataKey="spanA" stroke="#2edb99" fill="#2edb9926" connectNulls name="Senkou A"/>
                          <Area type="monotone" dataKey="spanB" stroke="#ff6972" fill="#ff697218" connectNulls name="Senkou B"/>
                          <Line type="monotone" dataKey="price" stroke="#e8f2f5" dot={false} strokeWidth={2} name="Prix"/>
                          <Line type="monotone" dataKey="tenkan" stroke="#38a8ff" dot={false} strokeWidth={1.5} connectNulls name="Tenkan 9"/>
                          <Line type="monotone" dataKey="kijun" stroke="#f3ad22" dot={false} strokeWidth={1.5} connectNulls name="Kijun 26"/>
                        </ComposedChart>
                      </ResponsiveContainer>
                      <div className="ichimokuLegend"><span className="priceLine">Prix</span><span className="tenkanLine">Tenkan 9</span><span className="kijunLine">Kijun 26</span><span className="spanALine">Senkou A</span><span className="spanBLine">Senkou B</span></div>
                    </div>
                    <div className="ichimokuExplanation">
                      <h3>Ce que montre la forme actuelle</h3>
                      <p>Le prix se trouve <b>{technicalStudy.cloudPosition} le nuage</b>. Le croisement Tenkan/Kijun est <b className={technicalStudy.cross === "haussier" ? "buy" : "sell"}>{technicalStudy.cross}</b> et le nuage projeté est orienté <b className={technicalStudy.cloudDirection === "haussier" ? "buy" : "sell"}>{technicalStudy.cloudDirection}</b>.</p>
                      <p>La forme est celle d’un <b>{technicalStudy.shape}</b>, d’une épaisseur proche de <b>{technicalStudy.cloudWidth.toFixed(2)} %</b> du cours. Un nuage épais représente une zone de support/résistance plus difficile à traverser ; un nuage comprimé signale une protection plus faible et une possibilité de changement de régime.</p>
                      <div className="ichimokuFacts">
                        <span>Tenkan-sen<b>{number(technicalStudy.tenkan,5)}</b><small>Équilibre rapide sur 9 périodes</small></span>
                        <span>Kijun-sen<b>{number(technicalStudy.kijun,5)}</b><small>Équilibre de fond sur 26 périodes</small></span>
                        <span>Senkou A / B<b>{number(technicalStudy.spanA,5)} / {number(technicalStudy.spanB,5)}</b><small>Limites du nuage projeté</small></span>
                        <span>Chikou théorique<b>{number(technicalStudy.chikou,5)}</b><small>Prix comparé à 26 périodes en arrière</small></span>
                      </div>
                      <div className="ichimokuVerdict"><ShieldCheck/><p><b>Lecture instantanée :</b> {technicalStudy.bias === "HAUSSIER" ? "les trois confirmations principales sont haussières. Une clôture durable au-dessus du nuage soutient le scénario, à condition que Tenkan reste au-dessus de Kijun." : technicalStudy.bias === "BAISSIER" ? "les trois confirmations principales sont baissières. Une reprise dans le nuage ou un croisement haussier Tenkan/Kijun fragiliserait ce scénario." : "les composantes ne sont pas alignées. Le prix dans le nuage ou des lignes opposées décrivent une phase d’incertitude ; attendre une sortie confirmée est plus prudent."}</p></div>
                    </div>
                  </div>
                  <footer>Ichimoku utilise les plus hauts et plus bas disponibles. Les horaires de marché, les gaps et les annonces peuvent modifier rapidement sa lecture ; ce signal reste éducatif et non prédictif.</footer>
                </div>
              ) : <div className="indicatorEmpty">Au moins 52 observations valides sont nécessaires pour calculer Ichimoku sans inventer de valeurs.</div>}
            </section>
            <section className="multiTimeframe">
              <div className="mtfHead">
                <div>
                  <Activity />
                  <span>
                    <b>Synthèse multi-périodes</b>
                    <small>
                      Cliquez sur une période pour recalculer tout le cockpit et
                      l’analyse IA
                    </small>
                  </span>
                </div>
                <strong className={tone(consensusDecision)}>
                  {comparisonLoading ? "Analyse…" : consensusDecision}
                </strong>
              </div>
              {comparisonLoading ? (
                <div className="mtfLoading">
                  <i />
                  Calcul des horizons complémentaires…
                </div>
              ) : timeframeComparisons.length ? (
                <>
                  <div className="mtfGrid">
                    {timeframeComparisons.map((item) => (
                      <button
                        type="button"
                        key={item.period}
                        className={
                          item.period === timeframe ? "selectedPeriod" : ""
                        }
                        onClick={() => selectTimeframe(item.period)}
                        aria-pressed={item.period === timeframe}
                        title={`Analyser ${active.symbol} sur ${timeframes.find(([key]) => key === item.period)?.[1] || item.period}`}
                      >
                        <span>
                          {timeframes.find(
                            ([key]) => key === item.period,
                          )?.[1] || item.period}
                        </span>
                        <b className={tone(item.decision)}>{item.decision}</b>
                        <small>
                          {item.confidence}% confiance · RSI{" "}
                          {item.rsi?.toFixed(0)}
                        </small>
                        <em className={item.change >= 0 ? "up" : "down"}>
                          {percent(item.change)}
                        </em>
                        <u>Analyser cette période</u>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="mtfConclusion"
                    onClick={() => {
                      const best = timeframeComparisons.reduce(
                        (a, b) => (b.confidence > a.confidence ? b : a),
                        timeframeComparisons[0],
                      );
                      if (best) selectTimeframe(best.period);
                    }}
                    title="Ouvrir la période ayant la confiance la plus élevée"
                  >
                    <Gauge />
                    <p>
                      <b>
                        {alignedComparisons}/{timeframeComparisons.length}{" "}
                        horizons sont alignés avec la décision sélectionnée.
                      </b>
                      <span>
                        {alignedComparisons >=
                        Math.ceil(timeframeComparisons.length * 0.65)
                          ? "Convergence forte : plusieurs horizons confirment la même direction."
                          : alignedComparisons >=
                              Math.ceil(timeframeComparisons.length * 0.4)
                            ? "Convergence partielle : la direction doit encore être confirmée par le prix."
                            : "Divergence importante : prudence, les horizons ne racontent pas la même histoire."}
                      </span>
                      <u>Cliquer pour ouvrir l’horizon le plus fiable</u>
                    </p>
                  </button>
                </>
              ) : (
                <div className="mtfLoading">
                  Comparaison temporairement indisponible.
                </div>
              )}
            </section>
            <section className="decisionAudit" aria-label="Contrôle et preuves de la décision">
              <div className="decisionAuditHead">
                <div>
                  <p>CONTRÔLE DE LA DÉCISION</p>
                  <h2>Preuves, divergences et conditions d’activation</h2>
                </div>
                <span className={evidenceScore >= 70 ? "strong" : evidenceScore >= 45 ? "partial" : "weak"}>
                  Qualité des preuves {evidenceScore}%
                </span>
              </div>
              <div className="decisionAuditGrid">
                <article>
                  <Activity />
                  <div>
                    <h3>Accord entre les périodes</h3>
                    <b>{alignedComparisons}/{timeframeComparisons.length || "—"} horizons alignés</b>
                    <p>{opposingHorizons.length
                      ? `Contradiction détectée sur ${opposingHorizons.map((item) => timeframes.find(([key]) => key === item.period)?.[1] || item.period).join(", ")}. Le signal court terme ne doit pas masquer la tendance opposée.`
                      : timeframeComparisons.length
                        ? "Aucun horizon directionnel directement opposé n’est détecté dans la comparaison actuelle."
                        : "La comparaison multi-périodes n’est pas encore disponible."}</p>
                  </div>
                </article>
                <article>
                  <TrendingUp />
                  <div>
                    <h3>Scénario conditionnel</h3>
                    <b>{active.decision === "ACHETER" ? "Haussier sous condition" : active.decision === "VENDRE" ? "Baissier sous condition" : "Observation"}</b>
                    <p>{conditionalSignal}</p>
                  </div>
                </article>
                <article>
                  <ClipboardCheck />
                  <div>
                    <h3>Dernier changement expliqué</h3>
                    {latestDecisionEvent ? <>
                      <b>{latestDecisionEvent.previous} → {latestDecisionEvent.next}</b>
                      <p>{latestDecisionEvent.cause} · {new Date(latestDecisionEvent.createdAt).toLocaleString(locale)}</p>
                    </> : <>
                      <b>Aucun changement enregistré</b>
                      <p>Le suivi commencera dès qu’un nouveau calcul modifiera la décision de cet actif.</p>
                    </>}
                  </div>
                </article>
              </div>
              <footer>
                <span>Marché : {active.unavailable ? "indisponible" : updated || "actualisé"}</span>
                <span>Actualités : {news[active.key]?.length || 0}</span>
                <span>Contexte Bigdata : {bigdata?.connected ? "connecté" : "non confirmé"}</span>
                <span>IA explicative : {openAiAnalysis?.model || "non générée"}</span>
              </footer>
            </section>
            <DecisionCenter r={active} />
            <section className="trustPassport">
              <div>
                <ShieldCheck />
                <span>
                  <b>Traçabilité de la décision</b>
                  <small>
                    Source, période, cohérence technique et profil de risque
                    seront figés dans un instantané vérifiable.
                  </small>
                </span>
              </div>
              <button onClick={savePassport}>
                <ClipboardCheck />
                Enregistrer le passeport
              </button>
            </section>
            <MarketExplanation r={active} />
            <section className="assetNews">
              <div className="assetNewsHead">
                <div>
                  <Newspaper />
                  <span>
                    <b>Actualités liées à {active.symbol}</b>
                    <small>
                      Les nouvelles complètent l’analyse technique sans modifier
                      automatiquement le signal.
                    </small>
                  </span>
                </div>
                <button onClick={() => setView("Actualités")}>
                  Voir toutes
                </button>
              </div>
              <div className="newsStrip">
                {(news[active.key] || []).slice(0, 3).map((n) => (
                  <button key={n.id} onClick={() => openNews(n)}>
                    <span>
                      <b>{n.title}</b>
                      <small>
                        {n.publisher} ·{" "}
                        {n.publishedAt
                          ? new Date(n.publishedAt).toLocaleString("fr-FR")
                          : "date indisponible"}
                      </small>
                    </span>
                    <ExternalLink />
                  </button>
                ))}
                {!news[active.key]?.length && (
                  <div className="emptySmall">
                    Aucune actualité récente disponible pour cet actif.
                  </div>
                )}
              </div>
            </section>
            <section className="watch" data-guide="scanner">
              <div className="watchhead">
                <h2>
                  Scanner IA global ·{" "}
                  {scanning
                    ? "analyse en cours…"
                    : updated
                      ? "mis à jour " +
                        new Date(updated).toLocaleTimeString("fr-FR")
                      : "mode secours"}
                </h2>
                <button onClick={scan}>
                  <SlidersHorizontal />
                  Actualiser
                </button>
              </div>
              <MarketTable />
            </section>
          </>
        )}

        {view === "Opportunités" && (
          <section className="module opportunities" data-guide="opportunities">
            <div className="moduleHead">
              <div>
                <p>RADAR D’OPPORTUNITÉS</p>
                <h1>Configurations les plus intéressantes actuellement</h1>
                <span>
                  Classement multi-critères des 31 actifs. Une opportunité
                  décrit une configuration technique, jamais une garantie de
                  résultat.
                </span>
              </div>
              <button onClick={scan}>
                <Bot />
                {scanning ? "Recalcul…" : "Recalculer le radar"}
              </button>
            </div>
            <div className="opportunityOverview">
              <article>
                <span>Configurations exploitables</span>
                <b>
                  {opportunities.filter((o) => o.opportunityScore >= 52).length}
                </b>
                <small>score supérieur ou égal à 52</small>
              </article>
              <article>
                <span>Meilleur score</span>
                <b>{opportunities[0]?.opportunityScore ?? 0}/100</b>
                <small>{opportunities[0]?.symbol || "aucun actif"}</small>
              </article>
              <article>
                <span>Direction dominante</span>
                <b>
                  {buyCount > sellCount
                    ? "Achat"
                    : sellCount > buyCount
                      ? "Vente"
                      : "Partagée"}
                </b>
                <small>
                  {buyCount} achat · {sellCount} vente
                </small>
              </article>
              <article>
                <span>Filtre actif</span>
                <b>{kind}</b>
                <small>{opportunities.length} actifs analysés</small>
              </article>
            </div>
            <div className="opportunityLegend">
              <span>
                <i className="scoreStrong" />
                78–100 Forte
              </span>
              <span>
                <i className="scoreGood" />
                65–77 Confirmée
              </span>
              <span>
                <i className="scoreWatch" />
                52–64 À surveiller
              </span>
              <span>
                <i className="scoreWeak" />
                0–51 Faible
              </span>
            </div>
            <div className="opportunityGrid">
              {opportunities.slice(0, 15).map((o, index) => (
                <article
                  key={o.key}
                  className={
                    o.opportunityScore >= 78
                      ? "strong"
                      : o.opportunityScore >= 65
                        ? "good"
                        : o.opportunityScore >= 52
                          ? "watch"
                          : "weak"
                  }
                >
                  <div className="opRank">
                    <span>#{index + 1}</span>
                    <div>
                      <b>{o.symbol}</b>
                      <small>
                        {o.kind} · Mood {o.mood}%
                      </small>
                    </div>
                    <strong>
                      {o.opportunityScore}
                      <small>/100</small>
                    </strong>
                  </div>
                  <div className="opSignal">
                    <span className={tone(o.decision)}>{o.decision}</span>
                    <em>{o.label}</em>
                    <i>Confiance {o.confidence}%</i>
                  </div>
                  <div className="opLevels">
                    <span>
                      Observation<b>{number(o.entry, 5)}</b>
                    </span>
                    <span>
                      Invalidation<b>{number(o.stop, 5)}</b>
                    </span>
                    <span>
                      Objectif<b>{number(o.target, 5)}</b>
                    </span>
                    <span>
                      R/R<b>{o.rr ? o.rr.toFixed(2) + " : 1" : "—"}</b>
                    </span>
                  </div>
                  <div className="opDetails">
                    <div>
                      <h3>Arguments favorables</h3>
                      <p>
                        {o.aligned
                          ? "✓ Tendance EMA cohérente"
                          : "! Tendance non totalement alignée"}
                      </p>
                      <p>
                        {o.rr >= 2
                          ? "✓ Rendement/risque supérieur à 2"
                          : "! Rendement/risque limité"}
                      </p>
                      <p>
                        {(news[o.key]?.length || 0) > 0
                          ? "✓ Actualités disponibles"
                          : "! Actualité non disponible"}
                      </p>
                    </div>
                    <div>
                      <h3>Point de vigilance</h3>
                      <p>
                        {o.risk === "Élevé"
                          ? "Volatilité élevée : exposition réduite recommandée."
                          : o.decision === "ATTENDRE"
                            ? "Aucune direction confirmée : attendre une cassure."
                            : o.rr < 1
                              ? "Objectif trop proche de l’invalidation."
                              : "Le scénario reste dépendant de la confirmation du prix."}
                      </p>
                    </div>
                  </div>
                  <div className="opActions">
                    <button
                      onClick={() => {
                        setActive(o);
                        setView("Cockpit");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Voir l’analyse complète
                    </button>
                    <button
                      className={favorites.includes(o.key) ? "saved" : ""}
                      onClick={() => toggleFavorite(o.key)}
                    >
                      <Star
                        fill={
                          favorites.includes(o.key) ? "currentColor" : "none"
                        }
                      />
                      {favorites.includes(o.key) ? "Favori" : "Suivre"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === "Favoris" && (
          <section className="module" data-guide="favorites">
            <div className="moduleHead">
              <div>
                <p>MA LISTE DE SURVEILLANCE</p>
                <h1>Favoris et opportunités suivies</h1>
                <span>
                  Vos favoris sont conservés sur cet appareil. Cliquez sur
                  l’étoile d’un actif pour l’ajouter ou le retirer.
                </span>
              </div>
              <button onClick={scan}>
                <SlidersHorizontal />
                {scanning ? "Actualisation…" : "Actualiser les favoris"}
              </button>
            </div>
            <div className="favoriteStats">
              <article>
                <span>Actifs favoris</span>
                <b>{favorites.length}</b>
                <small>dans votre surveillance</small>
              </article>
              <article>
                <span>Signaux actifs</span>
                <b>
                  {
                    rows.filter(
                      (r) =>
                        favorites.includes(r.key) &&
                        (r.decision === "ACHETER" || r.decision === "VENDRE"),
                    ).length
                  }
                </b>
                <small>achat ou vente</small>
              </article>
              <article>
                <span>Actualités associées</span>
                <b>
                  {favorites.reduce((n, k) => n + (news[k]?.length || 0), 0)}
                </b>
                <small>rapports disponibles</small>
              </article>
              <article>
                <span>État global</span>
                <b>{breadth}/100</b>
                <small>
                  {breadth >= 60
                    ? "positif"
                    : breadth <= 40
                      ? "négatif"
                      : "partagé"}
                </small>
              </article>
            </div>
            {favorites.length ? (
              <div className="moduleCard">
                <MarketTable />
              </div>
            ) : (
              <div className="favoriteEmpty">
                <Star />
                <h2>Aucun favori pour le moment</h2>
                <p>
                  Ouvrez Marchés puis cliquez sur l’étoile d’un actif. Votre
                  liste restera disponible lors de votre prochaine visite.
                </p>
                <button onClick={() => goMarket("Tous")}>
                  Explorer les marchés
                </button>
              </div>
            )}
          </section>
        )}

        {view === "Marchés" && (
          <section className="module" id="market-zone" data-guide="markets-module">
            <div className="moduleHead">
              <div>
                <p>MARCHÉS</p>
                <h1>Vue globale des actifs</h1>
                <span>
                  {scanning
                    ? `Actualisation en direct de ${kind}…`
                    : updated
                      ? `Données ${kind} mises à jour à ${new Date(updated).toLocaleTimeString("fr-FR")}`
                      : "Comparez les prix, variations et risques avant d’ouvrir le détail."}
                </span>
              </div>
              <button onClick={scan}>
                <SlidersHorizontal />
                {scanning ? "Actualisation…" : "Actualiser"}
              </button>
            </div>
            <div className="summary">
              {["Crypto", "Forex", "Indices", "Baromètres", "Métaux"].map(
                (k) => (
                  <button
                    type="button"
                    key={k}
                    className={kind === k ? "summaryActive" : ""}
                    onClick={() => goMarket(k)}
                    aria-busy={scanning && kind === k}
                  >
                    <span>{k}</span>
                    <b>
                      {
                        rows.filter((r) => r.kind === k && !r.unavailable)
                          .length
                      }
                    </b>
                    <small>
                      {scanning && kind === k
                        ? "Actualisation en cours…"
                        : "Actualiser et voir les actifs"}
                    </small>
                  </button>
                ),
              )}
            </div>
            <div className={"moduleCard " + (scanning ? "dataRefreshing" : "")}>
              <MarketTable />
            </div>
          </section>
        )}

        {view === "Scanner IA" && (
          <section className="module" data-guide="ai-scanner-module">
            <div className="moduleHead">
              <div>
                <p>SCANNER IA</p>
                <h1>Décisions techniques</h1>
                <span>
                  Classement automatique fondé sur tendance, RSI, volatilité et
                  niveaux.
                </span>
              </div>
              <button onClick={scan}>
                <Bot />
                {scanning ? "Analyse…" : "Lancer le scan"}
              </button>
            </div>
            <div className="signalGrid">
              {visible.map((r) => (
                <button
                  key={r.key}
                  onClick={() => {
                    setActive(r);
                    setView("Cockpit");
                  }}
                >
                  <div>
                    <b>{r.symbol}</b>
                    <small>{r.kind}</small>
                  </div>
                  <strong className={tone(r.decision)}>
                    {r.unavailable ? "INDISPONIBLE" : r.decision}
                  </strong>
                  <span>
                    Confiance{" "}
                    <b>{r.confidence === null ? "—" : r.confidence + "%"}</b>
                  </span>
                  <span>
                    Risque <b>{r.risk}</b>
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {view === "Prévisions" && (
          <section className="module forecastModule" data-guide="forecast-module">
            <div className="moduleHead">
              <div>
                <p>PRÉVISIONS MULTI-FACTEURS</p>
                <h1>Scénarios prévisionnels par actif et période</h1>
                <span>
                  Modèle expérimental fondé sur données techniques, actualités
                  récentes et contexte macroéconomique vérifié.
                </span>
              </div>
              <button
                onClick={() => {
                  void scan();
                  setAnalysisRevision((v) => v + 1);
                }}
              >
                <Activity />
                {scanning ? "Actualisation…" : "Recalculer"}
              </button>
            </div>
            <div className="forecastControls">
              <label>
                Actif
                <select
                  value={active.key}
                  onChange={(e) => {
                    const r = rows.find((x) => x.key === e.target.value);
                    if (r) setActive(r);
                  }}
                >
                  {rows.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.symbol} · {r.kind}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <span>Horizon étudié</span>
                <div>
                  {timeframes.map(([key, label]) => (
                    <button
                      key={key}
                      className={timeframe === key ? "on" : ""}
                      onClick={() => setTimeframe(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {active.unavailable || !selectedForecast ? (
              <div className="favoriteEmpty">
                <TrendingUp />
                <h2>Prévision temporairement indisponible</h2>
                <p>
                  Les données de marché nécessaires ne sont pas suffisamment
                  complètes. Aucun scénario n’est inventé.
                </p>
              </div>
            ) : (
              <>
                <div className="forecastHero">
                  <div>
                    <span>Orientation centrale · {timeframeLabel}</span>
                    <h2
                      className={
                        selectedForecast.outlook === "HAUSSIER"
                          ? "buy"
                          : selectedForecast.outlook === "BAISSIER"
                            ? "sell"
                            : "wait"
                      }
                    >
                      {selectedForecast.outlook}
                    </h2>
                    <p>
                      {selectedForecast.outlook === "HAUSSIER"
                        ? "La combinaison technique et contextuelle favorise actuellement un scénario de progression."
                        : selectedForecast.outlook === "BAISSIER"
                          ? "Les facteurs observés favorisent actuellement un scénario de repli ou de pression vendeuse."
                          : "Les forces haussières et baissières restent trop proches pour dégager une direction dominante."}
                    </p>
                    <small>
                      Fiabilité indicative {selectedForecast.reliability}% ·
                      jamais une probabilité garantie
                    </small>
                  </div>
                  <div className="forecastRange">
                    <span>Fourchette statistique projetée</span>
                    <b>
                      {number(selectedForecast.low, 5)} <i>→</i>{" "}
                      {number(selectedForecast.high, 5)}
                    </b>
                    <small>
                      Centre : {number(selectedForecast.center, 5)} ·
                      déplacement central {percent(selectedForecast.drift)}
                    </small>
                  </div>
                </div>
                <section className="forecastChart">
                  <div className="forecastChartHead">
                    <div>
                      <Activity />
                      <span>
                        <b>Trajectoire prévisionnelle multi-horizons</b>
                        <small>
                          La zone colorée représente la fourchette
                          d’incertitude, la ligne verte le scénario central.
                        </small>
                      </span>
                    </div>
                    <div className="forecastLegend">
                      <span>
                        <i className="rangeDot" />
                        Fourchette
                      </span>
                      <span>
                        <i className="centerDot" />
                        Scénario central
                      </span>
                      <span>
                        <i className="levelDot" />
                        Niveaux techniques
                      </span>
                    </div>
                  </div>
                  <div className="forecastChartCanvas">
                    <ResponsiveContainer width="100%" height={330}>
                      <ComposedChart
                        data={forecastChartData}
                        margin={{ top: 20, right: 24, left: 8, bottom: 4 }}
                      >
                        <defs>
                          <linearGradient
                            id="forecastBand"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0"
                              stopColor="#2edb99"
                              stopOpacity=".28"
                            />
                            <stop
                              offset="1"
                              stopColor="#2edb99"
                              stopOpacity=".05"
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#1e303c" vertical={false} />
                        <XAxis
                          dataKey="period"
                          tick={{ fill: "#8397a3", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          orientation="right"
                          domain={["auto", "auto"]}
                          tick={{ fill: "#8397a3", fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(
                            value: any,
                            name: string | number | undefined,
                          ) => [
                            Array.isArray(value)
                              ? value
                                  .map((v) => number(Number(v), 5))
                                  .join(" — ")
                              : number(Number(value), 5),
                            name === "range"
                              ? "Fourchette projetée"
                              : "Scénario central",
                          ]}
                          contentStyle={{
                            background: "#08141d",
                            border: "1px solid #29404e",
                            borderRadius: 8,
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="range"
                          stroke="#2edb99"
                          strokeOpacity=".45"
                          fill="url(#forecastBand)"
                          connectNulls
                        />
                        <Line
                          type="monotone"
                          dataKey="center"
                          stroke="#42e7ac"
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            fill: "#07131c",
                            stroke: "#42e7ac",
                            strokeWidth: 2,
                          }}
                          connectNulls
                        />
                        <ReferenceLine
                          y={active.support ?? undefined}
                          stroke="#ff6b73"
                          strokeDasharray="5 5"
                          label={{
                            value: "Support",
                            fill: "#ff848b",
                            fontSize: 10,
                            position: "insideBottomLeft",
                          }}
                        />
                        <ReferenceLine
                          y={active.resistance ?? undefined}
                          stroke="#f3ad22"
                          strokeDasharray="5 5"
                          label={{
                            value: "Résistance",
                            fill: "#f3bd54",
                            fontSize: 10,
                            position: "insideTopLeft",
                          }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="forecastChartFoot">
                    <span>
                      <b>{active.symbol}</b> · {timeframeLabel}
                    </span>
                    <span>
                      Fiabilité sélectionnée{" "}
                      <b>{selectedForecast.reliability}%</b>
                    </span>
                    <small>
                      Projection conditionnelle : elle évolue avec la période,
                      le prix, la volatilité et les nouvelles données.
                    </small>
                  </div>
                </section>
                <div className="scenarioProbabilities">
                  <article className="bull">
                    <span>Scénario haussier</span>
                    <b>{selectedForecast.bull}%</b>
                    <i>
                      <u style={{ width: selectedForecast.bull + "%" }} />
                    </i>
                    <small>
                      Confirmation au-dessus de {number(active.resistance, 5)}
                    </small>
                  </article>
                  <article className="neutral">
                    <span>Scénario neutre</span>
                    <b>{selectedForecast.neutral}%</b>
                    <i>
                      <u style={{ width: selectedForecast.neutral + "%" }} />
                    </i>
                    <small>Consolidation entre support et résistance</small>
                  </article>
                  <article className="bear">
                    <span>Scénario baissier</span>
                    <b>{selectedForecast.bear}%</b>
                    <i>
                      <u style={{ width: selectedForecast.bear + "%" }} />
                    </i>
                    <small>Invalidation sous {number(active.support, 5)}</small>
                  </article>
                </div>
                <div className="forecastFactors">
                  <article>
                    <h3>Facteurs techniques</h3>
                    <p>
                      Décision {active.decision}, RSI {number(active.rsi, 1)},
                      EMA 20{" "}
                      {active.ema20 !== null &&
                      active.ema50 !== null &&
                      active.ema20 > active.ema50
                        ? "au-dessus"
                        : "en dessous"}{" "}
                      de l’EMA 50 et volatilité {number(active.volatility, 2)}{" "}
                      %.
                    </p>
                  </article>
                  <article>
                    <h3>Actualités intégrées</h3>
                    <p>
                      {news[active.key]?.length || 0} titres récents inspectés.
                      Biais lexical :{" "}
                      {selectedForecast.newsScore > 0
                        ? "positif"
                        : selectedForecast.newsScore < 0
                          ? "négatif"
                          : "équilibré"}
                      . Les titres ne remplacent jamais la lecture de la source
                      complète.
                    </p>
                  </article>
                  <article>
                    <h3>Contexte macro</h3>
                    <p>
                      Biais macro appliqué :{" "}
                      {selectedForecast.macroBias > 0 ? "+" : ""}
                      {selectedForecast.macroBias} points. Il reflète les
                      décisions monétaires et risques globaux pertinents pour
                      cette classe d’actifs.
                    </p>
                  </article>
                  <article>
                    <h3>Risque d’erreur</h3>
                    <p>
                      Une décision gouvernementale inattendue, une crise, un
                      chiffre d’inflation ou une rupture de liquidité peut
                      invalider instantanément cette projection.
                    </p>
                  </article>
                </div>
                <div className="forecastTimeline">
                  <h2>Comparaison de toutes les périodes</h2>
                  <div>
                    {forecasts.map((f) => (
                      <button
                        key={f.period}
                        className={f.period === timeframe ? "selected" : ""}
                        onClick={() => setTimeframe(f.period)}
                      >
                        <span>
                          {timeframes.find(([k]) => k === f.period)?.[1]}
                        </span>
                        <b
                          className={
                            f.outlook === "HAUSSIER"
                              ? "buy"
                              : f.outlook === "BAISSIER"
                                ? "sell"
                                : "wait"
                          }
                        >
                          {f.outlook}
                        </b>
                        <small>
                          {percent(f.drift)} · fiabilité {f.reliability}%
                        </small>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <section className="openAiPanel" data-guide="openai-analysis">
              <div className="openAiHead">
                <div>
                  <Bot />
                  <span>
                    <b>ANALYSE INSTANTANÉE OPENAI</b>
                    <small>Lecture explicative croisée : technique, prévision, Bigdata et actualités.</small>
                  </span>
                </div>
                <div className="openAiControls">
                  <span className="openAiAuto"><i className={openAiLoading ? "pulse" : ""} />Actualisation automatique</span>
                  <button onClick={() => void runOpenAiAnalysis(true)} disabled={openAiLoading || active.unavailable}>
                    <Activity />
                    {openAiLoading ? "Analyse en cours…" : openAiAnalysis ? "Actualiser l’analyse" : "Analyser maintenant"}
                  </button>
                </div>
              </div>
              {openAiLoading && !openAiAnalysis && (
                <div className="openAiEmpty"><Bot /><b>OpenAI inspecte le contexte actuel…</b><span>L’actif, la période et les dernières données sont analysés ensemble.</span></div>
              )}
              {openAiError && (
                <div className="openAiError">
                  <AlertTriangle />
                  <span><b>Analyse OpenAI indisponible</b><small>{openAiError === "OPENAI_LIMIT" || openAiError === "RATE_LIMITED" ? "Limite temporaire atteinte. Réessayez dans une minute." : openAiError === "OPENAI_NOT_CONFIGURED" ? "La clé serveur OPENAI_API_KEY n’est pas encore disponible pour ce déploiement." : "Vérifiez la clé, le crédit API ou réessayez dans quelques instants."}</small></span>
                  <button onClick={() => void runOpenAiAnalysis(true)}>Réessayer</button>
                </div>
              )}
              {openAiAnalysis && (
                <>
                  <div className="openAiVerdict">
                    <div>
                      <span>Décision IA conditionnelle · {timeframeLabel}</span>
                      <b className={openAiAnalysis.decision === "ACHETER" ? "buy" : openAiAnalysis.decision === "VENDRE" ? "sell" : "wait"}>{openAiAnalysis.decision}</b>
                      <small>Confiance d’alignement {openAiAnalysis.confidence}% · modèle {openAiAnalysis.model}</small>
                    </div>
                    <p>{openAiAnalysis.summary}</p>
                  </div>
                  <div className="openAiColumns">
                    <article><h3>Facteurs favorables</h3>{openAiAnalysis.drivers.map((item, index) => <p key={index}><i>{index + 1}</i>{item}</p>)}</article>
                    <article className="risks"><h3>Risques à surveiller</h3>{openAiAnalysis.risks.map((item, index) => <p key={index}><AlertTriangle />{item}</p>)}</article>
                  </div>
                  <div className="openAiInvalidation"><ShieldCheck /><span><b>Condition d’invalidation</b>{openAiAnalysis.invalidation}</span><small>Généré {new Date(openAiAnalysis.generatedAt).toLocaleString(locale)}</small></div>
                </>
              )}
              {!openAiLoading && !openAiError && !openAiAnalysis && (
                <div className="openAiEmpty"><Bot /><b>Analyse prête</b><span>Cliquez pour obtenir une explication IA liée à {active.symbol} sur {timeframeLabel}.</span></div>
              )}
            </section>
            <section
              className={
                "bigdataPanel " + (bigdataLoading ? "bigdataLoading" : "")
              }
            >
              <div className="bigdataHead">
                <div className="bigdataBrand">
                  <Bot />
                  <span>
                    <b>INTELLIGENCE BIGDATA.COM</b>
                    <small>
                      Catalyseurs, contexte fondamental et risques intégrés au
                      score prévisionnel.
                    </small>
                  </span>
                </div>
                <span
                  className={
                    "bigdataStatus " + (bigdata?.connected ? "live" : "")
                  }
                >
                  <i />
                  {bigdataLoading
                    ? "Analyse en cours"
                    : bigdata?.connected
                      ? "Données directes"
                      : "Snapshot vérifié"}
                </span>
              </div>
              {bigdata ? (
                <>
                  <div className="bigdataSummary">
                    <div className="bigdataScore">
                      <span>Impact sur la prévision</span>
                      <b
                        className={
                          bigdata.bias > 0
                            ? "buy"
                            : bigdata.bias < 0
                              ? "sell"
                              : "wait"
                        }
                      >
                        {bigdata.bias > 0 ? "+" : ""}
                        {bigdata.bias}
                      </b>
                      <small>Confiance {bigdata.confidence}%</small>
                    </div>
                    <p className="bigdataNarrative">{bigdata.summary}</p>
                  </div>
                  <div className="bigdataGrid">
                    {bigdata.catalysts?.slice(0, 3).map((c, index) => (
                      <a
                        key={c.title + index}
                        href={c.url || "https://bigdata.com"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>
                          {c.window} · {c.impact}
                        </span>
                        <b>{c.title}</b>
                        <small>{c.detail}</small>
                      </a>
                    ))}
                  </div>
                  <div className="bigdataFooter">
                    <span>
                      Mis à jour{" "}
                      {new Date(bigdata.updatedAt).toLocaleString(locale)} ·
                      mode {bigdata.connected ? "direct" : "snapshot"}
                    </span>
                    <span>
                      {bigdata.sources?.slice(0, 2).map((s, index) => (
                        <a
                          key={s.url}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {index ? " · " : ""}
                          {s.title}
                        </a>
                      ))}
                    </span>
                  </div>
                </>
              ) : (
                <div className="emptySmall">
                  Intelligence Bigdata temporairement indisponible.
                </div>
              )}
            </section>
            <section className="macroWatch">
              <div className="macroHead">
                <div>
                  <Newspaper />
                  <span>
                    <b>Décisions publiques et environnement macro</b>
                    <small>
                      Références officielles vérifiées le 28 août 2026 · ouvrir
                      la source pour contrôler une mise à jour.
                    </small>
                  </span>
                </div>
              </div>
              <div className="macroGrid">
                {macroSources.map((m) => (
                  <a key={m.zone} href={m.url} target="_blank" rel="noreferrer">
                    <span>{m.zone}</span>
                    <b>{m.title}</b>
                    <p>{m.detail}</p>
                    <em>
                      Source officielle <ExternalLink />
                    </em>
                  </a>
                ))}
              </div>
            </section>
            <section className="forecastNews">
              <div>
                <h2>Actualités récentes de {active.symbol}</h2>
                <button onClick={() => setView("Actualités")}>
                  Voir toutes les actualités
                </button>
              </div>
              {(news[active.key] || []).slice(0, 4).map((n) => (
                <button key={n.id} onClick={() => openNews(n)}>
                  <span>
                    <b>{n.title}</b>
                    <small>
                      {n.publisher} ·{" "}
                      {n.publishedAt
                        ? new Date(n.publishedAt).toLocaleString("fr-FR")
                        : "date indisponible"}
                    </small>
                  </span>
                  <ExternalLink />
                </button>
              ))}
              {!news[active.key]?.length && (
                <p className="emptySmall">
                  Aucune actualité récente disponible pour cet actif.
                </p>
              )}
            </section>
            <div className="forecastDisclaimer">
              <ShieldCheck />
              <p>
                <b>Prévision éducative, non conseil financier.</b> Le moteur
                produit des scénarios conditionnels et une fourchette
                d’incertitude. OpenAI apporte une lecture explicative séparée,
                sans remplacer les données, ni garantir un rendement. Le
                trading peut entraîner une perte partielle ou totale du capital.
              </p>
            </div>
          </section>
        )}

        {view === "Backtest" && (
          <section className="module" data-guide="backtest">
            <div className="moduleHead">
              <div>
                <p>LABORATOIRE DE STRATÉGIE</p>
                <h1>
                  Backtest de {active.symbol} · {timeframeLabel}
                </h1>
                <span>
                  Estimation historique d’un croisement prix/EMA 20, frais
                  théoriques de 0,12 % inclus.
                </span>
              </div>
              <button onClick={() => setView("Cockpit")}>
                <ChartNoAxesCombined />
                Changer l’actif ou la période
              </button>
            </div>
            {backtest ? (
              <>
                <div className="backtestGrid">
                  <article>
                    <span>Signaux testés</span>
                    <b>{backtest.trades}</b>
                    <small>sur les données actuellement chargées</small>
                  </article>
                  <article>
                    <span>Taux de réussite</span>
                    <b>{backtest.winRate.toFixed(1)}%</b>
                    <small>transactions positives après frais</small>
                  </article>
                  <article>
                    <span>Résultat cumulé</span>
                    <b className={backtest.net >= 0 ? "buy" : "sell"}>
                      {backtest.net >= 0 ? "+" : ""}
                      {backtest.net.toFixed(2)}%
                    </b>
                    <small>sans effet de levier</small>
                  </article>
                  <article>
                    <span>Drawdown maximal</span>
                    <b>{backtest.maxDrawdown.toFixed(2)}%</b>
                    <small>baisse depuis le meilleur niveau</small>
                  </article>
                  <article>
                    <span>Gain moyen par signal</span>
                    <b className={backtest.averageTrade >= 0 ? "buy" : "sell"}>{backtest.averageTrade.toFixed(2)}%</b>
                    <small>après frais théoriques</small>
                  </article>
                  <article>
                    <span>Facteur de profit</span>
                    <b>{Number.isFinite(backtest.profitFactor) ? backtest.profitFactor.toFixed(2) : "∞"}</b>
                    <small>gains bruts divisés par pertes brutes</small>
                  </article>
                  <article>
                    <span>Référence passive</span>
                    <b className={backtest.buyHold >= 0 ? "buy" : "sell"}>{backtest.buyHold >= 0 ? "+" : ""}{backtest.buyHold.toFixed(2)}%</b>
                    <small>achat-conservation sur le même échantillon</small>
                  </article>
                  <article>
                    <span>Qualité de l’échantillon</span>
                    <b>{backtest.sampleQuality}</b>
                    <small>{backtest.trades} signaux observés</small>
                  </article>
                </div>
                <div className="backtestNotice">
                  <ShieldCheck />
                  <div>
                    <h2>Lecture honnête du résultat</h2>
                    <p>
                      Ce test simplifié mesure une règle technique sur un
                      échantillon limité. Il ne prouve pas qu’elle fonctionnera
                      à l’avenir et n’intègre ni slippage réel, ni liquidité, ni
                      fiscalité. Un résultat fondé sur moins de 20 signaux est
                      insuffisant pour conclure.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="favoriteEmpty">
                <FlaskConical />
                <h2>Historique insuffisant</h2>
                <p>
                  Ouvrez le cockpit, choisissez une période puis revenez au
                  backtest.
                </p>
              </div>
            )}
          </section>
        )}

        {view === "Passeports" && (
          <section className="module" data-guide="passports">
            <div className="moduleHead">
              <div>
                <p>PASSEPORTS DE DÉCISION</p>
                <h1>Historique traçable des analyses</h1>
                <span>
                  Chaque passeport conserve le contexte exact observé au moment
                  de la décision.
                </span>
              </div>
              <button onClick={() => setView("Cockpit")}>
                <Plus />
                Créer depuis le cockpit
              </button>
            </div>
            {passports.length ? (
              <div className="passportGrid">
                {passports.map((p) => (
                  <article key={p.id}>
                    <div className="passportHead">
                      <span>
                        <b>{p.symbol}</b>
                        <small>
                          {p.kind} ·{" "}
                          {timeframes.find(([k]) => k === p.period)?.[1]}
                        </small>
                      </span>
                      <strong className={tone(p.decision)}>{p.decision}</strong>
                    </div>
                    <div className="passportFacts">
                      <span>
                        Prix observé<b>{number(p.price, 5)}</b>
                      </span>
                      <span>
                        Cohérence technique
                        <b>{p.coherence === null ? "—" : p.coherence + "%"}</b>
                      </span>
                      <span>
                        Alignement horizons<b>{p.alignment}</b>
                      </span>
                      <span>
                        Qualité des données<b>{p.dataQuality}</b>
                      </span>
                      <span>
                        Support / résistance
                        <b>
                          {number(p.support, 5)} / {number(p.resistance, 5)}
                        </b>
                      </span>
                      <span>
                        Taille théorique
                        <b>
                          {p.positionSize === null
                            ? "—"
                            : number(p.positionSize, 4) + " unités"}
                        </b>
                      </span>
                      <span>
                        Fiabilité prévisionnelle
                        <b>{p.reliability == null ? "—" : p.reliability + "%"}</b>
                      </span>
                      <span>
                        Preuves contextuelles
                        <b>{p.newsCount ?? 0} actualités · {p.aiModel || "Moteur quantitatif"}</b>
                      </span>
                    </div>
                    <footer>
                      <span>{p.createdAt}{p.evidence ? ` · ${p.evidence}` : ""}</span>
                      <button
                        onClick={() =>
                          setPassports((x) => x.filter((v) => v.id !== p.id))
                        }
                      >
                        <Trash2 />
                        Supprimer
                      </button>
                    </footer>
                  </article>
                ))}
              </div>
            ) : (
              <div className="favoriteEmpty">
                <ClipboardCheck />
                <h2>Aucun passeport enregistré</h2>
                <p>
                  Dans le cockpit, cliquez sur « Enregistrer le passeport » pour
                  figer une analyse et ses données.
                </p>
                <button onClick={() => setView("Cockpit")}>
                  Ouvrir le cockpit
                </button>
              </div>
            )}
          </section>
        )}

        {view === "Alertes" && (
          <section className="module narrow" data-guide="alerts">
            <div className="moduleHead">
              <div>
                <p>ALERTES</p>
                <h1>Surveillance des niveaux</h1>
                <span>
                  Choisissez un actif dans le cockpit, puis définissez votre
                  prix cible.
                </span>
              </div>
            </div>
            <div className="formCard">
              <label>
                Actif sélectionné<strong>{active.symbol}</strong>
              </label>
              <label>
                Prix cible
                <input
                  type="number"
                  placeholder={
                    active.last ? number(active.last, 5) : "Ex. 100000"
                  }
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                />
              </label>
              <button onClick={addAlert}>
                <Plus />
                Créer l’alerte
              </button>
            </div>
            <div className="listCard">
              <h2>
                Alertes actives <span>{alerts.length}</span>
              </h2>
              {alerts.length ? (
                alerts.map((a) => (
                  <div className="listItem" key={a.id}>
                    <Bell />
                    <span>
                      <b>{a.symbol}</b>
                      <small>Lorsque le prix atteint {a.price}</small>
                    </span>
                    <button
                      onClick={() =>
                        setAlerts((x) => x.filter((v) => v.id !== a.id))
                      }
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))
              ) : (
                <div className="emptySmall">Aucune alerte créée.</div>
              )}
            </div>
          </section>
        )}

        {view === "Actualités" && (
          <section className="module" data-guide="news">
            <div className="moduleHead">
              <div>
                <p>ACTUALITÉS DES MARCHÉS</p>
                <h1>News reliées aux actifs suivis</h1>
                <span>
                  Dernière collecte{" "}
                  {newsUpdated
                    ? new Date(newsUpdated).toLocaleString("fr-FR")
                    : "en cours…"}{" "}
                  · Cliquez sur une notification pour lire son rapport.
                </span>
              </div>
              <button
                onClick={() =>
                  fetch("/api/news", { cache: "no-store" })
                    .then((r) => r.json())
                    .then((d) => {
                      setNews(d.byAsset || {});
                      setNewsUpdated(d.updatedAt || "");
                    })
                }
              >
                <Newspaper />
                Actualiser
              </button>
            </div>
            <div className="newsGrid">
              {allNews
                .filter(
                  (n) =>
                    kind === "Tous" ||
                    rows.find((r) => r.key === n.key)?.kind === kind,
                )
                .map((n) => (
                  <button
                    key={(n.key || "") + n.id}
                    onClick={() => openNews(n, n.asset, n.key)}
                  >
                    {n.thumbnail && <img src={n.thumbnail} alt="" />}
                    <div>
                      <span>
                        <Bell />
                        {n.asset}
                      </span>
                      <h2>{n.title}</h2>
                      <p>
                        {n.publisher} ·{" "}
                        {n.publishedAt
                          ? new Date(n.publishedAt).toLocaleString("fr-FR")
                          : "date indisponible"}
                      </p>
                      <em>
                        Ouvrir le rapport <ExternalLink />
                      </em>
                    </div>
                  </button>
                ))}
            </div>
            {!allNews.length && (
              <div className="emptySmall">
                Aucune actualité n’est disponible pour le moment.
              </div>
            )}
          </section>
        )}

        {view === "Journal" && (
          <section className="module narrow" data-guide="journal">
            <div className="moduleHead">
              <div>
                <p>JOURNAL</p>
                <h1>Journal de décisions</h1>
                <span>
                  Notez votre raisonnement avant d’agir pour garder une méthode
                  disciplinée.
                </span>
              </div>
            </div>
            <div className="formCard">
              <label>
                Nouvelle note
                <textarea
                  placeholder={`${active.symbol} — décision, contexte, niveau d’entrée, invalidation…`}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <button onClick={addNote}>
                <Plus />
                Enregistrer la note
              </button>
            </div>
            <div className="listCard">
              <h2>
                Historique <span>{journal.length}</span>
              </h2>
              {journal.length ? (
                journal.map((j) => (
                  <div className="listItem journalItem" key={j.id}>
                    <BookOpen />
                    <span>
                      <b>{j.text}</b>
                      <small>{j.date}</small>
                    </span>
                    <button
                      onClick={() =>
                        setJournal((x) => x.filter((v) => v.id !== j.id))
                      }
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))
              ) : (
                <div className="emptySmall">Votre journal est vide.</div>
              )}
            </div>
          </section>
        )}

        {view === "Paramètres" && (
          <section className="module narrow" data-guide="settings">
            <div className="moduleHead">
              <div>
                <p>PARAMÈTRES</p>
                <h1>Profil trader et préférences</h1>
                <span>
                  Le profil adapte les calculs de risque sans exécuter aucun
                  ordre.
                </span>
              </div>
            </div>
            <div className="profileCard">
              <div className="profileTitle">
                <UserRound />
                <div>
                  <h2>Mon profil de risque</h2>
                  <p>
                    Ces valeurs restent enregistrées uniquement dans ce
                    navigateur.
                  </p>
                </div>
              </div>
              <div className="profileFields">
                <label>
                  Niveau
                  <select
                    value={profile.level}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, level: e.target.value }))
                    }
                  >
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                </label>
                <label>
                  Style
                  <select
                    value={profile.style}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, style: e.target.value }))
                    }
                  >
                    <option>Scalping</option>
                    <option>Day trading</option>
                    <option>Swing</option>
                    <option>Investissement</option>
                  </select>
                </label>
                <label>
                  Capital de référence
                  <input
                    type="number"
                    min="0"
                    value={profile.capital}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        capital: Number(e.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  Risque maximal par scénario (%)
                  <input
                    type="number"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={profile.riskPercent}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        riskPercent: Number(e.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  Perte journalière maximale (%)
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={profile.dailyLoss}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        dailyLoss: Number(e.target.value),
                      }))
                    }
                  />
                </label>
              </div>
              <div className="riskRule">
                <ShieldCheck />
                <span>
                  <b>
                    Règle active : {profile.riskPercent}% maximum par scénario
                  </b>
                  <small>
                    Avec {number(profile.capital)} de capital, le risque
                    monétaire théorique maximal est de{" "}
                    {number((profile.capital * profile.riskPercent) / 100)}.
                  </small>
                </span>
              </div>
            </div>
            <div className="settingsCard">
              <label>
                <span>
                  <b>Actualisation automatique</b>
                  <small>Relance le scanner toutes les 5 minutes.</small>
                </span>
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              </label>
              <label>
                <span>
                  <b>Explications techniques</b>
                  <small>
                    Affiche l’interprétation associée à la décision.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={explanations}
                  onChange={(e) => setExplanations(e.target.checked)}
                />
              </label>
              <div className="provider">
                <Wifi />
                <span>
                  <b>Fournisseurs de données</b>
                  <small>
                    Binance · Yahoo Finance · Financial Datasets prêt mais sans
                    crédits
                  </small>
                </span>
                <i>Partiels</i>
              </div>
              <div className="provider">
                <Bot />
                <span>
                  <b>Bigdata.com</b>
                  <small>
                    Contexte fondamental, catalyseurs et risques intégrés aux
                    prévisions.
                  </small>
                </span>
                <i>{bigdata?.connected ? "Direct" : "Snapshot"}</i>
              </div>
              <div className="provider">
                <Bot />
                <span>
                  <b>Assistant OpenAI</b>
                  <small>
                    L’interface est préparée ; activation suspendue par
                    l’autorisation du connecteur.
                  </small>
                </span>
                <i>En attente</i>
              </div>
              <div className="provider">
                <ShieldCheck />
                <span>
                  <b>Mode éducatif sécurisé</b>
                  <small>Aucun ordre n’est exécuté par l’application.</small>
                </span>
                <i>Toujours actif</i>
              </div>
            </div>
          </section>
        )}

        {selectedNews && (
          <div className="newsModal" role="dialog" aria-modal="true">
            <div className="newsReport">
              <button
                className="closeNews"
                onClick={() => setSelectedNews(null)}
              >
                <X />
              </button>
              <p className="eyebrow">
                RAPPORT D’ACTUALITÉ · {selectedNews.asset}
              </p>
              <h1>{selectedNews.title}</h1>
              <div className="newsMeta">
                {selectedNews.publisher} ·{" "}
                {selectedNews.publishedAt
                  ? new Date(selectedNews.publishedAt).toLocaleString("fr-FR")
                  : "date indisponible"}
              </div>
              <section>
                <h2>Pourquoi cette nouvelle est pertinente</h2>
                <p>
                  Cette information est associée à {selectedNews.asset} parce
                  qu’elle concerne directement l’actif, son marché ou son
                  environnement économique. Elle peut influencer la volatilité,
                  les anticipations et le sentiment, mais son effet réel doit
                  être confirmé par le prix et le volume.
                </p>
              </section>
              <section>
                <h2>Comment l’intégrer à la décision</h2>
                <p>
                  Comparez l’heure de publication au mouvement du graphique. Une
                  réaction durable au-dessus d’une résistance ou sous un support
                  a davantage de poids qu’un mouvement initial rapidement
                  annulé. Le signal technique du cockpit n’est pas recalculé à
                  partir du seul titre.
                </p>
              </section>
              <section>
                <h2>Risques à surveiller</h2>
                <p>
                  Le titre peut simplifier le contenu, la réaction peut déjà
                  être intégrée dans le cours et plusieurs nouvelles
                  contradictoires peuvent apparaître. Consultez toujours la
                  source complète avant toute décision.
                </p>
              </section>
              <a href={selectedNews.link} target="_blank" rel="noreferrer">
                Lire l’article complet chez {selectedNews.publisher}
                <ExternalLink />
              </a>
            </div>
          </div>
        )}
        <footer>
          <span>
            <Wifi />
            Données fournisseurs en direct
          </span>
          <span>
            <AlertTriangle />
            Le trading peut entraîner la perte totale du capital — aucun
            rendement garanti
          </span>
        </footer>
        <InteractiveGuide language={language} onNavigate={setView} />
      </main>
    </div>
  );
}
