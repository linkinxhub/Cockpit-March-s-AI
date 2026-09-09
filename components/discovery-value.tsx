"use client";

import Link from "next/link";
import { BookOpen, Layers3, NotebookPen, ArrowUpRight, Sparkles } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lang } from "@/lib/i18n";
import { AI_MONTHLY_LIMITS } from "@/lib/ai-plan-policy";
import { discoveryValueCopy } from "@/lib/discovery-value-copy";
import "./discovery-value.css";

const icons = [BookOpen, Layers3, NotebookPen];
const plans = ["DISCOVERY", "PRO", "EXPERT"] as const;

export default function DiscoveryValue({ language }: { language: Lang }) {
  const c = discoveryValueCopy[language];
  return <>
    <section className="cm-section cm-wrap cm-value" id="routine" aria-labelledby="routine-title" translate="no">
      <div className="cm-section-heading">
        <p className="cm-eyebrow">{c.eyebrow}</p>
        <h2 id="routine-title">{c.title}</h2>
        <p>{c.intro}</p>
      </div>
      <div className="cm-value-routines">
        {c.routines.map((routine, index) => {
          const Icon = icons[index];
          return <article key={routine.title}>
            <div className="cm-value-step"><Icon aria-hidden="true" /><span>0{index + 1}</span></div>
            <p className="cm-value-need">{routine.need}</p>
            <h3>{routine.title}</h3>
            <p>{routine.text}</p>
            <p className="cm-value-access">{routine.access}</p>
          </article>;
        })}
      </div>
      <details className="cm-value-trace"><summary>{c.trace}</summary><p>{c.traceDetail}</p></details>
    </section>
    <section className="cm-value-ai" aria-labelledby="included-ai-title" translate="no">
      <div className="cm-wrap cm-value-ai-grid">
        <div className="cm-value-ai-copy">
          <Sparkles aria-hidden="true" />
          <p className="cm-eyebrow">{c.aiEyebrow}</p>
          <h2 id="included-ai-title">{c.aiTitle}</h2>
          <p>{c.aiText}</p>
          <Link className="cm-button" href="/">{c.start}<ArrowUpRight aria-hidden="true" /></Link>
        </div>
        <div className="cm-value-plans">
          <div className="cm-value-table" role="region" tabIndex={0} aria-label={c.planHeading}>
            <Table>
              <TableCaption>{c.planHeading}</TableCaption>
              <TableHeader><TableRow><TableHead scope="col">{c.plan}</TableHead><TableHead scope="col">{c.use}</TableHead><TableHead scope="col">{c.allowance}</TableHead></TableRow></TableHeader>
              <TableBody>{c.plans.map((plan, index) => <TableRow key={plans[index]}><TableHead scope="row">{plan.name}</TableHead><TableCell>{plan.use}</TableCell><TableCell className="cm-value-quota">{AI_MONTHLY_LIMITS[plans[index]]}</TableCell></TableRow>)}</TableBody>
            </Table>
          </div>
          <p className="cm-value-quota-note">{c.quotaNote}</p>
          <Link className="cm-text-link" href="#offres">{c.compare}<ArrowUpRight aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  </>;
}

export function DiscoveryFaq({ language }: { language: Lang }) {
  return <>{discoveryValueCopy[language].faq.map(([question, answer]) => <details key={question} translate="no"><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</>;
}
