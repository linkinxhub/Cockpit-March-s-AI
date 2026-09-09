"use client";
import PlatformHighlights from "@/components/platform-highlights";
import PlanOffers from "@/components/plan-offers";

import { useState, useEffect, useRef } from "react";
import type { Lang } from "@/lib/i18n";
import { useLanguage } from "@/lib/use-language";
import { LanguagePicker } from "@/components/language-picker";
import { discoveryText } from "./translations";
import MarketWalkthrough from "./market-walkthrough";
import DiscoveryValue, { DiscoveryFaq } from "@/components/discovery-value";
import Link from "next/link";
import { ArrowUpRight, Radar, ChartNoAxesCombined, ScanLine, Globe2, Layers3, ShieldCheck, MoveRight, Sparkles, Clock3, Pause, Play } from "lucide-react";

const horizons = [
  {label:"Court terme", period:"15 min · 30 min · 1 h", title:"Lire le mouvement. Attendre la confirmation.", text:"Observez les variations récentes, les niveaux techniques et les signaux sur une période courte. Une tendance de fond ne suffit pas à justifier une entrée immédiate.", points:["Repérer une accélération ou un essoufflement", "Comparer le signal aux indicateurs", "Identifier ce qui invaliderait le scénario"]},
  {label:"Quelques jours", period:"4 h · 1 jour · 1 semaine", title:"Replacer chaque mouvement dans sa tendance.", text:"Élargissez la lecture pour distinguer une correction d’un changement de direction. Comparez plusieurs horizons avant d’interpréter un signal isolé.", points:["Lire les supports et les résistances", "Croiser plusieurs unités de temps", "Intégrer le contexte des marchés"]},
  {label:"Longue durée", period:"1 mois · 6 mois · 1 an", title:"Prendre du recul. Construire une conviction.", text:"Explorez les grandes tendances et les scénarios de fond. Les projections restent des hypothèses : leur incertitude augmente avec l’horizon.", points:["Observer les cycles et la tendance de fond", "Confronter les scénarios possibles", "Réévaluer votre lecture dans le temps"]},
];

export default function Discovery() {
  const [language,setLanguage] = useLanguage();
  return <DiscoveryView language={language} setLanguage={setLanguage}/>;
}
export function DiscoveryView({language,setLanguage}: {language: Lang; setLanguage: (language: Lang) => void}) {
  const [horizon,setHorizon] = useState(0);
  const [backgroundPaused,setBackgroundPaused] = useState(false);
  const current = horizons[horizon];
  const root = useRef<HTMLDivElement>(null);
  const t = (text: string) => discoveryText(text, language);
  useEffect(() => {
    const title = document.title;
    document.title = discoveryText("Plus de clarté.", language) + " | Cockpit Marchés AI";
    return () => { document.title = title; };
  }, [language]);
  useEffect(() => {
    const container = root.current;
    if (!container || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if(entry.isIntersecting) { entry.target.classList.add("cm-revealed"); observer.unobserve(entry.target); }
    }, {threshold:0.12});
    container.querySelectorAll(".cm-section-heading, .cm-features article, .cm-steps article, .cm-terminal, .cm-demo-surface, .cm-responsibility, .cm-final").forEach(el=>observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const container = root.current;
    if (!container) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      container.style.setProperty("--cm-page-progress", String(distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, {passive:true});
    window.addEventListener("resize", schedule);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  useEffect(() => {
    const scene = root.current?.querySelector<HTMLElement>(".cm-hero-scene");
    if (!scene) return;
    const visibility = () => { scene.dataset.tabVisible = String(!document.hidden); };
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      for (const entry of entries) scene.dataset.inView = String(entry.isIntersecting);
    }) : null;
    observer?.observe(scene);
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  return <div className="cm-landing" ref={root} lang={language}>
    <Link className="cm-skip" href="#contenu">{t("Aller au contenu")}</Link>
    <header className="cm-header"><Link className="cm-logo" href="/decouvrir"><Radar aria-hidden="true"/><span>{t("COCKPIT")}<span>{t("MARCHÉS ")}<b>{t("AI")}</b></span></span></Link><nav aria-label={t("Navigation du site vitrine")}><Link href="#fonctionnalites">{t("La plateforme")}</Link><Link href="#horizons">{t("Votre horizon")}</Link><Link href="#questions">{t("Questions")}</Link></nav><LanguagePicker language={language} onChange={setLanguage}/><Link className="cm-button cm-small" href="/">{t("Ouvrir le cockpit ")}<ArrowUpRight aria-hidden="true"/></Link></header>
    <main id="contenu">
      <div className="cm-hero-scene" data-background-paused={backgroundPaused}>
        <picture className="cm-scene-image cm-globe-image"><source media="(max-width: 780px)" srcSet="/images/markets-global-mobile.webp"/><img src="/images/markets-global.webp" width="1536" height="1024" alt="" fetchPriority="high" decoding="async"/></picture>
      <button type="button" className="cm-background-control" aria-pressed={backgroundPaused} onClick={()=>setBackgroundPaused(value=>!value)}>{backgroundPaused ? <Play aria-hidden="true"/> : <Pause aria-hidden="true"/>}{t(backgroundPaused ? "Reprendre le fond animé" : "Mettre le fond en pause")}</button>
      <section className="cm-hero cm-wrap"><div className="cm-hero-copy"><p className="cm-eyebrow">{t("L’INTELLIGENCE DES MARCHÉS, À VOTRE PORTÉE")}</p><h1>{t("Plus de clarté.")}<br/>{t("Plus de recul.")}<br/><em>{t("Votre décision.")}</em></h1><p className="cm-lead">{t("Des marchés à l’analyse IA, rassemblez les éléments pour comprendre ce qui bouge — et pourquoi. Du court terme aux grandes tendances.")}</p><div className="cm-actions"><Link className="cm-button" href="/">{t("Explorer la plateforme ")}<ArrowUpRight aria-hidden="true"/></Link><Link className="cm-text-link" href="#fonctionnalites">{t("Découvrir les possibilités ")}<MoveRight aria-hidden="true"/></Link></div><p className="cm-footnote"><ShieldCheck aria-hidden="true"/>{t(" Une aide à la décision. Vous gardez le contrôle.")}</p></div>
      <div className="cm-terminal" aria-label={t("Illustration pédagogique d’une lecture de marché")}><div className="cm-terminal-head"><span><ScanLine aria-hidden="true"/>{t(" VUE D’ENSEMBLE")}</span><span className="cm-demo">{t("EXEMPLE ILLUSTRATIF")}</span></div><div className="cm-terminal-title"><div><small>{t("LECTURE MULTI-HORIZON")}</small><h2>{t("Un mouvement.")}<br/>{t("Plusieurs perspectives.")}</h2></div><ChartNoAxesCombined aria-hidden="true"/></div><div className="cm-chart"><div className="cm-grid-lines"/><svg viewBox="0 0 560 220" role="img" aria-label={t("Courbe schématique avec trois scénarios divergents, sans données de marché réelles")}><path d="M0 184 L25 170 L47 182 L70 142 L97 150 L120 120 L143 139 L167 104 L192 119 L217 84 L240 108 L265 65 L290 80 L314 56 L340 76 L365 51" fill="none" stroke="#b9f86b" strokeWidth="3"/><path d="M365 51 L395 44 L425 30 L460 36 L500 12 L555 2" fill="none" stroke="#b9f86b" strokeWidth="2" strokeDasharray="6 7"/><path d="M365 51 L395 65 L425 54 L460 76 L500 63 L555 76" fill="none" stroke="#a8bbd4" strokeWidth="2" strokeDasharray="6 7"/><path d="M365 51 L395 88 L425 105 L460 100 L500 143 L555 170" fill="none" stroke="#db967f" strokeWidth="2" strokeDasharray="6 7"/><line x1="365" y1="0" x2="365" y2="220" stroke="#53677d" strokeDasharray="3 6"/></svg><div className="cm-chart-caption"><span>{t("Observation")}</span><span>{t("Scénarios possibles")}</span></div></div><div className="cm-signal-row"><span>{t("Acheter")}</span><span>{t("Vendre")}</span><span>{t("Attendre")}</span></div><div className="cm-ai-note"><Sparkles aria-hidden="true"/><p><b>{t("Comprendre avant d’agir")}</b>{t("Une orientation expliquée, à confronter au contexte et à votre propre analyse.")}</p></div><p className="cm-terminal-foot">{t("Illustration pédagogique · aucun cours réel ni signal actuel.")}</p></div>
      </section>
      </div>
      <div className="cm-market-strip"><div className="cm-wrap"><span>{t("UNE VISION TRANSVERSALE")}</span><b>{t("Cryptomonnaies")}</b><b>{t("Forex")}</b><b>{t("Indices")}</b><b>{t("Or & argent")}</b></div></div>
      <section className="cm-section cm-wrap" id="fonctionnalites"><div className="cm-section-heading"><p className="cm-eyebrow">{t("01 / LE MARCHÉ, AVEC DU CONTEXTE")}</p><h2>{t("Relier les informations.")}<br/><span>{t("Faire émerger une lecture.")}</span></h2><p>{t("Un même espace pour observer les actifs, examiner les indicateurs et approfondir votre compréhension avec l’IA.")}</p></div><div className="cm-features">
        {[{icon:Globe2,n:"01",title:"Voir plus large",text:"Parcourez le panorama mondial, comparez les familles d’actifs et situez un mouvement dans son environnement."},{icon:Sparkles,n:"02",title:"Comprendre avec l’IA",text:"L’analyse instantanée apporte une explication du contexte, des facteurs observés et d’une orientation acheter, vendre ou attendre."},{icon:Layers3,n:"03",title:"Croiser les indicateurs",text:"Explorez les indicateurs techniques, dont Ichimoku, et confrontez leurs signaux à la période affichée."},{icon:ChartNoAxesCombined,n:"04",title:"Explorer les scénarios",text:"Visualisez les projections et leur horizon. Une prévision propose une trajectoire possible, jamais un résultat garanti."},{icon:Clock3,n:"05",title:"Suivre ce qui change",text:"Consultez les actualisations, les actualités et l’état des marchés. La fraîcheur dépend des sources et de leur disponibilité."},{icon:Radar,n:"06",title:"Repérer ce qui mérite attention",text:"Utilisez le scanner et les opportunités pour orienter votre recherche, puis examinez chaque actif dans le cockpit."}].map(({icon:Icon,n,title,text})=><article key={n}><div className="cm-feature-top"><Icon aria-hidden="true"/><span>{n}</span></div><h3>{t(title)}</h3><p>{t(text)}</p></article>)}
      </div><p className="cm-availability">{t("L’accès aux fonctions dépend du compte, de l’offre et de la disponibilité des fournisseurs de données et de l’IA.")}</p></section>
      <MarketWalkthrough language={language}/>
      <section className="cm-horizons" id="horizons"><div className="cm-wrap"><div className="cm-section-heading"><p className="cm-eyebrow">{t("02 / LE BON RECUL, AU BON MOMENT")}</p><h2>{t("Votre horizon change.")}<br/><span>{t("Votre lecture aussi.")}</span></h2><p>{t("Un signal à quinze minutes ne raconte pas la même histoire qu’une tendance sur plusieurs mois.")}</p></div><div className="cm-horizon-buttons" role="group" aria-label={t("Choisir un exemple d’horizon")}>{horizons.map((h,i)=><button type="button" aria-pressed={horizon===i} onClick={()=>setHorizon(i)} key={h.label}>{t(h.label)}<ArrowUpRight aria-hidden="true"/></button>)}</div><div className="cm-horizon-detail" key={horizon} aria-live="polite"><div><p className="cm-eyebrow">{t(current.period)}</p><h3>{t(current.title)}</h3><p>{t(current.text)}</p></div><ul>{current.points.map((point,i)=><li key={point}><span>0{i+1}</span>{t(point)}</li>)}</ul></div><p className="cm-availability">{t("Exemples d’utilisation. Les périodes disponibles varient selon l’actif et les données accessibles.")}</p></div></section>
      <DiscoveryValue language={language}/>
      <section className="cm-responsibility cm-wrap"><ShieldCheck aria-hidden="true"/><div><p className="cm-eyebrow">{t("L’IA ÉCLAIRE. VOUS DÉCIDEZ.")}</p><h2>{t("La confiance commence")}<br/>{t("par des limites claires.")}</h2><p>{t("Cockpit Marchés AI est un outil d’analyse à vocation informative et éducative. Les signaux peuvent être erronés et les données retardées ou indisponibles. Aucun rendement n’est garanti. Les marchés comportent un risque de perte en capital.")}</p><p>{t("Les analyses ne constituent pas un conseil en investissement personnalisé. La décision finale vous appartient.")}</p></div></section>
      <section className="cm-section cm-wrap cm-faq" id="questions"><div className="cm-section-heading"><p className="cm-eyebrow">{t("LES QUESTIONS ESSENTIELLES")}</p><h2>{t("Avant d’ouvrir")}<br/><span>{t("votre cockpit.")}</span></h2></div><div><DiscoveryFaq language={language}/>{[["La plateforme achète-t-elle ou vend-elle à ma place ?","Les orientations acheter, vendre ou attendre servent à éclairer votre analyse. Le parcours présenté ne passe pas d’ordre à votre place : vous restez responsable de vos décisions et de leur exécution."],["Les cours sont-ils toujours en temps réel ?","La plateforme actualise les informations selon les sources, les actifs et les accès disponibles. Certaines données peuvent être différées. Vérifiez leur horodatage et leur disponibilité dans le cockpit."],["Une prévision peut-elle garantir un résultat ?","Non. Une projection repose sur des observations et des hypothèses qui peuvent changer. Comparez plusieurs scénarios et périodes ; une performance passée ne garantit pas une performance future."],["Comment accéder aux fonctionnalités ?","Ouvrez le cockpit pour découvrir les marchés, puis consultez votre compte pour connaître votre offre et vos accès. Les limites et fonctions disponibles dépendent de votre abonnement."],["Puis-je l’utiliser sur téléphone ?","La plateforme propose une interface adaptée aux mobiles et aux ordinateurs. Un écran plus grand facilite la comparaison des graphiques et des analyses détaillées."]].map(([q,a])=><details key={q}><summary>{t(q)}<span aria-hidden="true">+</span></summary><p>{t(a)}</p></details>)}</div></section>
      <PlatformHighlights/><div id="offres"><PlanOffers embedded/></div><section className="cm-final"><picture className="cm-scene-image cm-city-image"><source media="(max-width: 780px)" srcSet="/images/markets-city-mobile.webp"/><img src="/images/markets-city.webp" width="1536" height="1024" alt="" loading="lazy" decoding="async"/></picture><div className="cm-wrap"><p className="cm-eyebrow">{t("VOTRE PROCHAINE DÉCISION COMMENCE PAR UNE MEILLEURE LECTURE.")}</p><h2>{t("Prenez de la hauteur")}<br/>{t("sur les marchés.")}</h2><Link className="cm-button" href="/">{t("Ouvrir Cockpit Marchés AI ")}<ArrowUpRight aria-hidden="true"/></Link></div></section>
    </main>
  </div>;
}
