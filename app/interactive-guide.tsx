"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, X } from "lucide-react";
import type { Lang } from "@/lib/i18n";

type GuideStep = {
  selector: string;
  view?: string;
  title: Record<Lang, string>;
  text: Record<Lang, string>;
};

const copy = {
  guide: { fr: "Guide interactif", en: "Interactive guide", de: "Interaktive Anleitung", nl: "Interactieve gids" },
  previous: { fr: "Précédent", en: "Previous", de: "Zurück", nl: "Vorige" },
  next: { fr: "Suivant", en: "Next", de: "Weiter", nl: "Volgende" },
  finish: { fr: "Terminer", en: "Finish", de: "Beenden", nl: "Voltooien" },
  close: { fr: "Fermer le guide", en: "Close guide", de: "Anleitung schließen", nl: "Gids sluiten" },
};

const steps: GuideStep[] = [
  { selector: "[data-guide='navigation']", title: { fr: "Navigation principale", en: "Main navigation", de: "Hauptnavigation", nl: "Hoofdnavigatie" }, text: { fr: "Accédez au cockpit, aux opportunités, marchés, prévisions, alertes, actualités, journal et paramètres.", en: "Open the dashboard, opportunities, markets, forecasts, alerts, news, journal and settings.", de: "Öffnen Sie Cockpit, Chancen, Märkte, Prognosen, Alarme, Nachrichten, Journal und Einstellungen.", nl: "Open cockpit, kansen, markten, prognoses, waarschuwingen, nieuws, journal en instellingen." } },
  { selector: "[data-guide='search-language']", title: { fr: "Recherche et langues", en: "Search and languages", de: "Suche und Sprachen", nl: "Zoeken en talen" }, text: { fr: "Recherchez un actif et traduisez toute la plateforme en FR, EN, DE ou NL. Cette barre reste visible pendant le défilement.", en: "Search for an asset and translate the platform into FR, EN, DE or NL. This bar remains visible while scrolling.", de: "Suchen Sie ein Asset und übersetzen Sie die Plattform in FR, EN, DE oder NL. Diese Leiste bleibt beim Scrollen sichtbar.", nl: "Zoek een actief en vertaal het platform naar FR, EN, DE of NL. Deze balk blijft zichtbaar tijdens het scrollen." } },
  { selector: "[data-guide='live-forecast']", title: { fr: "Prévision en direct", en: "Live forecast", de: "Live-Prognose", nl: "Live prognose" }, text: { fr: "Consultez l’orientation, la fourchette projetée et la fiabilité. Cliquez pour ouvrir le rapport prévisionnel complet.", en: "See direction, projected range and reliability. Click to open the full forecast report.", de: "Sehen Sie Richtung, prognostizierte Spanne und Zuverlässigkeit. Klicken Sie für den vollständigen Bericht.", nl: "Bekijk richting, verwachte bandbreedte en betrouwbaarheid. Klik voor het volledige rapport." } },
  { selector: "[data-guide='panorama']", title: { fr: "Panorama et mood", en: "Overview and mood", de: "Überblick und Stimmung", nl: "Overzicht en sentiment" }, text: { fr: "Filtrez les classes d’actifs et comparez leur sentiment. Cette zone peut être repliée pour gagner de la place.", en: "Filter asset classes and compare sentiment. Collapse this area to save space.", de: "Filtern Sie Anlageklassen und vergleichen Sie die Stimmung. Der Bereich ist einklappbar.", nl: "Filter activaklassen en vergelijk sentiment. Klap dit gebied in om ruimte te besparen." } },
  { selector: "[data-guide='asset-summary']", view: "Cockpit", title: { fr: "Actif sélectionné", en: "Selected asset", de: "Ausgewähltes Asset", nl: "Geselecteerd actief" }, text: { fr: "Le prix, la variation et toutes les analyses affichées correspondent toujours à cet actif et à la période choisie.", en: "Price, change and every displayed analysis always match this asset and selected timeframe.", de: "Preis, Veränderung und alle Analysen beziehen sich auf dieses Asset und den gewählten Zeitraum.", nl: "Prijs, wijziging en alle analyses horen bij dit actief en de gekozen periode." } },
  { selector: "[data-guide='timeframes']", view: "Cockpit", title: { fr: "Périodes d’analyse", en: "Analysis timeframes", de: "Analysezeiträume", nl: "Analyseperioden" }, text: { fr: "Changer la période recalcule le graphique, les indicateurs, la prévision et désormais l’analyse OpenAI.", en: "Changing timeframe recalculates the chart, indicators, forecast and now the OpenAI analysis.", de: "Ein Zeitraumwechsel berechnet Chart, Indikatoren, Prognose und OpenAI-Analyse neu.", nl: "Een periodewijziging herberekent grafiek, indicatoren, prognose en OpenAI-analyse." } },
  { selector: "[data-guide='decision']", view: "Cockpit", title: { fr: "Centre de décision", en: "Decision center", de: "Entscheidungszentrum", nl: "Beslissingscentrum" }, text: { fr: "La décision technique, sa confiance, le risque et les explications sont des aides éducatives, jamais une garantie de rendement.", en: "Technical decision, confidence, risk and explanations are educational aids, never a return guarantee.", de: "Technische Entscheidung, Konfidenz, Risiko und Erklärungen sind Lernhilfen, keine Renditegarantie.", nl: "Technische beslissing, vertrouwen, risico en uitleg zijn educatieve hulpmiddelen, geen rendementswaarborg." } },
  { selector: "[data-guide='scanner']", view: "Cockpit", title: { fr: "Scanner global", en: "Global scanner", de: "Globaler Scanner", nl: "Wereldwijde scanner" }, text: { fr: "Cliquez sur une ligne pour sélectionner l’actif. Les favoris, données, décision et risque restent lisibles dans un tableau global.", en: "Click a row to select the asset. Favorites, data, decision and risk remain visible in the global table.", de: "Klicken Sie eine Zeile zur Auswahl. Favoriten, Daten, Entscheidung und Risiko stehen in der Gesamttabelle.", nl: "Klik op een rij om het actief te selecteren. Favorieten, data, beslissing en risico staan in de globale tabel." } },
  { selector: "[data-guide='opportunities']", view: "Opportunités", title: { fr: "Radar d’opportunités", en: "Opportunity radar", de: "Chancenradar", nl: "Kansenradar" }, text: { fr: "Classez les configurations selon leur score, leur cohérence multi-périodes et leur rapport rendement/risque indicatif.", en: "Rank setups by score, multi-timeframe alignment and indicative risk/reward.", de: "Ordnen Sie Setups nach Score, Mehrperioden-Kohärenz und indikativem Chance-Risiko-Verhältnis.", nl: "Rangschik setups op score, afstemming over perioden en indicatieve risico-rendementsverhouding." } },
  { selector: "[data-guide='favorites']", view: "Favoris", title: { fr: "Liste de favoris", en: "Favorites list", de: "Favoritenliste", nl: "Favorietenlijst" }, text: { fr: "Regroupez les actifs à surveiller. La sélection reste enregistrée sur cet appareil.", en: "Group assets you want to monitor. The selection stays saved on this device.", de: "Gruppieren Sie zu beobachtende Assets. Die Auswahl bleibt auf diesem Gerät gespeichert.", nl: "Groepeer activa die u wilt volgen. De selectie blijft op dit apparaat bewaard." } },
  { selector: "[data-guide='markets-module']", view: "Marchés", title: { fr: "Vue globale des marchés", en: "Global market view", de: "Globale Marktansicht", nl: "Wereldwijd marktoverzicht" }, text: { fr: "Explorez tous les actifs disponibles et appliquez les catégories du panorama comme filtres.", en: "Explore all available assets and use overview categories as filters.", de: "Erkunden Sie alle verfügbaren Assets und nutzen Sie die Übersichtskategorien als Filter.", nl: "Verken alle beschikbare activa en gebruik overzichtscategorieën als filters." } },
  { selector: "[data-guide='ai-scanner-module']", view: "Scanner IA", title: { fr: "Classement du Scanner IA", en: "AI Scanner ranking", de: "KI-Scanner-Rangliste", nl: "AI-scannerranglijst" }, text: { fr: "Comparez rapidement décisions techniques, confiance, RSI, volatilité et niveaux de risque.", en: "Quickly compare technical decisions, confidence, RSI, volatility and risk levels.", de: "Vergleichen Sie technische Entscheidungen, Konfidenz, RSI, Volatilität und Risiko.", nl: "Vergelijk technische beslissingen, vertrouwen, RSI, volatiliteit en risico." } },
  { selector: "[data-guide='forecast-module']", view: "Prévisions", title: { fr: "Prévisions multi-facteurs", en: "Multi-factor forecasts", de: "Multifaktor-Prognosen", nl: "Multifactorprognoses" }, text: { fr: "Comparez les scénarios haussier, neutre et baissier sur plusieurs horizons avec une fourchette d’incertitude.", en: "Compare bullish, neutral and bearish scenarios across horizons with an uncertainty range.", de: "Vergleichen Sie bullische, neutrale und bärische Szenarien über mehrere Horizonte.", nl: "Vergelijk bullish, neutrale en bearish scenario’s over meerdere perioden." } },
  { selector: "[data-guide='openai-analysis']", view: "Prévisions", title: { fr: "Analyse instantanée OpenAI", en: "Instant OpenAI analysis", de: "Sofortige OpenAI-Analyse", nl: "Directe OpenAI-analyse" }, text: { fr: "OpenAI croise automatiquement technique, prévision, Bigdata et actualités après chaque changement d’actif, de période ou de données.", en: "OpenAI automatically combines technicals, forecast, Bigdata and news after every asset, timeframe or data change.", de: "OpenAI kombiniert nach jeder Asset-, Zeitraum- oder Datenänderung automatisch Technik, Prognose, Bigdata und Nachrichten.", nl: "OpenAI combineert techniek, prognose, Bigdata en nieuws automatisch na elke wijziging van actief, periode of data." } },
  { selector: "[data-guide='backtest']", view: "Backtest", title: { fr: "Laboratoire Backtest", en: "Backtest lab", de: "Backtest-Labor", nl: "Backtestlab" }, text: { fr: "Évaluez une règle sur l’historique. Un résultat passé ne garantit jamais une performance future.", en: "Evaluate a rule on historical data. Past results never guarantee future performance.", de: "Bewerten Sie eine Regel mit historischen Daten. Vergangene Ergebnisse garantieren keine Zukunftsleistung.", nl: "Beoordeel een regel op historische data. Resultaten uit het verleden garanderen niets." } },
  { selector: "[data-guide='passports']", view: "Passeports", title: { fr: "Passeports de décision", en: "Decision passports", de: "Entscheidungspässe", nl: "Beslissingspaspoorten" }, text: { fr: "Conservez une trace datée de l’actif, la période, la décision, les niveaux et la qualité des données.", en: "Keep a dated record of asset, timeframe, decision, levels and data quality.", de: "Speichern Sie Asset, Zeitraum, Entscheidung, Niveaus und Datenqualität mit Datum.", nl: "Bewaar een gedateerd overzicht van actief, periode, beslissing, niveaus en datakwaliteit." } },
  { selector: "[data-guide='alerts']", view: "Alertes", title: { fr: "Alertes de prix", en: "Price alerts", de: "Preisalarm", nl: "Prijswaarschuwingen" }, text: { fr: "Définissez les niveaux importants à surveiller pour l’actif sélectionné.", en: "Set important levels to monitor for the selected asset.", de: "Legen Sie wichtige zu überwachende Niveaus für das ausgewählte Asset fest.", nl: "Stel belangrijke niveaus in om voor het geselecteerde actief te volgen." } },
  { selector: "[data-guide='news']", view: "Actualités", title: { fr: "Actualités associées", en: "Related news", de: "Zugeordnete Nachrichten", nl: "Gerelateerd nieuws" }, text: { fr: "Les nouvelles sont rattachées aux actifs. Ouvrez une notification pour consulter le rapport et sa source complète.", en: "News is linked to assets. Open a notification to view the report and full source.", de: "Nachrichten sind Assets zugeordnet. Öffnen Sie eine Meldung für Bericht und vollständige Quelle.", nl: "Nieuws is aan activa gekoppeld. Open een melding voor het rapport en de volledige bron." } },
  { selector: "[data-guide='journal']", view: "Journal", title: { fr: "Journal de décisions", en: "Decision journal", de: "Entscheidungsjournal", nl: "Beslissingsjournal" }, text: { fr: "Notez votre raisonnement avant toute action afin de suivre votre discipline et vos erreurs.", en: "Record your reasoning before acting to track discipline and mistakes.", de: "Notieren Sie Ihre Begründung vor jeder Aktion, um Disziplin und Fehler zu verfolgen.", nl: "Noteer uw redenering vóór actie om discipline en fouten te volgen." } },
  { selector: "[data-guide='settings']", view: "Paramètres", title: { fr: "Profil et préférences", en: "Profile and preferences", de: "Profil und Einstellungen", nl: "Profiel en voorkeuren" }, text: { fr: "Adaptez le profil, le capital pédagogique et les limites de risque. Aucun ordre réel n’est exécuté.", en: "Adjust profile, educational capital and risk limits. No real order is executed.", de: "Passen Sie Profil, Lernkapital und Risikolimits an. Es wird keine reale Order ausgeführt.", nl: "Pas profiel, educatief kapitaal en risicolimieten aan. Er wordt geen echte order uitgevoerd." } },
  { selector: "[data-guide='guide-launcher']", title: { fr: "Guide toujours disponible", en: "Guide always available", de: "Anleitung immer verfügbar", nl: "Gids altijd beschikbaar" }, text: { fr: "Relancez cette visite à tout moment avec ce bouton. Vous pouvez fermer le guide sans modifier vos données.", en: "Restart this tour anytime with this button. Closing the guide never changes your data.", de: "Starten Sie die Tour jederzeit mit diesem Button neu. Das Schließen ändert keine Daten.", nl: "Start deze rondleiding altijd opnieuw met deze knop. Sluiten wijzigt uw gegevens niet." } },
];

export function InteractiveGuide({ language, onNavigate }: { language: Lang; onNavigate: (view: string) => void }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[index];
  const progress = useMemo(() => Math.round(((index + 1) / steps.length) * 100), [index]);

  const launch = () => { setIndex(0); setOpen(true); };
  const close = () => { setOpen(false); localStorage.setItem("cockpit-guide-seen", "1"); };

  useEffect(() => {
    if (!localStorage.getItem("cockpit-guide-seen")) {
      const timer = window.setTimeout(launch, 1400);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (step.view) onNavigate(step.view);
    const updateRect = () => {
      const element = document.querySelector(step.selector);
      setRect(element ? element.getBoundingClientRect() : null);
    };
    const reveal = () => {
      const element = document.querySelector(step.selector);
      if (!element) return setRect(null);
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(updateRect, 350);
    };
    const timer = window.setTimeout(reveal, step.view ? 180 : 30);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, { capture: true, passive: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("resize", updateRect); window.removeEventListener("scroll", updateRect, true); };
  }, [open, index, step, onNavigate]);

  const cardStyle = rect ? {
    left: Math.max(14, Math.min(window.innerWidth - 374, rect.left + rect.width / 2 - 180)),
    top: rect.bottom + 14 + 250 < window.innerHeight ? rect.bottom + 14 : Math.max(14, rect.top - 244),
  } : undefined;

  return <>
    <button data-guide="guide-launcher" className="guideLauncher" onClick={launch} aria-label={copy.guide[language]}><BookOpen /><span>{copy.guide[language]}</span></button>
    {open && <div className="guideLayer" role="dialog" aria-modal="true" aria-label={copy.guide[language]}>
      {rect && <div className="guideSpotlight" style={{ left: rect.left - 6, top: rect.top - 6, width: rect.width + 12, height: rect.height + 12 }} />}
      <div className="guideCard" style={cardStyle}>
        <div className="guideCardHead"><span><BookOpen /><b>{copy.guide[language]}</b></span><button onClick={close} aria-label={copy.close[language]}><X /></button></div>
        <div className="guideProgress"><i style={{ width: `${progress}%` }} /></div>
        <small>{index + 1} / {steps.length}</small>
        <h2>{step.title[language]}</h2><p>{step.text[language]}</p>
        <div className="guideActions"><button disabled={index === 0} onClick={() => setIndex((v) => v - 1)}><ArrowLeft />{copy.previous[language]}</button><button className="primary" onClick={() => index === steps.length - 1 ? close() : setIndex((v) => v + 1)}>{index === steps.length - 1 ? <><Check />{copy.finish[language]}</> : <>{copy.next[language]}<ArrowRight /></>}</button></div>
      </div>
    </div>}
  </>;
}
