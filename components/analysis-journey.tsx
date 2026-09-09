"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, GitCompareArrows, Star, Bell, BookmarkCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Lang } from "@/lib/i18n";
import { compareHorizons, observedPriceChange, type ComparableSnapshot, type Horizon } from "@/lib/analysis-journey";
import { journeyCopy, periodLabel, readingLabel } from "@/lib/journey-copy";
import "./analysis-journey.css";

export type JourneyAction = "details" | "comparison" | "news" | "favorite" | "alert" | "journal" | "save" | "history" | "refresh";
type Props = {
  language: Lang; symbol: string; period: string; decision: string | null;
  busy: boolean; ready: boolean; stale: boolean; source?: string; dataUpdatedAt?: number | null;
  ai: boolean; summary?: string; price: number | null; comparisons: Horizon[]; comparisonsBusy: boolean;
  previous: ComparableSnapshot | null; favorite: boolean;
  access: { compare: boolean; alert: boolean; journal: boolean; passport: boolean };
  onAction: (action: JourneyAction) => void;
};

export default function AnalysisJourney(props: Props) {
  const [step, setStep] = useState("understand");
  const c = journeyCopy[props.language];
  const comparison = compareHorizons(props.ready && !props.comparisonsBusy ? props.comparisons : []);
  const previous = props.ready ? props.previous : null;
  const movement = previous ? observedPriceChange(previous.price, props.price) : null;
  const date = props.dataUpdatedAt ? new Date(props.dataUpdatedAt) : null;
  const reading = readingLabel(props.decision, props.language);
  const unavailable = props.busy ? c.loading : props.stale ? c.stale : c.unavailable;
  const act = (action: JourneyAction) => () => props.onAction(action);

  return <section className="analysis-journey" data-guide="analysis-journey" translate="no" aria-label={c.title}>
    <div className="journey-heading"><div><h2>{c.title}</h2><p>{c.intro}</p></div><span>{props.symbol} · {periodLabel(props.period, props.language)}</span></div>
    <Tabs value={step} onValueChange={setStep} className="journey-tabs">
      <TabsList className="journey-steps" aria-label={c.title}>
        <TabsTrigger value="understand"><span>1</span>{c.understand}</TabsTrigger>
        <TabsTrigger value="compare"><span>2</span>{c.compare}</TabsTrigger>
        <TabsTrigger value="follow"><span>3</span>{c.follow}</TabsTrigger>
      </TabsList>
      <TabsContent value="understand" className="journey-panel">
        <div className="journey-reading"><div><span>{c.reading}</span><h3>{props.ready ? reading : unavailable}</h3></div>{props.ready && <span className="journey-method">{props.ai ? c.ai : c.technical}</span>}</div>
        {props.ready ? <>
          <p>{c.confidence}</p>
          <dl className="journey-provenance"><div><dt>{c.source}</dt><dd>{props.source || c.unknown}</dd></div><div><dt>{c.date}</dt><dd>{date && Number.isFinite(date.getTime()) ? <time dateTime={date.toISOString()}>{date.toLocaleString(props.language, { timeZone: "UTC" })} UTC</time> : c.unknown}</dd></div></dl>
          <div className="journey-actions"><Button variant="outline" onClick={act("details")}><BookOpen />{c.details}</Button><Button variant="outline" onClick={() => setStep("compare")}>{c.next}<ArrowRight /></Button></div>
        </> : <Button variant="outline" disabled={props.busy} onClick={act("refresh")}><RefreshCw />{c.refresh}</Button>}
        <details className="journey-glossary"><summary>{c.glossary}</summary><p>{c.support}</p><p>{c.resistance}</p><p>{c.invalidation}</p></details>
      </TabsContent>
      <TabsContent value="compare" className="journey-panel">
        {!props.access.compare ? <><p>{c.comparisonHelp}</p><a className="journey-plan-link" href="/pricing">{c.plans}<ArrowRight size={16} /></a></> : props.busy || props.comparisonsBusy ? <p role="status">{c.loading}</p> : !props.ready ? <p role="status">{unavailable}</p> : <>
          <h3>{c[comparison.state]}</h3>
          {comparison.state !== "insufficient" && <>
            <p>{c[`${comparison.state}Help`]}</p>
            <div className="journey-horizons">{[[c.shortest, comparison.shortest], [c.longest, comparison.longest]].map(([label, item]) => {
              const horizon = item as Horizon;
              return <div key={String(label)}><span>{String(label)}</span><b>{periodLabel(horizon.period, props.language)}</b><p>{readingLabel(horizon.decision, props.language)}</p></div>;
            })}</div>
          </>}
          <div className="journey-actions"><Button variant="outline" onClick={act("comparison")}><GitCompareArrows />{c.openComparison}</Button><Button variant="outline" onClick={() => setStep("follow")}>{c.next}<ArrowRight /></Button></div>
        </>}
      </TabsContent>
      <TabsContent value="follow" className="journey-panel">
        <p>{c.followHelp}</p>
        <div className="journey-actions"><Button variant="outline" onClick={act("favorite")} aria-pressed={props.favorite}><Star fill={props.favorite ? "currentColor" : "none"} />{props.favorite ? c.savedFavorite : c.favorite}</Button><Button variant="outline" onClick={act("news")}>{c.news}</Button>
          {props.access.alert && <Button variant="outline" onClick={act("alert")}><Bell />{c.alert}</Button>}
          {props.access.journal && <Button variant="outline" disabled={!props.ready} onClick={act("journal")}><BookOpen />{c.journal}</Button>}
          {props.access.passport && <Button variant="outline" disabled={!props.ready} onClick={act("save")}><BookmarkCheck />{c.passport}</Button>}
        </div>
        {!props.ready && <p role="status">{unavailable}</p>}
        {props.access.passport ? <div className="journey-previous"><h3>{c.previous}</h3>{previous ? <>
          <time dateTime={previous.recordedAtIso}>{new Date(previous.recordedAtIso!).toLocaleString(props.language, { timeZone: "UTC" })} UTC</time>
          <dl><div><dt>{c.previousReading}</dt><dd>{readingLabel(previous.decision, props.language)}</dd></div><div><dt>{c.currentReading}</dt><dd>{reading}</dd></div><div><dt>{c.priceChange}</dt><dd>{movement === null ? "—" : new Intl.NumberFormat(props.language, { style: "percent", maximumFractionDigits: 2, signDisplay: "exceptZero" }).format(movement / 100)}</dd></div></dl>
          <p>{previous.decision === props.decision ? c.unchanged : c.changed} · {c.notPerformance}</p>
          {previous.summary && <details className="journey-glossary"><summary>{c.previousReading}</summary><p>{previous.summary}</p>{previous.invalidation && <p>{previous.invalidation}</p>}{props.summary && <><b>{c.currentReading}</b><p>{props.summary}</p></>}</details>}
        </> : <p>{props.ready ? c.noPrevious : unavailable}</p>}<Button variant="outline" onClick={act("history")}>{c.history}<ArrowRight /></Button></div> : <a className="journey-plan-link" href="/pricing">{c.plans}<ArrowRight size={16} /></a>}
      </TabsContent>
    </Tabs>
    <p className="journey-footnote">{c.noCredit}</p>
  </section>;
}
