"use client";
import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, ArrowRight } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lang } from "@/lib/i18n";
import { discoveryText } from "./translations";
const stages = [
  {name:"Panorama", title:"Commencer par le contexte.", text:"Comparez les familles de marchés pour choisir ce que vous souhaitez approfondir.", rows:["Mouvement à examiner", "Contexte à comparer", "Tendance à observer"]},
  {name:"Indicateurs", title:"Croiser les observations.", text:"Lisez les indicateurs ensemble et vérifiez la cohérence avec la période choisie.", rows:["Momentum et volatilité", "Supports et résistances", "Tendance et Ichimoku"]},
  {name:"Scénarios", title:"Comprendre les conditions.", text:"L’IA explique les éléments à surveiller et les limites. Vous décidez de la suite.", rows:["Confirmation à rechercher", "Invalidation à définir", "Autres horizons à comparer"]},
];
export default function MarketWalkthrough({language}: {language: Lang}) {
  const [step,setStep]=useState(0);
  const [playing,setPlaying]=useState(false);
  const t=(text:string)=>discoveryText(text,language);
  useEffect(()=>{
    if (!playing) return;
    const timer=window.setTimeout(()=>{if(step===2) setPlaying(false); else setStep(step+1);},4000);
    const pause=()=>{if(document.hidden)setPlaying(false);};
    const preference=window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop=()=>setPlaying(false);
    document.addEventListener("visibilitychange",pause);
    preference.addEventListener("change",stop);
    return ()=>{clearTimeout(timer);document.removeEventListener("visibilitychange",pause);preference.removeEventListener("change",stop);};
  },[playing,step]);
  const current=stages[step];
  return <section className="cm-section cm-wrap cm-walkthrough" id="demonstration" aria-labelledby="demo-title">
    <div className="cm-section-heading"><p className="cm-eyebrow">{t("LA PLATEFORME EN MOUVEMENT")}</p><h2 id="demo-title">{t("Du panorama aux scénarios.")}<br/><span>{t("Suivez le fil de l’analyse.")}</span></h2><p>{t("Une démonstration guidée, à votre rythme. Les exemples ci-dessous ne représentent pas des analyses de marché actuelles.")}</p></div>
    <div className="cm-demo-toolbar"><div role="group" aria-label={t("Étapes de la démonstration")}>{stages.map((stage,i)=><button type="button" aria-pressed={step===i} aria-controls="demo-reading" key={stage.name} onClick={()=>{setPlaying(false);setStep(i);}}><span>0{i+1}</span>{t(stage.name)}</button>)}</div><button type="button" className="cm-demo-play" onClick={()=>{if(playing)setPlaying(false);else {if(step===2)setStep(0);setPlaying(true);}}}>{playing ? <Pause aria-hidden="true"/> : step===2 ? <RotateCcw aria-hidden="true"/> : <Play aria-hidden="true"/>}{t(playing?"Mettre en pause":step===2?"Rejouer":"Lire la démonstration")}</button></div>
    <div className="cm-demo-surface"><div className="cm-demo-table" tabIndex={0} role="region" aria-label={t("Tableau de présentation des marchés")}><Table><TableCaption>{t("Exemples pédagogiques · aucune donnée en direct")}</TableCaption><TableHeader><TableRow><TableHead scope="col">{t("Univers")}</TableHead><TableHead scope="col">{t("Exemple d’actif")}</TableHead><TableHead scope="col">{t(current.name)}</TableHead></TableRow></TableHeader><TableBody>{["Cryptomonnaies","Forex","Indices"].map((market,i)=><TableRow key={market}><TableCell>{t(market)}</TableCell><TableCell>{["Bitcoin","EUR / USD","S&P 500"][i]}</TableCell><TableCell><span className="cm-demo-value" key={step}>{t(current.rows[i])}</span></TableCell></TableRow>)}</TableBody></Table></div><div className="cm-demo-reading" id="demo-reading" aria-live="polite" aria-atomic="true"><p className="cm-eyebrow">0{step+1} / 03</p><h3>{t(current.title)}</h3><p>{t(current.text)}</p><div className="cm-demo-indicators" aria-hidden="true">{stages.map((_,i)=><span key={i} className={step===i?"active":""}/>)}</div><p className="cm-demo-principle"><ArrowRight aria-hidden="true"/>{t("L’IA éclaire, vous décidez.")}</p></div></div>
  </section>;
}
