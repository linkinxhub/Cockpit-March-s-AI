import type { Lang } from "./i18n";

type ValueCopy = {
  eyebrow: string; title: string; intro: string;
  routines: readonly { need: string; title: string; text: string; access: string }[];
  trace: string; traceDetail: string;
  aiEyebrow: string; aiTitle: string; aiText: string;
  planHeading: string; plan: string; use: string; allowance: string;
  plans: readonly { name: string; use: string }[];
  quotaNote: string; start: string; compare: string;
  faq: readonly (readonly [string, string])[];
};

export const discoveryValueCopy: Record<Lang, ValueCopy> = {
  fr: {
    eyebrow: "03 / UNE ROUTINE QUI VOUS RESSEMBLE",
    title: "Un signal à comprendre. Un raisonnement à retrouver.",
    intro: "Choisissez votre point de départ. Le fil d’analyse relie les explications, les horizons et les outils de suivi autour de l’actif sélectionné.",
    routines: [
      { need: "Je veux comprendre ce que je vois", title: "Comprendre", text: "Lisez les facteurs observés et les limites. Retrouvez les définitions de support, résistance et invalidation, ainsi que la source et l’heure des données lorsqu’elles sont disponibles.", access: "Dès Découverte · IA selon votre quota" },
      { need: "Deux périodes me disent des choses différentes", title: "Comparer", text: "Mettez le court terme en regard de la tendance de fond. Le parcours explique les accords et les divergences entre les horizons disponibles pour vous aider à examiner un signal dans son contexte.", access: "Comparaison multi-horizon · Pro et Expert" },
      { need: "Je veux savoir pourquoi ma lecture a changé", title: "Suivre", text: "Avec Expert, enregistrez un passeport, puis comparez une nouvelle lecture avec la dernière sauvegarde compatible. Vous pouvez relire l’explication conservée et préparer votre réflexion dans le journal.", access: "Passeports et journal · inclus dans Expert" },
    ],
    trace: "Des repères pour relire votre analyse",
    traceDetail: "La comparaison des passeports porte sur le même actif, la même période et le même moteur d’analyse. Les anciens passeports restent consultables ; ceux sans contexte suffisant ne servent pas à cette comparaison. Une variation de cours observée n’est pas le résultat d’une transaction.",
    aiEyebrow: "L’IA, SANS CONFIGURATION TECHNIQUE",
    aiTitle: "Votre pack inclut vos analyses IA.",
    aiText: "Vous n’avez aucune clé OpenAI à acheter ni à saisir et aucun abonnement ChatGPT payant à prendre pour utiliser l’IA de Cockpit. Connectez-vous à votre compte Cockpit et utilisez le quota de votre formule, sous réserve de disponibilité du service.",
    planHeading: "Quel pack pour votre usage ?", plan: "Pack", use: "Votre usage", allowance: "Analyses IA / mois",
    plans: [
      { name: "Découverte", use: "Prendre vos repères et essayer l’analyse IA." },
      { name: "Pro", use: "Comparer les horizons, approfondir les indicateurs et créer des alertes." },
      { name: "Expert / Trader+", use: "Conserver vos lectures dans les passeports et disposer d’un quota plus large." },
    ],
    quotaNote: "Le compteur de votre compte indique la consommation. Le quota se renouvelle le premier du mois (UTC), sans report. Aucun dépassement n’est facturé automatiquement. Les tarifs et les conditions de paiement figurent dans les offres ci-dessous.",
    start: "Explorer avec Découverte", compare: "Voir les offres et les tarifs",
    faq: [
      ["Que m’apporte Cockpit par rapport à une conversation avec une IA ?", "Cockpit rassemble le graphique, les indicateurs, la période sélectionnée et les explications dans un même parcours. Selon votre pack, vous pouvez comparer les horizons et enregistrer une lecture pour la retrouver ensuite. Cette organisation facilite votre travail d’analyse ; elle ne garantit pas une meilleure prédiction."],
      ["Dois-je fournir ma propre clé OpenAI ?", "Non. L’accès à l’IA est géré par Cockpit et compris dans le quota de votre pack. Vous n’avez pas de configuration OpenAI à effectuer. Un abonnement ChatGPT payant n’augmente pas votre quota Cockpit."],
      ["Que se passe-t-il quand mon quota IA est épuisé ?", "Les nouvelles analyses IA attendent le renouvellement de votre quota, ou un changement vers une formule avec un plafond supérieur. Un changement de pack ne remet pas la consommation à zéro. Les autres fonctions restent soumises aux accès de votre pack."],
      ["Un score de confiance de 80 % signifie-t-il 80 % de chances de gagner ?", "Non. Le score décrit la lecture du moteur selon les éléments analysés. Ce n’est ni une probabilité de gain validée, ni une promesse de rendement. Examinez les limites, les données disponibles et les éléments qui contredisent le scénario."],
      ["Comment signaler une explication peu claire ou une fonction manquante ?", "Utilisez Feedback dans la plateforme pour décrire votre besoin. Vous pouvez joindre une capture d’écran. Indiquez ce que vous cherchiez à comprendre et l’étape où vous avez rencontré une difficulté ; ces retours aident à choisir les améliorations utiles."],
    ],
  },
  en: {
    eyebrow: "03 / A ROUTINE THAT FITS YOU",
    title: "A signal to understand. A line of reasoning to revisit.",
    intro: "Choose your starting point. The analysis path connects explanations, timeframes and follow-up tools around your selected asset.",
    routines: [
      { need: "I want to understand what I am seeing", title: "Understand", text: "Read the observed factors and limitations. Find definitions of support, resistance and invalidation, along with the data source and timestamp when available.", access: "From Discovery · AI within your allowance" },
      { need: "Two timeframes tell me different things", title: "Compare", text: "Put short-term movement alongside the broader trend. The path explains agreement and divergence between available timeframes to help you examine a signal in context.", access: "Multi-timeframe comparison · Pro and Expert" },
      { need: "I want to know why my reading has changed", title: "Follow", text: "With Expert, save a passport, then compare a new reading with the latest compatible snapshot. Revisit the saved explanation and prepare your own reasoning in the journal.", access: "Passports and journal · included in Expert" },
    ],
    trace: "Reference points for revisiting your analysis",
    traceDetail: "Passport comparison uses the same asset, timeframe and analysis engine. Older passports remain available; those without enough context are excluded from this comparison. An observed price change is not a transaction result.",
    aiEyebrow: "AI WITHOUT TECHNICAL SETUP",
    aiTitle: "Your plan includes your AI analyses.",
    aiText: "You do not need to buy or enter an OpenAI key, or take out a paid ChatGPT subscription to use Cockpit AI. Sign in to your Cockpit account and use your plan’s allowance, subject to service availability.",
    planHeading: "Which plan fits your use?", plan: "Plan", use: "Your use", allowance: "AI analyses / month",
    plans: [
      { name: "Discovery", use: "Find your bearings and try AI analysis." },
      { name: "Pro", use: "Compare timeframes, explore indicators and create alerts." },
      { name: "Expert / Trader+", use: "Keep readings in passports and use a larger allowance." },
    ],
    quotaNote: "Your account counter shows usage. Allowances renew on the first of each month (UTC), without rollover. No automatic overage charges. Prices and payment conditions appear in the offers below.",
    start: "Explore with Discovery", compare: "View plans and prices",
    faq: [
      ["What does Cockpit add to a conversation with an AI?", "Cockpit brings the chart, indicators, selected timeframe and explanations into one workflow. Depending on your plan, you can compare timeframes and save a reading to revisit later. This organisation supports your analysis; it does not guarantee a better prediction."],
      ["Do I need my own OpenAI key?", "No. Cockpit manages AI access within your plan’s allowance. You do not need to configure OpenAI. A paid ChatGPT subscription does not increase your Cockpit allowance."],
      ["What happens when my AI allowance runs out?", "New AI analyses wait until your allowance renews, or until you move to a plan with a higher limit. Changing plans does not reset usage. Other features remain subject to your plan’s access rights."],
      ["Does an 80% confidence score mean an 80% chance of profit?", "No. The score describes the engine’s reading of the analysed information. It is neither a validated probability of profit nor a return promise. Examine the limitations, available data and factors that contradict the scenario."],
      ["How can I report an unclear explanation or a missing feature?", "Use Feedback in the platform to describe your need. You can attach a screenshot. Explain what you were trying to understand and where you encountered difficulty; this helps identify useful improvements."],
    ],
  },
  de: {
    eyebrow: "03 / EINE ROUTINE, DIE ZU IHNEN PASST",
    title: "Ein Signal verstehen. Die Überlegungen später nachvollziehen.",
    intro: "Wählen Sie Ihren Einstieg. Der Analyseweg verbindet Erklärungen, Zeithorizonte und Werkzeuge zur weiteren Beobachtung rund um das gewählte Asset.",
    routines: [
      { need: "Ich möchte verstehen, was ich sehe", title: "Verstehen", text: "Lesen Sie die beobachteten Faktoren und Grenzen. Finden Sie Definitionen zu Unterstützung, Widerstand und Ungültigkeitsbedingungen sowie Datenquelle und Zeitstempel, sofern verfügbar.", access: "Ab Entdecken · KI im Rahmen Ihres Kontingents" },
      { need: "Zwei Zeiträume zeigen unterschiedliche Signale", title: "Vergleichen", text: "Betrachten Sie kurzfristige Bewegungen zusammen mit dem übergeordneten Trend. Der Analyseweg erklärt Übereinstimmungen und Abweichungen zwischen verfügbaren Zeithorizonten.", access: "Vergleich mehrerer Zeithorizonte · Pro und Expert" },
      { need: "Ich möchte wissen, warum sich meine Einschätzung geändert hat", title: "Weiterverfolgen", text: "Speichern Sie mit Expert einen Entscheidungspass und vergleichen Sie eine neue Einschätzung mit der letzten passenden Aufnahme. Lesen Sie die gespeicherte Erklärung erneut und halten Sie eigene Überlegungen im Journal fest.", access: "Entscheidungspässe und Journal · in Expert enthalten" },
    ],
    trace: "Orientierung für die spätere Prüfung Ihrer Analyse",
    traceDetail: "Der Passvergleich verwendet dasselbe Asset, denselben Zeitraum und dieselbe Analyse-Engine. Ältere Pässe bleiben einsehbar; ohne ausreichenden Kontext werden sie nicht verglichen. Eine beobachtete Kursänderung ist kein Transaktionsergebnis.",
    aiEyebrow: "KI OHNE TECHNISCHE EINRICHTUNG",
    aiTitle: "Ihre KI-Analysen sind im Tarif enthalten.",
    aiText: "Sie müssen keinen OpenAI-Schlüssel kaufen oder eingeben und kein kostenpflichtiges ChatGPT-Abo abschließen, um Cockpit-KI zu nutzen. Melden Sie sich bei Cockpit an und nutzen Sie Ihr Tarifkontingent, vorbehaltlich der Verfügbarkeit des Dienstes.",
    planHeading: "Welcher Tarif passt zu Ihrer Nutzung?", plan: "Tarif", use: "Ihre Nutzung", allowance: "KI-Analysen / Monat",
    plans: [
      { name: "Entdecken", use: "Sich orientieren und die KI-Analyse ausprobieren." },
      { name: "Pro", use: "Zeithorizonte vergleichen, Indikatoren vertiefen und Alarme erstellen." },
      { name: "Expert / Trader+", use: "Einschätzungen in Pässen speichern und ein größeres Kontingent nutzen." },
    ],
    quotaNote: "Der Zähler im Konto zeigt den Verbrauch. Erneuerung am Monatsersten (UTC), ohne Übertrag. Keine automatischen Mehrkosten bei Überschreitung. Preise und Zahlungsbedingungen stehen in den Angeboten unten.",
    start: "Mit Entdecken starten", compare: "Tarife und Preise ansehen",
    faq: [
      ["Was bietet Cockpit zusätzlich zu einem Gespräch mit einer KI?", "Cockpit vereint Chart, Indikatoren, gewählten Zeitraum und Erklärungen in einem Ablauf. Je nach Tarif können Sie Zeithorizonte vergleichen und Einschätzungen speichern. Diese Organisation unterstützt Ihre Analyse; sie garantiert keine bessere Prognose."],
      ["Brauche ich einen eigenen OpenAI-Schlüssel?", "Nein. Cockpit verwaltet den KI-Zugang innerhalb Ihres Tarifkontingents. Sie müssen OpenAI nicht einrichten. Ein kostenpflichtiges ChatGPT-Abo erhöht Ihr Cockpit-Kontingent nicht."],
      ["Was passiert, wenn mein KI-Kontingent aufgebraucht ist?", "Neue KI-Analysen warten bis zur Erneuerung oder zum Wechsel in einen Tarif mit höherem Limit. Ein Tarifwechsel setzt den Verbrauch nicht zurück. Andere Funktionen bleiben von Ihren Tarifrechten abhängig."],
      ["Bedeutet ein Konfidenzwert von 80 % eine Gewinnchance von 80 %?", "Nein. Der Wert beschreibt die Einschätzung der Engine anhand der analysierten Informationen. Er ist weder eine validierte Gewinnwahrscheinlichkeit noch ein Renditeversprechen. Prüfen Sie Grenzen, verfügbare Daten und widersprechende Faktoren."],
      ["Wie melde ich eine unklare Erklärung oder eine fehlende Funktion?", "Beschreiben Sie Ihren Bedarf über Feedback in der Plattform und fügen Sie bei Bedarf einen Screenshot hinzu. Erläutern Sie, was Sie verstehen wollten und wo Schwierigkeiten auftraten. Das hilft bei der Auswahl sinnvoller Verbesserungen."],
    ],
  },
  nl: {
    eyebrow: "03 / EEN ROUTINE DIE BIJ U PAST",
    title: "Een signaal begrijpen. Uw redenering later terugvinden.",
    intro: "Kies uw startpunt. Het analysepad verbindt uitleg, tijdshorizons en hulpmiddelen voor opvolging rond het gekozen activum.",
    routines: [
      { need: "Ik wil begrijpen wat ik zie", title: "Begrijpen", text: "Lees de waargenomen factoren en beperkingen. Vind definities van steun, weerstand en ongeldigheidsvoorwaarden, samen met de databron en het tijdstip wanneer beschikbaar.", access: "Vanaf Ontdekking · AI binnen uw tegoed" },
      { need: "Twee periodes geven verschillende signalen", title: "Vergelijken", text: "Plaats de kortetermijnbeweging naast de bredere trend. Het analysepad legt overeenkomsten en verschillen tussen beschikbare tijdshorizons uit om een signaal in context te bekijken.", access: "Vergelijking van tijdshorizons · Pro en Expert" },
      { need: "Ik wil weten waarom mijn lezing is veranderd", title: "Opvolgen", text: "Sla met Expert een paspoort op en vergelijk een nieuwe lezing met de laatste passende opname. Lees de bewaarde uitleg terug en bereid uw eigen redenering voor in het journaal.", access: "Paspoorten en journaal · inbegrepen in Expert" },
    ],
    trace: "Houvast om uw analyse opnieuw te bekijken",
    traceDetail: "De paspoortvergelijking gebruikt hetzelfde activum, dezelfde periode en dezelfde analyse-engine. Oudere paspoorten blijven raadpleegbaar; zonder voldoende context worden ze niet vergeleken. Een waargenomen koersverandering is geen transactieresultaat.",
    aiEyebrow: "AI ZONDER TECHNISCHE INSTELLINGEN",
    aiTitle: "Uw pakket omvat uw AI-analyses.",
    aiText: "U hoeft geen OpenAI-sleutel te kopen of in te voeren en geen betaald ChatGPT-abonnement te nemen om Cockpit-AI te gebruiken. Meld u aan bij Cockpit en gebruik het tegoed van uw pakket, afhankelijk van de beschikbaarheid van de dienst.",
    planHeading: "Welk pakket past bij uw gebruik?", plan: "Pakket", use: "Uw gebruik", allowance: "AI-analyses / maand",
    plans: [
      { name: "Ontdekking", use: "Uw weg vinden en AI-analyse uitproberen." },
      { name: "Pro", use: "Tijdshorizons vergelijken, indicatoren verkennen en waarschuwingen maken." },
      { name: "Expert / Trader+", use: "Lezingen bewaren in paspoorten en een groter tegoed gebruiken." },
    ],
    quotaNote: "De teller in uw account toont het verbruik. Vernieuwing op de eerste van de maand (UTC), zonder overdracht. Geen automatische extra kosten bij overschrijding. Prijzen en betalingsvoorwaarden staan in de aanbiedingen hieronder.",
    start: "Verkennen met Ontdekking", compare: "Pakketten en prijzen bekijken",
    faq: [
      ["Wat voegt Cockpit toe aan een gesprek met een AI?", "Cockpit brengt de grafiek, indicatoren, gekozen periode en uitleg samen in één werkwijze. Afhankelijk van uw pakket kunt u tijdshorizons vergelijken en een lezing opslaan voor later. Deze organisatie ondersteunt uw analyse; ze garandeert geen betere voorspelling."],
      ["Heb ik mijn eigen OpenAI-sleutel nodig?", "Nee. Cockpit beheert de AI-toegang binnen het tegoed van uw pakket. U hoeft OpenAI niet in te stellen. Een betaald ChatGPT-abonnement verhoogt uw Cockpit-tegoed niet."],
      ["Wat gebeurt er als mijn AI-tegoed op is?", "Nieuwe AI-analyses wachten tot uw tegoed vernieuwt of u overstapt naar een pakket met een hogere limiet. Een pakketwijziging zet het verbruik niet op nul. Andere functies blijven afhankelijk van uw pakketrechten."],
      ["Betekent een vertrouwensscore van 80% een winstkans van 80%?", "Nee. De score beschrijft de lezing van de engine op basis van de geanalyseerde informatie. Het is geen gevalideerde winstkans of rendementsbelofte. Bekijk de beperkingen, beschikbare gegevens en factoren die het scenario tegenspreken."],
      ["Hoe meld ik onduidelijke uitleg of een ontbrekende functie?", "Beschrijf uw behoefte via Feedback in de platform en voeg eventueel een schermafbeelding toe. Geef aan wat u wilde begrijpen en waar u vastliep; dit helpt nuttige verbeteringen te kiezen."],
    ],
  },
};
