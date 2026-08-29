export type Lang = "fr" | "en" | "de" | "nl";
const words: Record<string, [string, string, string]> = {
  Cockpit: ["Dashboard", "Cockpit", "Cockpit"],
  Opportunités: ["Opportunities", "Chancen", "Kansen"],
  Favoris: ["Favorites", "Favoriten", "Favorieten"],
  Marchés: ["Markets", "Märkte", "Markten"],
  "Scanner IA": ["AI Scanner", "KI-Scanner", "AI-scanner"],
  Alertes: ["Alerts", "Alarme", "Waarschuwingen"],
  Actualités: ["News", "Nachrichten", "Nieuws"],
  Journal: ["Journal", "Journal", "Dagboek"],
  Paramètres: ["Settings", "Einstellungen", "Instellingen"],
  "Rechercher un actif…": [
    "Search an asset…",
    "Asset suchen…",
    "Zoek een actief…",
  ],
  "Analyse des marchés…": [
    "Analyzing markets…",
    "Märkte werden analysiert…",
    "Markten analyseren…",
  ],
  "Marchés actualisés": [
    "Markets updated",
    "Märkte aktualisiert",
    "Markten bijgewerkt",
  ],
  "Panorama mondial": [
    "Global overview",
    "Globale Übersicht",
    "Wereldwijd overzicht",
  ],
  "actifs surveillés": [
    "assets monitored",
    "Assets überwacht",
    "activa gevolgd",
  ],
  "Tous les marchés": ["All markets", "Alle Märkte", "Alle markten"],
  disponibles: ["available", "verfügbar", "beschikbaar"],
  Cryptomonnaies: ["Cryptocurrencies", "Kryptowährungen", "Cryptovaluta"],
  "Indices mondiaux": [
    "Global indices",
    "Globale Indizes",
    "Wereldwijde indexen",
  ],
  "Mood du marché": ["Market mood", "Marktstimmung", "Marktsentiment"],
  "Sentiment technique calculé en direct": [
    "Live technical sentiment",
    "Technische Stimmung in Echtzeit",
    "Live technisch sentiment",
  ],
  "Très optimiste": [
    "Very optimistic",
    "Sehr optimistisch",
    "Zeer optimistisch",
  ],
  Optimiste: ["Optimistic", "Optimistisch", "Optimistisch"],
  Neutre: ["Neutral", "Neutral", "Neutraal"],
  Prudent: ["Cautious", "Vorsichtig", "Voorzichtig"],
  Baissier: ["Bearish", "Bärisch", "Bearish"],
  Indisponible: ["Unavailable", "Nicht verfügbar", "Niet beschikbaar"],
  "Large dynamique positive": [
    "Broad positive momentum",
    "Breite positive Dynamik",
    "Brede positieve dynamiek",
  ],
  "Acheteurs légèrement dominants": [
    "Buyers slightly dominant",
    "Käufer leicht dominant",
    "Kopers licht dominant",
  ],
  "Marché partagé ou en attente": [
    "Mixed or waiting market",
    "Gemischter oder abwartender Markt",
    "Verdeelde of afwachtende markt",
  ],
  "Pression vendeuse modérée": [
    "Moderate selling pressure",
    "Mäßiger Verkaufsdruck",
    "Matige verkoopdruk",
  ],
  "Vendeurs dominants": [
    "Sellers dominant",
    "Verkäufer dominant",
    "Verkopers dominant",
  ],
  "Données insuffisantes": [
    "Insufficient data",
    "Unzureichende Daten",
    "Onvoldoende gegevens",
  ],
  "données en attente": [
    "data pending",
    "Daten ausstehend",
    "gegevens in afwachting",
  ],
  "scanner actualisé": [
    "scanner updated",
    "Scanner aktualisiert",
    "scanner bijgewerkt",
  ],
  "Historique réel · EMA 20": [
    "Real history · EMA 20",
    "Realer Verlauf · EMA 20",
    "Reële geschiedenis · EMA 20",
  ],
  "Historique temporairement indisponible": [
    "History temporarily unavailable",
    "Verlauf vorübergehend nicht verfügbar",
    "Geschiedenis tijdelijk niet beschikbaar",
  ],
  "Chargement de la période…": [
    "Loading timeframe…",
    "Zeitraum wird geladen…",
    "Periode laden…",
  ],
  "Historique indisponible pour cette période": [
    "History unavailable for this timeframe",
    "Verlauf für diesen Zeitraum nicht verfügbar",
    "Geschiedenis niet beschikbaar voor deze periode",
  ],
  "15 min": ["15 min", "15 Min.", "15 min"],
  "30 min": ["30 min", "30 Min.", "30 min"],
  "45 min": ["45 min", "45 Min.", "45 min"],
  "1 h": ["1 hr", "1 Std.", "1 u"],
  "4 h": ["4 hrs", "4 Std.", "4 u"],
  "1 j": ["1 day", "1 Tag", "1 dag"],
  "1 sem.": ["1 week", "1 Woche", "1 week"],
  "1 mois": ["1 month", "1 Monat", "1 maand"],
  "6 mois": ["6 months", "6 Monate", "6 maanden"],
  "1 an": ["1 year", "1 Jahr", "1 jaar"],
  "Synthèse multi-périodes": [
    "Multi-timeframe summary",
    "Multi-Zeitrahmen-Übersicht",
    "Samenvatting van meerdere periodes",
  ],
  "Cliquez sur une période pour recalculer tout le cockpit et l’analyse IA": [
    "Click a timeframe to recalculate the entire dashboard and AI analysis",
    "Klicken Sie auf einen Zeitraum, um das gesamte Cockpit und die KI-Analyse neu zu berechnen",
    "Klik op een periode om het volledige dashboard en de AI-analyse opnieuw te berekenen",
  ],
  "Analyser cette période": [
    "Analyze this timeframe",
    "Diesen Zeitraum analysieren",
    "Deze periode analyseren",
  ],
  "Cliquer pour ouvrir l’horizon le plus fiable": [
    "Click to open the most reliable timeframe",
    "Klicken, um den zuverlässigsten Zeitraum zu öffnen",
    "Klik om de betrouwbaarste periode te openen",
  ],
  "Voir les actifs disponibles": [
    "View available assets",
    "Verfügbare Assets anzeigen",
    "Beschikbare activa bekijken",
  ],
  "cliquer pour comprendre": [
    "click to understand",
    "Klicken zum Verstehen",
    "klik voor uitleg",
  ],
  "Décision IA globale": [
    "Global AI decision",
    "Globale KI-Entscheidung",
    "Algemene AI-beslissing",
  ],
  Confiance: ["Confidence", "Vertrauen", "Vertrouwen"],
  "Lecture technique": [
    "Technical reading",
    "Technische Analyse",
    "Technische lezing",
  ],
  Risque: ["Risk", "Risiko", "Risico"],
  Tendance: ["Trend", "Trend", "Trend"],
  Haussière: ["Bullish", "Aufwärts", "Stijgend"],
  Baissière: ["Bearish", "Abwärts", "Dalend"],
  "Momentum RSI": ["RSI momentum", "RSI-Momentum", "RSI-momentum"],
  Volatilité: ["Volatility", "Volatilität", "Volatiliteit"],
  Niveaux: ["Levels", "Niveaus", "Niveaus"],
  "Support / résistance": [
    "Support / resistance",
    "Unterstützung / Widerstand",
    "Steun / weerstand",
  ],
  ACHETER: ["BUY", "KAUFEN", "KOPEN"],
  VENDRE: ["SELL", "VERKAUFEN", "VERKOPEN"],
  ATTENDRE: ["WAIT", "WARTEN", "WACHTEN"],
  INDISPONIBLE: ["UNAVAILABLE", "NICHT VERFÜGBAR", "NIET BESCHIKBAAR"],
  "CENTRE DE DÉCISION": [
    "DECISION CENTER",
    "ENTSCHEIDUNGSZENTRUM",
    "BESLISSINGSCENTRUM",
  ],
  "Plan de lecture avant positionnement": [
    "Review plan before positioning",
    "Prüfplan vor der Positionierung",
    "Controleplan vóór positionering",
  ],
  "Ajouter aux favoris": [
    "Add to favorites",
    "Zu Favoriten hinzufügen",
    "Toevoegen aan favorieten",
  ],
  "Dans mes favoris": [
    "In my favorites",
    "In meinen Favoriten",
    "In mijn favorieten",
  ],
  "État global des actifs disponibles": [
    "Overall state of available assets",
    "Gesamtzustand verfügbarer Assets",
    "Algemene status van beschikbare activa",
  ],
  "Orientation positive": [
    "Positive orientation",
    "Positive Ausrichtung",
    "Positieve richting",
  ],
  "Orientation négative": [
    "Negative orientation",
    "Negative Ausrichtung",
    "Negatieve richting",
  ],
  "Marché partagé": ["Mixed market", "Gemischter Markt", "Verdeelde markt"],
  "Zone d’observation": [
    "Observation zone",
    "Beobachtungszone",
    "Observatiezone",
  ],
  "Cours actuel, pas un ordre d’entrée": [
    "Current price, not an entry order",
    "Aktueller Kurs, kein Einstiegsauftrag",
    "Huidige koers, geen instaporder",
  ],
  "Invalidation technique": [
    "Technical invalidation",
    "Technische Ungültigkeit",
    "Technische invalidatie",
  ],
  "Objectif technique": [
    "Technical target",
    "Technisches Ziel",
    "Technisch doel",
  ],
  "Rendement / risque": [
    "Reward / risk",
    "Rendite / Risiko",
    "Rendement / risico",
  ],
  "Checklist de validation": [
    "Validation checklist",
    "Validierungscheckliste",
    "Validatiechecklist",
  ],
  "Lecture finale": [
    "Final reading",
    "Abschließende Einschätzung",
    "Eindbeoordeling",
  ],
  "Créer une alerte": [
    "Create an alert",
    "Alarm erstellen",
    "Waarschuwing maken",
  ],
  "Préparer le journal": [
    "Prepare journal",
    "Journal vorbereiten",
    "Dagboek voorbereiden",
  ],
  "EXPLICATION EXHAUSTIVE DU MARCHÉ": [
    "COMPREHENSIVE MARKET EXPLANATION",
    "AUSFÜHRLICHE MARKTERKLÄRUNG",
    "UITGEBREIDE MARKTUITLEG",
  ],
  "Pourquoi le cockpit indique": [
    "Why the dashboard indicates",
    "Warum das Cockpit anzeigt",
    "Waarom het cockpit aangeeft",
  ],
  "Structure de tendance": [
    "Trend structure",
    "Trendstruktur",
    "Trendstructuur",
  ],
  "Volatilité et risque": [
    "Volatility and risk",
    "Volatilität und Risiko",
    "Volatiliteit en risico",
  ],
  "Niveaux déterminants": [
    "Key levels",
    "Entscheidende Niveaus",
    "Bepalende niveaus",
  ],
  "Scénario de confirmation": [
    "Confirmation scenario",
    "Bestätigungsszenario",
    "Bevestigingsscenario",
  ],
  "Ce qui invaliderait la lecture": [
    "What would invalidate the reading",
    "Was die Analyse entkräften würde",
    "Wat de analyse ongeldig maakt",
  ],
  "Prudence recommandée": [
    "Recommended caution",
    "Empfohlene Vorsicht",
    "Aanbevolen voorzichtigheid",
  ],
  "Actualités liées à": ["News related to", "Nachrichten zu", "Nieuws over"],
  "Voir toutes": ["View all", "Alle anzeigen", "Alles bekijken"],
  "Scanner IA global": [
    "Global AI scanner",
    "Globaler KI-Scanner",
    "Algemene AI-scanner",
  ],
  Actualiser: ["Refresh", "Aktualisieren", "Vernieuwen"],
  "RADAR D’OPPORTUNITÉS": ["OPPORTUNITY RADAR", "CHANCENRADAR", "KANSENRADAR"],
  "Configurations les plus intéressantes actuellement": [
    "Most interesting setups now",
    "Derzeit interessanteste Setups",
    "Interessantste setups van dit moment",
  ],
  "Recalculer le radar": [
    "Recalculate radar",
    "Radar neu berechnen",
    "Radar herberekenen",
  ],
  "Configurations exploitables": [
    "Actionable setups",
    "Nutzbare Setups",
    "Bruikbare setups",
  ],
  "Meilleur score": ["Best score", "Bester Score", "Beste score"],
  "Direction dominante": [
    "Dominant direction",
    "Dominierende Richtung",
    "Dominante richting",
  ],
  "Filtre actif": ["Active filter", "Aktiver Filter", "Actief filter"],
  Forte: ["Strong", "Stark", "Sterk"],
  Confirmée: ["Confirmed", "Bestätigt", "Bevestigd"],
  "À surveiller": ["Watch", "Beobachten", "Volgen"],
  Faible: ["Weak", "Schwach", "Zwak"],
  Observation: ["Observation", "Beobachtung", "Observatie"],
  Invalidation: ["Invalidation", "Ungültigkeit", "Invalidatie"],
  Objectif: ["Target", "Ziel", "Doel"],
  "Arguments favorables": [
    "Supporting factors",
    "Positive Faktoren",
    "Positieve factoren",
  ],
  "Point de vigilance": ["Watch point", "Risikopunkt", "Aandachtspunt"],
  "Voir l’analyse complète": [
    "View full analysis",
    "Vollständige Analyse",
    "Volledige analyse bekijken",
  ],
  Suivre: ["Follow", "Beobachten", "Volgen"],
  "MA LISTE DE SURVEILLANCE": [
    "MY WATCHLIST",
    "MEINE WATCHLIST",
    "MIJN VOLGLIJST",
  ],
  "Favoris et opportunités suivies": [
    "Favorites and tracked opportunities",
    "Favoriten und beobachtete Chancen",
    "Favorieten en gevolgde kansen",
  ],
  "Actifs favoris": [
    "Favorite assets",
    "Favorisierte Assets",
    "Favoriete activa",
  ],
  "Signaux actifs": ["Active signals", "Aktive Signale", "Actieve signalen"],
  "Actualités associées": [
    "Related news",
    "Zugehörige Nachrichten",
    "Gerelateerd nieuws",
  ],
  "État global": ["Overall state", "Gesamtzustand", "Algemene status"],
  "Aucun favori pour le moment": [
    "No favorites yet",
    "Noch keine Favoriten",
    "Nog geen favorieten",
  ],
  "Explorer les marchés": [
    "Explore markets",
    "Märkte erkunden",
    "Markten verkennen",
  ],
  MARCHÉS: ["MARKETS", "MÄRKTE", "MARKTEN"],
  "Vue globale des actifs": [
    "Global asset overview",
    "Globale Asset-Übersicht",
    "Wereldwijd activaoverzicht",
  ],
  Actif: ["Asset", "Asset", "Actief"],
  Classe: ["Class", "Klasse", "Categorie"],
  Prix: ["Price", "Preis", "Prijs"],
  Variation: ["Change", "Änderung", "Verandering"],
  Décision: ["Decision", "Entscheidung", "Beslissing"],
  "SCANNER IA": ["AI SCANNER", "KI-SCANNER", "AI-SCANNER"],
  "Décisions techniques": [
    "Technical decisions",
    "Technische Entscheidungen",
    "Technische beslissingen",
  ],
  "Lancer le scan": ["Run scan", "Scan starten", "Scan starten"],
  ALERTES: ["ALERTS", "ALARME", "WAARSCHUWINGEN"],
  "Surveillance des niveaux": [
    "Level monitoring",
    "Niveauüberwachung",
    "Niveaubewaking",
  ],
  "Actif sélectionné": [
    "Selected asset",
    "Ausgewähltes Asset",
    "Geselecteerd actief",
  ],
  "Prix cible": ["Target price", "Zielpreis", "Doelprijs"],
  "Alertes actives": [
    "Active alerts",
    "Aktive Alarme",
    "Actieve waarschuwingen",
  ],
  "Aucune alerte créée.": [
    "No alert created.",
    "Kein Alarm erstellt.",
    "Geen waarschuwing gemaakt.",
  ],
  "ACTUALITÉS DES MARCHÉS": ["MARKET NEWS", "MARKTNACHRICHTEN", "MARKTNIEUWS"],
  "News reliées aux actifs suivis": [
    "News linked to tracked assets",
    "Nachrichten zu beobachteten Assets",
    "Nieuws gekoppeld aan gevolgde activa",
  ],
  "Ouvrir le rapport": ["Open report", "Bericht öffnen", "Rapport openen"],
  "Aucune actualité n’est disponible pour le moment.": [
    "No news is available at the moment.",
    "Derzeit sind keine Nachrichten verfügbar.",
    "Er is momenteel geen nieuws beschikbaar.",
  ],
  JOURNAL: ["JOURNAL", "JOURNAL", "DAGBOEK"],
  "Journal de décisions": [
    "Decision journal",
    "Entscheidungsjournal",
    "Beslissingsdagboek",
  ],
  "Nouvelle note": ["New note", "Neue Notiz", "Nieuwe notitie"],
  "Enregistrer la note": ["Save note", "Notiz speichern", "Notitie opslaan"],
  Historique: ["History", "Verlauf", "Geschiedenis"],
  "Votre journal est vide.": [
    "Your journal is empty.",
    "Ihr Journal ist leer.",
    "Uw dagboek is leeg.",
  ],
  PARAMÈTRES: ["SETTINGS", "EINSTELLUNGEN", "INSTELLINGEN"],
  "Préférences du cockpit": [
    "Dashboard preferences",
    "Cockpit-Einstellungen",
    "Cockpitvoorkeuren",
  ],
  "Actualisation automatique": [
    "Automatic refresh",
    "Automatische Aktualisierung",
    "Automatisch vernieuwen",
  ],
  "Explications techniques": [
    "Technical explanations",
    "Technische Erklärungen",
    "Technische uitleg",
  ],
  "Fournisseurs de données": [
    "Data providers",
    "Datenanbieter",
    "Gegevensleveranciers",
  ],
  Connectés: ["Connected", "Verbunden", "Verbonden"],
  "Mode éducatif sécurisé": [
    "Safe educational mode",
    "Sicherer Lernmodus",
    "Veilige educatieve modus",
  ],
  "Toujours actif": ["Always active", "Immer aktiv", "Altijd actief"],
  "Analyse éducative": [
    "Educational analysis",
    "Lernanalyse",
    "Educatieve analyse",
  ],
  "Aucun ordre exécuté": [
    "No order executed",
    "Keine Order ausgeführt",
    "Geen order uitgevoerd",
  ],
  "Données fournisseurs en direct": [
    "Live provider data",
    "Live-Anbieterdaten",
    "Live leveranciersgegevens",
  ],
  "aucun rendement garanti": [
    "no guaranteed return",
    "keine garantierte Rendite",
    "geen gegarandeerd rendement",
  ],
  "Le fournisseur ne répond pas. Aucun signal n’est inventé.": [
    "The provider is not responding. No signal is fabricated.",
    "Der Anbieter antwortet nicht. Kein Signal wird erfunden.",
    "De leverancier reageert niet. Er wordt geen signaal verzonnen.",
  ],
  "La tendance et le momentum convergent. Une entrée fractionnée reste plus prudente.":
    [
      "Trend and momentum converge. A staggered entry remains more cautious.",
      "Trend und Momentum stimmen überein. Ein gestaffelter Einstieg bleibt vorsichtiger.",
      "Trend en momentum komen overeen. Een gespreide instap blijft voorzichtiger.",
    ],
  "La structure technique s’affaiblit. La protection du capital reste prioritaire.":
    [
      "The technical structure is weakening. Capital protection remains the priority.",
      "Die technische Struktur schwächt sich ab. Kapitalschutz bleibt vorrangig.",
      "De technische structuur verzwakt. Kapitaalbescherming blijft prioritair.",
    ],
  "Les signaux restent partagés. Attendre une confirmation améliore le rapport risque/rendement.":
    [
      "Signals remain mixed. Waiting for confirmation improves the risk/reward ratio.",
      "Die Signale bleiben gemischt. Eine Bestätigung verbessert das Chance-Risiko-Verhältnis.",
      "De signalen blijven verdeeld. Wachten op bevestiging verbetert de risico-rendementsverhouding.",
    ],
  "Cette décision résulte d’une lecture combinée de la structure de tendance, du momentum, de la volatilité et de la position du prix entre support et résistance. Elle décrit l’état actuel du marché, pas une certitude sur son évolution future.":
    [
      "This decision combines trend structure, momentum, volatility and the price position between support and resistance. It describes the current market state, not a certainty about the future.",
      "Diese Entscheidung kombiniert Trendstruktur, Momentum, Volatilität und die Kursposition zwischen Unterstützung und Widerstand. Sie beschreibt den aktuellen Markt, nicht die sichere Zukunft.",
      "Deze beslissing combineert trendstructuur, momentum, volatiliteit en de koerspositie tussen steun en weerstand. Ze beschrijft de huidige markt, niet de zekere toekomst.",
    ],
  "Le marché est en zone de surachat : la hausse peut continuer, mais le risque de respiration augmente.":
    [
      "The market is overbought: the rise may continue, but pullback risk increases.",
      "Der Markt ist überkauft: Der Anstieg kann weitergehen, aber das Rückschlagrisiko steigt.",
      "De markt is overgekocht: de stijging kan doorgaan, maar het correctierisico neemt toe.",
    ],
  "Le marché est en zone de survente : la pression vendeuse est forte, avec possibilité de rebond technique.":
    [
      "The market is oversold: selling pressure is strong, with a possible technical rebound.",
      "Der Markt ist überverkauft: Der Verkaufsdruck ist hoch, ein technischer Rebound ist möglich.",
      "De markt is oververkocht: de verkoopdruk is sterk, met kans op een technische opleving.",
    ],
  "Le momentum reste positif sans être dans une zone extrême.": [
    "Momentum remains positive without being extreme.",
    "Das Momentum bleibt positiv, ohne extrem zu sein.",
    "Het momentum blijft positief zonder extreem te zijn.",
  ],
  "Le momentum est inférieur à 50, ce qui traduit une demande encore fragile.":
    [
      "Momentum is below 50, indicating fragile demand.",
      "Das Momentum liegt unter 50 und zeigt eine fragile Nachfrage.",
      "Het momentum ligt onder 50 en wijst op een kwetsbare vraag.",
    ],
  "Les conditions ne sont pas assez alignées. Surveiller une cassure confirmée avant de construire un scénario.":
    [
      "Conditions are not aligned enough. Wait for a confirmed breakout before building a scenario.",
      "Die Bedingungen sind nicht ausreichend ausgerichtet. Vor einem Szenario auf einen bestätigten Ausbruch warten.",
      "De voorwaarden zijn onvoldoende afgestemd. Wacht op een bevestigde uitbraak voor u een scenario opbouwt.",
    ],
  "Les indicateurs sont cohérents et le rapport théorique est exploitable, mais la confirmation du prix reste indispensable.":
    [
      "Indicators are consistent and the theoretical ratio is usable, but price confirmation remains essential.",
      "Die Indikatoren sind stimmig und das theoretische Verhältnis ist nutzbar, aber eine Kursbestätigung bleibt unerlässlich.",
      "De indicatoren zijn coherent en de theoretische verhouding is bruikbaar, maar koersbevestiging blijft essentieel.",
    ],
  "Ne pas se positionner tant que les données ne sont pas disponibles.": [
    "Do not position while data is unavailable.",
    "Keine Position eingehen, solange keine Daten verfügbar sind.",
    "Neem geen positie zolang de gegevens niet beschikbaar zijn.",
  ],
  "Une opportunité décrit une configuration technique, jamais une garantie de résultat.":
    [
      "An opportunity describes a technical setup, never a guaranteed result.",
      "Eine Chance beschreibt ein technisches Setup, niemals ein garantiertes Ergebnis.",
      "Een kans beschrijft een technische setup, nooit een gegarandeerd resultaat.",
    ],
  "Analyse éducative — aucun rendement garanti": [
    "Educational analysis — no guaranteed return",
    "Lernanalyse — keine garantierte Rendite",
    "Educatieve analyse — geen gegarandeerd rendement",
  ],
  Prévisions: ["Forecasts", "Prognosen", "Prognoses"],
  Backtest: ["Backtest", "Backtest", "Backtest"],
  Passeports: ["Passports", "Pässe", "Paspoorten"],
  "PRÉVISION EN DIRECT": ["LIVE FORECAST", "LIVE-PROGNOSE", "LIVE PROGNOSE"],
  Orientation: ["Outlook", "Ausrichtung", "Vooruitzicht"],
  "Fourchette projetée": [
    "Projected range",
    "Prognosebereich",
    "Verwacht bereik",
  ],
  "Fiabilité indicative": [
    "Indicative reliability",
    "Indikative Zuverlässigkeit",
    "Indicatieve betrouwbaarheid",
  ],
  "Voir le rapport complet": [
    "View full report",
    "Vollständigen Bericht anzeigen",
    "Volledig rapport bekijken",
  ],
  "Avertissement sur les risques": [
    "Risk warning",
    "Risikowarnung",
    "Risicowaarschuwing",
  ],
  "Le trading comporte un risque élevé de perte en capital. Les CFD sont des instruments complexes : selon les avertissements officiels européens, 74 % à 89 % des comptes de particuliers perdent de l’argent avec ces produits.":
    [
      "Trading involves a high risk of capital loss. CFDs are complex instruments: according to official European warnings, 74% to 89% of retail accounts lose money with these products.",
      "Der Handel birgt ein hohes Kapitalverlustrisiko. CFDs sind komplexe Instrumente: Laut offiziellen europäischen Warnhinweisen verlieren 74 % bis 89 % der Privatanlegerkonten mit diesen Produkten Geld.",
      "Handelen brengt een hoog risico op kapitaalverlies met zich mee. CFD’s zijn complexe instrumenten: volgens officiële Europese waarschuwingen verliest 74% tot 89% van de particuliere accounts geld met deze producten.",
    ],
  "Consulter la FSMA": [
    "View FSMA guidance",
    "FSMA-Hinweise ansehen",
    "FSMA-richtlijnen bekijken",
  ],
  "Le trading peut entraîner la perte totale du capital — aucun rendement garanti":
    [
      "Trading can result in the total loss of capital — no return is guaranteed",
      "Der Handel kann zum vollständigen Kapitalverlust führen — keine Rendite ist garantiert",
      "Handelen kan leiden tot volledig kapitaalverlies — geen rendement is gegarandeerd",
    ],
  "PRÉVISIONS MULTI-FACTEURS": [
    "MULTI-FACTOR FORECASTS",
    "MULTIFAKTOR-PROGNOSEN",
    "MULTIFACTORPROGNOSES",
  ],
  "Scénarios prévisionnels par actif et période": [
    "Forecast scenarios by asset and timeframe",
    "Prognoseszenarien nach Asset und Zeitraum",
    "Prognosescenario’s per actief en periode",
  ],
  "Modèle expérimental fondé sur données techniques, actualités récentes et contexte macroéconomique vérifié.":
    [
      "Experimental model based on technical data, recent news and verified macroeconomic context.",
      "Experimentelles Modell auf Basis technischer Daten, aktueller Nachrichten und eines geprüften makroökonomischen Umfelds.",
      "Experimenteel model op basis van technische gegevens, recent nieuws en een geverifieerde macro-economische context.",
    ],
  Recalculer: ["Recalculate", "Neu berechnen", "Herberekenen"],
  "Horizon étudié": [
    "Timeframe analyzed",
    "Analysierter Zeitraum",
    "Geanalyseerde horizon",
  ],
  "Prévision temporairement indisponible": [
    "Forecast temporarily unavailable",
    "Prognose vorübergehend nicht verfügbar",
    "Prognose tijdelijk niet beschikbaar",
  ],
  "Les données de marché nécessaires ne sont pas suffisamment complètes. Aucun scénario n’est inventé.":
    [
      "The required market data is not sufficiently complete. No scenario is fabricated.",
      "Die erforderlichen Marktdaten sind nicht vollständig genug. Es wird kein Szenario erfunden.",
      "De benodigde marktgegevens zijn niet volledig genoeg. Er wordt geen scenario verzonnen.",
    ],
  "Orientation centrale": [
    "Central outlook",
    "Zentrale Ausrichtung",
    "Centrale verwachting",
  ],
  HAUSSIER: ["BULLISH", "BULLISCH", "STIJGEND"],
  BAISSIER: ["BEARISH", "BÄRISCH", "DALEND"],
  NEUTRE: ["NEUTRAL", "NEUTRAL", "NEUTRAAL"],
  "La combinaison technique et contextuelle favorise actuellement un scénario de progression.":
    [
      "The technical and contextual combination currently favors an upward scenario.",
      "Die technische und kontextuelle Kombination begünstigt derzeit ein Aufwärtsszenario.",
      "De technische en contextuele combinatie ondersteunt momenteel een opwaarts scenario.",
    ],
  "Les facteurs observés favorisent actuellement un scénario de repli ou de pression vendeuse.":
    [
      "The observed factors currently favor a pullback or selling-pressure scenario.",
      "Die beobachteten Faktoren begünstigen derzeit einen Rückgang oder Verkaufsdruck.",
      "De waargenomen factoren wijzen momenteel op een terugval of verkoopdruk.",
    ],
  "Les forces haussières et baissières restent trop proches pour dégager une direction dominante.":
    [
      "Bullish and bearish forces remain too close to establish a dominant direction.",
      "Aufwärts- und Abwärtskräfte liegen zu nah beieinander, um eine dominante Richtung zu bestimmen.",
      "Stijgende en dalende krachten liggen te dicht bij elkaar om een dominante richting te bepalen.",
    ],
  "jamais une probabilité garantie": [
    "never a guaranteed probability",
    "niemals eine garantierte Wahrscheinlichkeit",
    "nooit een gegarandeerde waarschijnlijkheid",
  ],
  "Fourchette statistique projetée": [
    "Projected statistical range",
    "Prognostizierte statistische Spanne",
    "Verwacht statistisch bereik",
  ],
  Centre: ["Center", "Mitte", "Midden"],
  "déplacement central": [
    "central move",
    "zentrale Bewegung",
    "centrale beweging",
  ],
  "Scénario haussier": [
    "Bullish scenario",
    "Bullisches Szenario",
    "Stijgend scenario",
  ],
  "Scénario neutre": [
    "Neutral scenario",
    "Neutrales Szenario",
    "Neutraal scenario",
  ],
  "Scénario baissier": [
    "Bearish scenario",
    "Bärisches Szenario",
    "Dalend scenario",
  ],
  "Confirmation au-dessus de": [
    "Confirmation above",
    "Bestätigung über",
    "Bevestiging boven",
  ],
  "Consolidation entre support et résistance": [
    "Consolidation between support and resistance",
    "Konsolidierung zwischen Unterstützung und Widerstand",
    "Consolidatie tussen steun en weerstand",
  ],
  "Invalidation sous": [
    "Invalidation below",
    "Ungültig unter",
    "Ongeldig onder",
  ],
  "Facteurs techniques": [
    "Technical factors",
    "Technische Faktoren",
    "Technische factoren",
  ],
  "Actualités intégrées": [
    "News included",
    "Einbezogene Nachrichten",
    "Verwerkt nieuws",
  ],
  "Contexte macro": ["Macro context", "Makro-Kontext", "Macrocontext"],
  "Risque d’erreur": ["Error risk", "Fehlerrisiko", "Foutrisico"],
  "au-dessus": ["above", "über", "boven"],
  "en dessous": ["below", "unter", "onder"],
  "titres récents inspectés": [
    "recent headlines reviewed",
    "aktuelle Schlagzeilen geprüft",
    "recente koppen beoordeeld",
  ],
  "Biais lexical": ["Language bias", "Sprachlicher Bias", "Taalkundige bias"],
  positif: ["positive", "positiv", "positief"],
  négatif: ["negative", "negativ", "negatief"],
  équilibré: ["balanced", "ausgewogen", "evenwichtig"],
  "Les titres ne remplacent jamais la lecture de la source complète.": [
    "Headlines never replace reading the full source.",
    "Schlagzeilen ersetzen niemals die Lektüre der vollständigen Quelle.",
    "Koppen vervangen nooit het lezen van de volledige bron.",
  ],
  "Biais macro appliqué": [
    "Applied macro bias",
    "Angewandter Makro-Bias",
    "Toegepaste macrobias",
  ],
  "points. Il reflète les décisions monétaires et risques globaux pertinents pour cette classe d’actifs.":
    [
      "points. It reflects monetary decisions and global risks relevant to this asset class.",
      "Punkte. Er spiegelt geldpolitische Entscheidungen und globale Risiken wider, die für diese Anlageklasse relevant sind.",
      "punten. Dit weerspiegelt monetaire beslissingen en mondiale risico’s die relevant zijn voor deze activaklasse.",
    ],
  "Une décision gouvernementale inattendue, une crise, un chiffre d’inflation ou une rupture de liquidité peut invalider instantanément cette projection.":
    [
      "An unexpected government decision, crisis, inflation release or liquidity disruption can instantly invalidate this projection.",
      "Eine unerwartete Regierungsentscheidung, Krise, Inflationszahl oder Liquiditätsstörung kann diese Prognose sofort ungültig machen.",
      "Een onverwachte overheidsbeslissing, crisis, inflatiecijfer of liquiditeitsverstoring kan deze prognose onmiddellijk ongeldig maken.",
    ],
  "Comparaison de toutes les périodes": [
    "All-timeframe comparison",
    "Vergleich aller Zeiträume",
    "Vergelijking van alle periodes",
  ],
  fiabilité: ["reliability", "Zuverlässigkeit", "betrouwbaarheid"],
  "Décisions publiques et environnement macro": [
    "Public decisions and macro environment",
    "Öffentliche Entscheidungen und Makro-Umfeld",
    "Overheidsbesluiten en macro-omgeving",
  ],
  "Références officielles vérifiées le 28 août 2026 · ouvrir la source pour contrôler une mise à jour.":
    [
      "Official references verified on August 28, 2026 · open the source to check for updates.",
      "Offizielle Quellen am 28. August 2026 geprüft · Quelle öffnen, um Aktualisierungen zu kontrollieren.",
      "Officiële bronnen geverifieerd op 28 augustus 2026 · open de bron om updates te controleren.",
    ],
  "Source officielle": [
    "Official source",
    "Offizielle Quelle",
    "Officiële bron",
  ],
  "Actualités récentes de": [
    "Recent news for",
    "Aktuelle Nachrichten zu",
    "Recent nieuws over",
  ],
  "Voir toutes les actualités": [
    "View all news",
    "Alle Nachrichten anzeigen",
    "Al het nieuws bekijken",
  ],
  "Aucune actualité récente disponible pour cet actif.": [
    "No recent news is available for this asset.",
    "Für dieses Asset sind keine aktuellen Nachrichten verfügbar.",
    "Er is geen recent nieuws beschikbaar voor dit actief.",
  ],
  "Prévision éducative, non conseil financier.": [
    "Educational forecast, not financial advice.",
    "Prognose zu Bildungszwecken, keine Finanzberatung.",
    "Educatieve prognose, geen financieel advies.",
  ],
  "Le moteur produit des scénarios conditionnels et une fourchette d’incertitude. Il n’utilise pas encore OpenAI : il s’agit d’un modèle quantitatif explicable, alimenté par les données réelles disponibles.":
    [
      "The engine produces conditional scenarios and an uncertainty range. It does not yet use OpenAI: it is an explainable quantitative model powered by available real data.",
      "Die Engine erzeugt bedingte Szenarien und eine Unsicherheitsspanne. Sie nutzt OpenAI noch nicht: Es handelt sich um ein erklärbares quantitatives Modell auf Basis verfügbarer realer Daten.",
      "De engine produceert voorwaardelijke scenario’s en een onzekerheidsmarge. OpenAI wordt nog niet gebruikt: dit is een uitlegbaar kwantitatief model op basis van beschikbare echte gegevens.",
    ],
  "LABORATOIRE DE STRATÉGIE": [
    "STRATEGY LAB",
    "STRATEGIELABOR",
    "STRATEGIELAB",
  ],
  "Backtest de": ["Backtest of", "Backtest von", "Backtest van"],
  "Estimation historique d’un croisement prix/EMA 20, frais théoriques de 0,12 % inclus.":
    [
      "Historical estimate of a price/EMA 20 crossover, including theoretical fees of 0.12%.",
      "Historische Schätzung eines Kurs/EMA-20-Crossovers, einschließlich theoretischer Gebühren von 0,12 %.",
      "Historische schatting van een koers/EMA 20-kruising, inclusief theoretische kosten van 0,12%.",
    ],
  "Changer l’actif ou la période": [
    "Change asset or timeframe",
    "Asset oder Zeitraum ändern",
    "Actief of periode wijzigen",
  ],
  "Signaux testés": ["Signals tested", "Getestete Signale", "Geteste signalen"],
  "sur les données actuellement chargées": [
    "on currently loaded data",
    "auf den aktuell geladenen Daten",
    "op de momenteel geladen gegevens",
  ],
  "Taux de réussite": ["Win rate", "Trefferquote", "Slagingspercentage"],
  "transactions positives après frais": [
    "profitable trades after fees",
    "positive Transaktionen nach Gebühren",
    "positieve transacties na kosten",
  ],
  "Résultat cumulé": [
    "Cumulative result",
    "Kumuliertes Ergebnis",
    "Cumulatief resultaat",
  ],
  "sans effet de levier": ["without leverage", "ohne Hebel", "zonder hefboom"],
  "Drawdown maximal": [
    "Maximum drawdown",
    "Maximaler Drawdown",
    "Maximale drawdown",
  ],
  "baisse depuis le meilleur niveau": [
    "decline from the highest level",
    "Rückgang vom Höchststand",
    "daling vanaf het hoogste niveau",
  ],
  "Lecture honnête du résultat": [
    "Honest reading of the result",
    "Ehrliche Einordnung des Ergebnisses",
    "Eerlijke interpretatie van het resultaat",
  ],
  "Ce test simplifié mesure une règle technique sur un échantillon limité. Il ne prouve pas qu’elle fonctionnera à l’avenir et n’intègre ni slippage réel, ni liquidité, ni fiscalité. Un résultat fondé sur moins de 20 signaux est insuffisant pour conclure.":
    [
      "This simplified test measures a technical rule on a limited sample. It does not prove future performance and excludes real slippage, liquidity and taxation. A result based on fewer than 20 signals is insufficient for a conclusion.",
      "Dieser vereinfachte Test misst eine technische Regel anhand einer begrenzten Stichprobe. Er beweist keine zukünftige Leistung und berücksichtigt weder realen Slippage noch Liquidität oder Steuern. Ein Ergebnis mit weniger als 20 Signalen reicht für eine Schlussfolgerung nicht aus.",
      "Deze vereenvoudigde test meet een technische regel op een beperkte steekproef. Het bewijst geen toekomstige prestaties en houdt geen rekening met werkelijke slippage, liquiditeit of belastingen. Een resultaat op basis van minder dan 20 signalen is onvoldoende voor een conclusie.",
    ],
  "Historique insuffisant": [
    "Insufficient history",
    "Unzureichender Verlauf",
    "Onvoldoende geschiedenis",
  ],
  "Ouvrez le cockpit, choisissez une période puis revenez au backtest.": [
    "Open the dashboard, choose a timeframe, then return to the backtest.",
    "Öffnen Sie das Cockpit, wählen Sie einen Zeitraum und kehren Sie dann zum Backtest zurück.",
    "Open het cockpit, kies een periode en ga daarna terug naar de backtest.",
  ],
  "PASSEPORTS DE DÉCISION": [
    "DECISION PASSPORTS",
    "ENTSCHEIDUNGSPÄSSE",
    "BESLISSINGSPASPOORTEN",
  ],
  "Historique traçable des analyses": [
    "Traceable analysis history",
    "Nachvollziehbarer Analyseverlauf",
    "Traceerbare analysegeschiedenis",
  ],
  "Chaque passeport conserve le contexte exact observé au moment de la décision.":
    [
      "Each passport preserves the exact context observed at the time of the decision.",
      "Jeder Pass bewahrt den genauen Kontext zum Zeitpunkt der Entscheidung.",
      "Elk paspoort bewaart de exacte context op het moment van de beslissing.",
    ],
  "Créer depuis le cockpit": [
    "Create from dashboard",
    "Im Cockpit erstellen",
    "Maken vanuit het cockpit",
  ],
  "Prix observé": ["Observed price", "Beobachteter Preis", "Waargenomen prijs"],
  "Cohérence technique": [
    "Technical consistency",
    "Technische Konsistenz",
    "Technische samenhang",
  ],
  "Alignement horizons": [
    "Timeframe alignment",
    "Zeitrahmen-Ausrichtung",
    "Afstemming van periodes",
  ],
  "Qualité des données": ["Data quality", "Datenqualität", "Datakwaliteit"],
  "Taille théorique": [
    "Theoretical size",
    "Theoretische Größe",
    "Theoretische grootte",
  ],
  unités: ["units", "Einheiten", "eenheden"],
  Supprimer: ["Delete", "Löschen", "Verwijderen"],
  "Aucun passeport enregistré": [
    "No saved passport",
    "Kein gespeicherter Pass",
    "Geen opgeslagen paspoort",
  ],
  "Dans le cockpit, cliquez sur « Enregistrer le passeport » pour figer une analyse et ses données.":
    [
      "In the dashboard, click “Save passport” to preserve an analysis and its data.",
      "Klicken Sie im Cockpit auf „Pass speichern“, um eine Analyse und ihre Daten festzuhalten.",
      "Klik in het cockpit op ‘Paspoort opslaan’ om een analyse en de gegevens vast te leggen.",
    ],
  "Ouvrir le cockpit": ["Open dashboard", "Cockpit öffnen", "Cockpit openen"],
  "Traçabilité de la décision": [
    "Decision traceability",
    "Nachvollziehbarkeit der Entscheidung",
    "Traceerbaarheid van de beslissing",
  ],
  "Source, période, cohérence technique et profil de risque seront figés dans un instantané vérifiable.":
    [
      "Source, timeframe, technical consistency and risk profile will be preserved in a verifiable snapshot.",
      "Quelle, Zeitraum, technische Konsistenz und Risikoprofil werden in einer überprüfbaren Momentaufnahme festgehalten.",
      "Bron, periode, technische samenhang en risicoprofiel worden vastgelegd in een verifieerbare momentopname.",
    ],
  "Enregistrer le passeport": [
    "Save passport",
    "Pass speichern",
    "Paspoort opslaan",
  ],
  "Profil trader et préférences": [
    "Trader profile and preferences",
    "Traderprofil und Einstellungen",
    "Handelaarsprofiel en voorkeuren",
  ],
  "Le profil adapte les calculs de risque sans exécuter aucun ordre.": [
    "The profile adapts risk calculations without executing any orders.",
    "Das Profil passt die Risikoberechnungen an, ohne Aufträge auszuführen.",
    "Het profiel past risicoberekeningen aan zonder orders uit te voeren.",
  ],
  "Mon profil de risque": [
    "My risk profile",
    "Mein Risikoprofil",
    "Mijn risicoprofiel",
  ],
  "Ces valeurs restent enregistrées uniquement dans ce navigateur.": [
    "These values are stored only in this browser.",
    "Diese Werte werden nur in diesem Browser gespeichert.",
    "Deze waarden worden alleen in deze browser opgeslagen.",
  ],
  Niveau: ["Level", "Niveau", "Niveau"],
  Débutant: ["Beginner", "Anfänger", "Beginner"],
  Intermédiaire: ["Intermediate", "Fortgeschritten", "Gemiddeld"],
  Avancé: ["Advanced", "Erfahren", "Gevorderd"],
  Style: ["Style", "Stil", "Stijl"],
  Investissement: ["Investing", "Investieren", "Beleggen"],
  "Capital de référence": [
    "Reference capital",
    "Referenzkapital",
    "Referentiekapitaal",
  ],
  "Risque maximal par scénario (%)": [
    "Maximum risk per scenario (%)",
    "Maximales Risiko pro Szenario (%)",
    "Maximaal risico per scenario (%)",
  ],
  "Perte journalière maximale (%)": [
    "Maximum daily loss (%)",
    "Maximaler Tagesverlust (%)",
    "Maximaal dagelijks verlies (%)",
  ],
  "Règle active": ["Active rule", "Aktive Regel", "Actieve regel"],
  "maximum par scénario": [
    "maximum per scenario",
    "Maximum pro Szenario",
    "maximum per scenario",
  ],
  "de capital, le risque monétaire théorique maximal est de": [
    "of capital, the maximum theoretical monetary risk is",
    "Kapital beträgt das maximale theoretische monetäre Risiko",
    "kapitaal bedraagt het maximale theoretische geldrisico",
  ],
  Avec: ["With", "Bei", "Met"],
  "Relance le scanner toutes les 5 minutes.": [
    "Runs the scanner every 5 minutes.",
    "Startet den Scanner alle 5 Minuten neu.",
    "Start de scanner elke 5 minuten opnieuw.",
  ],
  "Affiche l’interprétation associée à la décision.": [
    "Shows the interpretation associated with the decision.",
    "Zeigt die mit der Entscheidung verbundene Interpretation.",
    "Toont de interpretatie die bij de beslissing hoort.",
  ],
  Partiels: ["Partial", "Teilweise", "Gedeeltelijk"],
  "Assistant OpenAI": [
    "OpenAI Assistant",
    "OpenAI-Assistent",
    "OpenAI-assistent",
  ],
  "L’interface est préparée ; activation suspendue par l’autorisation du connecteur.":
    [
      "The interface is ready; activation is pending connector authorization.",
      "Die Oberfläche ist vorbereitet; die Aktivierung wartet auf die Connector-Autorisierung.",
      "De interface is klaar; activering wacht op toestemming voor de connector.",
    ],
  "En attente": ["Pending", "Ausstehend", "In afwachting"],
  "Aucun ordre n’est exécuté par l’application.": [
    "The application does not execute any orders.",
    "Die Anwendung führt keine Aufträge aus.",
    "De applicatie voert geen orders uit.",
  ],
  "États-Unis": ["United States", "Vereinigte Staaten", "Verenigde Staten"],
  "Zone euro": ["Euro area", "Eurozone", "Eurozone"],
  "Royaume-Uni": [
    "United Kingdom",
    "Vereinigtes Königreich",
    "Verenigd Koninkrijk",
  ],
  Monde: ["Global", "Weltweit", "Wereldwijd"],
  "Fed : taux maintenu à 3,50–3,75 %": [
    "Fed: rate held at 3.50–3.75%",
    "Fed: Zinssatz bei 3,50–3,75 % belassen",
    "Fed: rente gehandhaafd op 3,50–3,75%",
  ],
  "BCE : taux inchangés après la hausse de juin": [
    "ECB: rates unchanged after June increase",
    "EZB: Zinsen nach der Erhöhung im Juni unverändert",
    "ECB: rente ongewijzigd na verhoging in juni",
  ],
  "BoE : Bank Rate maintenu à 3,75 %": [
    "BoE: Bank Rate held at 3.75%",
    "BoE: Leitzins bei 3,75 % belassen",
    "BoE: Bank Rate gehandhaafd op 3,75%",
  ],
  "FMI : croissance mondiale 2026 estimée à 3,0 %": [
    "IMF: 2026 global growth estimated at 3.0%",
    "IWF: Weltwachstum 2026 auf 3,0 % geschätzt",
    "IMF: wereldgroei 2026 geraamd op 3,0%",
  ],
  "Conditions financières encore restrictives : soutien potentiel au dollar, vigilance sur les actions de croissance et la crypto.":
    [
      "Financial conditions remain restrictive: potential support for the dollar and caution on growth stocks and crypto.",
      "Die Finanzbedingungen bleiben restriktiv: mögliche Unterstützung für den Dollar und Vorsicht bei Wachstumsaktien und Krypto.",
      "De financiële omstandigheden blijven restrictief: mogelijke steun voor de dollar en voorzichtigheid bij groeiaandelen en crypto.",
    ],
  "Énergie volatile et incertitude élevée : impact direct sur EUR, DAX, CAC 40 et Euro Stoxx 50.":
    [
      "Volatile energy and high uncertainty: direct impact on EUR, DAX, CAC 40 and Euro Stoxx 50.",
      "Volatile Energiepreise und hohe Unsicherheit: direkte Auswirkungen auf EUR, DAX, CAC 40 und Euro Stoxx 50.",
      "Volatiele energie en grote onzekerheid: directe impact op EUR, DAX, CAC 40 en Euro Stoxx 50.",
    ],
  "Trois membres souhaitaient une hausse : facteur de volatilité pour GBP et FTSE 100.":
    [
      "Three members favored an increase: a volatility factor for GBP and FTSE 100.",
      "Drei Mitglieder befürworteten eine Erhöhung: ein Volatilitätsfaktor für GBP und FTSE 100.",
      "Drie leden wilden een verhoging: een volatiliteitsfactor voor GBP en FTSE 100.",
    ],
  "Croissance inégale, choc énergétique et demande technologique : contexte mixte pour indices, métaux et devises.":
    [
      "Uneven growth, energy shock and technology demand: a mixed backdrop for indices, metals and currencies.",
      "Ungleichmäßiges Wachstum, Energieschock und Technologienachfrage: gemischtes Umfeld für Indizes, Metalle und Währungen.",
      "Ongelijke groei, energieschok en technologievraag: een gemengde context voor indices, metalen en valuta.",
    ],
  "RAPPORT D’ACTUALITÉ": ["NEWS REPORT", "NACHRICHTENBERICHT", "NIEUWSRAPPORT"],
  "Pourquoi cette nouvelle est pertinente": [
    "Why this news matters",
    "Warum diese Nachricht relevant ist",
    "Waarom dit nieuws relevant is",
  ],
  "Comment l’intégrer à la décision": [
    "How to factor it into the decision",
    "Wie sie in die Entscheidung einfließt",
    "Hoe dit in de beslissing meeweegt",
  ],
  "Risques à surveiller": [
    "Risks to watch",
    "Zu beobachtende Risiken",
    "Risico’s om te volgen",
  ],
  "Lire l’article complet chez": [
    "Read the full article at",
    "Vollständigen Artikel lesen bei",
    "Lees het volledige artikel bij",
  ],
  "date indisponible": [
    "date unavailable",
    "Datum nicht verfügbar",
    "datum niet beschikbaar",
  ],
  "en cours…": ["in progress…", "wird geladen…", "bezig…"],
  Baromètres: ["Market gauges", "Marktbarometer", "Marktbarometers"],
  "Trajectoire prévisionnelle multi-horizons": [
    "Multi-horizon forecast path",
    "Prognoseverlauf über mehrere Horizonte",
    "Prognosetraject over meerdere horizons",
  ],
  "La zone colorée représente la fourchette d’incertitude, la ligne verte le scénario central.":
    [
      "The colored area represents the uncertainty range; the green line shows the central scenario.",
      "Der farbige Bereich zeigt die Unsicherheitsspanne, die grüne Linie das zentrale Szenario.",
      "Het gekleurde gebied toont de onzekerheidsmarge; de groene lijn het centrale scenario.",
    ],
  Fourchette: ["Range", "Spanne", "Bereik"],
  "Scénario central": [
    "Central scenario",
    "Zentrales Szenario",
    "Centraal scenario",
  ],
  "Niveaux techniques": [
    "Technical levels",
    "Technische Niveaus",
    "Technische niveaus",
  ],
  "Fiabilité sélectionnée": [
    "Selected reliability",
    "Gewählte Zuverlässigkeit",
    "Geselecteerde betrouwbaarheid",
  ],
  "Projection conditionnelle : elle évolue avec la période, le prix, la volatilité et les nouvelles données.":
    [
      "Conditional projection: it changes with the timeframe, price, volatility and new data.",
      "Bedingte Prognose: Sie verändert sich mit Zeitraum, Kurs, Volatilität und neuen Daten.",
      "Voorwaardelijke prognose: deze verandert met de periode, prijs, volatiliteit en nieuwe gegevens.",
    ],
  Résistance: ["Resistance", "Widerstand", "Weerstand"],
  "Indice de volatilité": [
    "Volatility Index",
    "Volatilitätsindex",
    "Volatiliteitsindex",
  ],
  "Indice du dollar américain": [
    "US Dollar Index",
    "US-Dollar-Index",
    "Amerikaanse dollarindex",
  ],
  "Dollar / Yuan offshore": [
    "Dollar / Offshore Yuan",
    "Dollar / Offshore-Yuan",
    "Dollar / offshore yuan",
  ],
  "Dollar / Peso mexicain": [
    "Dollar / Mexican Peso",
    "Dollar / Mexikanischer Peso",
    "Dollar / Mexicaanse peso",
  ],
  "Dollar / Dollar de Hong Kong": [
    "Dollar / Hong Kong Dollar",
    "Dollar / Hongkong-Dollar",
    "Dollar / Hongkongse dollar",
  ],
  "Dollar / Dollar de Singapour": [
    "Dollar / Singapore Dollar",
    "Dollar / Singapur-Dollar",
    "Dollar / Singaporese dollar",
  ],
  "Franc suisse / Yen": [
    "Swiss Franc / Yen",
    "Schweizer Franken / Yen",
    "Zwitserse frank / yen",
  ],
  "Dollar canadien / Yen": [
    "Canadian Dollar / Yen",
    "Kanadischer Dollar / Yen",
    "Canadese dollar / yen",
  ],
  "Shanghai Composite": [
    "Shanghai Composite",
    "Shanghai Composite",
    "Shanghai Composite",
  ],
  "Swiss Market Index": [
    "Swiss Market Index",
    "Swiss Market Index",
    "Swiss Market Index",
  ],
  "INTELLIGENCE BIGDATA.COM": [
    "BIGDATA.COM INTELLIGENCE",
    "BIGDATA.COM INTELLIGENCE",
    "BIGDATA.COM INTELLIGENCE",
  ],
  "Catalyseurs, contexte fondamental et risques intégrés au score prévisionnel.":
    [
      "Catalysts, fundamental context and risks integrated into the forecast score.",
      "Katalysatoren, Fundamentalkontext und Risiken sind in den Prognosewert integriert.",
      "Katalysatoren, fundamentele context en risico’s zijn verwerkt in de prognosescore.",
    ],
  "Analyse en cours": [
    "Analysis in progress",
    "Analyse läuft",
    "Analyse bezig",
  ],
  "Données directes": ["Live data", "Direkte Daten", "Directe gegevens"],
  "Snapshot vérifié": [
    "Verified snapshot",
    "Geprüfter Snapshot",
    "Geverifieerde snapshot",
  ],
  "Impact sur la prévision": [
    "Forecast impact",
    "Auswirkung auf die Prognose",
    "Impact op de prognose",
  ],
  "Intelligence Bigdata temporairement indisponible.": [
    "Bigdata intelligence is temporarily unavailable.",
    "Bigdata Intelligence ist vorübergehend nicht verfügbar.",
    "Bigdata-intelligentie is tijdelijk niet beschikbaar.",
  ],
  "Mis à jour": ["Updated", "Aktualisiert", "Bijgewerkt"],
  "mode direct": ["live mode", "Direktmodus", "directe modus"],
  "mode snapshot": ["snapshot mode", "Snapshot-Modus", "snapshotmodus"],
  "Contexte fondamental, catalyseurs et risques intégrés aux prévisions.": [
    "Fundamental context, catalysts and risks integrated into forecasts.",
    "Fundamentalkontext, Katalysatoren und Risiken sind in die Prognosen integriert.",
    "Fundamentele context, katalysatoren en risico’s zijn verwerkt in de prognoses.",
  ],
  Direct: ["Live", "Direkt", "Direct"],
  Snapshot: ["Snapshot", "Snapshot", "Snapshot"],
  "Le snapshot Bigdata montre BTC à -3,62 % et ETH à -3,39 % sur 1 jour, malgré une progression positive sur 1 mois. Le court terme reste sous pression.":
    [
      "The Bigdata snapshot shows BTC at -3.62% and ETH at -3.39% over one day, despite positive one-month performance. The short term remains under pressure.",
      "Der Bigdata-Snapshot zeigt BTC bei -3,62 % und ETH bei -3,39 % an einem Tag, trotz positiver Monatsentwicklung. Kurzfristig bleibt der Druck bestehen.",
      "De Bigdata-snapshot toont BTC op -3,62% en ETH op -3,39% over één dag, ondanks positieve maandprestaties. De korte termijn blijft onder druk.",
    ],
  "Le snapshot Bigdata montre un dollar ferme face à plusieurs devises : EUR/USD -0,61 % et USD/JPY +0,44 % sur 1 jour. Le biais dépend fortement de la paire sélectionnée.":
    [
      "The Bigdata snapshot shows a firm dollar against several currencies: EUR/USD -0.61% and USD/JPY +0.44% over one day. The bias depends strongly on the selected pair.",
      "Der Bigdata-Snapshot zeigt einen festen Dollar gegenüber mehreren Währungen: EUR/USD -0,61 % und USD/JPY +0,44 % an einem Tag. Der Bias hängt stark vom gewählten Paar ab.",
      "De Bigdata-snapshot toont een stevige dollar tegenover meerdere valuta’s: EUR/USD -0,61% en USD/JPY +0,44% over één dag. De bias hangt sterk af van het gekozen paar.",
    ],
  "Le snapshot Bigdata montre un marché contrasté : S&P 500 -0,25 %, Nasdaq 100 -0,70 %, DAX +0,60 % et Euro Stoxx 50 +0,78 % sur 1 jour.":
    [
      "The Bigdata snapshot shows mixed markets: S&P 500 -0.25%, Nasdaq 100 -0.70%, DAX +0.60% and Euro Stoxx 50 +0.78% over one day.",
      "Der Bigdata-Snapshot zeigt gemischte Märkte: S&P 500 -0,25 %, Nasdaq 100 -0,70 %, DAX +0,60 % und Euro Stoxx 50 +0,78 % an einem Tag.",
      "De Bigdata-snapshot toont gemengde markten: S&P 500 -0,25%, Nasdaq 100 -0,70%, DAX +0,60% en Euro Stoxx 50 +0,78% over één dag.",
    ],
  "Le snapshot Bigdata montre l’or à -2,88 % et l’argent à -3,49 % sur 1 jour, dans un environnement de rendement américain à 10 ans proche de 4,73 %.":
    [
      "The Bigdata snapshot shows gold at -2.88% and silver at -3.49% over one day, with the US 10-year yield near 4.73%.",
      "Der Bigdata-Snapshot zeigt Gold bei -2,88 % und Silber bei -3,49 % an einem Tag, bei einer US-Rendite für zehn Jahre von rund 4,73 %.",
      "De Bigdata-snapshot toont goud op -2,88% en zilver op -3,49% over één dag, met de Amerikaanse tienjaarsrente rond 4,73%.",
    ],
  "Le VIX ressort à 14,43, en baisse de 30,15 % sur un mois. La volatilité implicite est contenue, mais les rendements américains restent élevés.":
    [
      "The VIX stands at 14.43, down 30.15% over one month. Implied volatility is contained, but US yields remain high.",
      "Der VIX liegt bei 14,43 und damit 30,15 % niedriger als vor einem Monat. Die implizite Volatilität ist begrenzt, die US-Renditen bleiben jedoch hoch.",
      "De VIX staat op 14,43, 30,15% lager over één maand. De impliciete volatiliteit is beperkt, maar de Amerikaanse rente blijft hoog.",
    ],
  "Volatilité implicite américaine": [
    "US implied volatility",
    "Implizite US-Volatilität",
    "Amerikaanse impliciete volatiliteit",
  ],
  "VIX à 14,43 dans le dernier snapshot vérifié.": [
    "VIX at 14.43 in the latest verified snapshot.",
    "VIX bei 14,43 im letzten geprüften Snapshot.",
    "VIX op 14,43 in de laatste geverifieerde snapshot.",
  ],
  "Rendements du Trésor américain": [
    "US Treasury yields",
    "US-Staatsanleiherenditen",
    "Amerikaanse staatsrente",
  ],
  "10 ans à 4,73 % et 2 ans à 4,34 %.": [
    "10-year at 4.73% and 2-year at 4.34%.",
    "10 Jahre bei 4,73 % und 2 Jahre bei 4,34 %.",
    "Tien jaar op 4,73% en twee jaar op 4,34%.",
  ],
  "Rotation géographique": [
    "Geographic rotation",
    "Geografische Rotation",
    "Geografische rotatie",
  ],
  "Europe positive alors que plusieurs indices américains terminent en baisse.":
    [
      "Europe is positive while several US indices close lower.",
      "Europa ist positiv, während mehrere US-Indizes niedriger schließen.",
      "Europa is positief terwijl meerdere Amerikaanse indices lager sluiten.",
    ],
  "Court terme": ["Short term", "Kurzfristig", "Korte termijn"],
  Macro: ["Macro", "Makro", "Macro"],
  "Snapshot daté : vérifier la fraîcheur avant toute décision.": [
    "Dated snapshot: verify freshness before any decision.",
    "Datierter Snapshot: Vor jeder Entscheidung die Aktualität prüfen.",
    "Gedateerde snapshot: controleer de actualiteit vóór elke beslissing.",
  ],
  "Une annonce politique ou monétaire peut modifier le régime instantanément.":
    [
      "A political or monetary announcement can instantly change the regime.",
      "Eine politische oder geldpolitische Ankündigung kann das Regime sofort verändern.",
      "Een politieke of monetaire aankondiging kan het regime onmiddellijk veranderen.",
    ],
  Métaux: ["Metals", "Metalle", "Metalen"],
  "Métaux précieux": ["Precious metals", "Edelmetalle", "Edelmetalen"],
  "Or / Dollar": ["Gold / Dollar", "Gold / Dollar", "Goud / Dollar"],
  "Argent / Dollar": ["Silver / Dollar", "Silber / Dollar", "Zilver / Dollar"],
  "ANALYSE INSTANTANÉE OPENAI": ["INSTANT OPENAI ANALYSIS", "SOFORTIGE OPENAI-ANALYSE", "DIRECTE OPENAI-ANALYSE"],
  "Lecture explicative croisée : technique, prévision, Bigdata et actualités.": ["Combined explanatory reading: technicals, forecast, Bigdata and news.", "Kombinierte Erklärung: Technik, Prognose, Bigdata und Nachrichten.", "Gecombineerde uitleg: techniek, prognose, Bigdata en nieuws."],
  "Analyse en cours…": ["Analysis in progress…", "Analyse läuft…", "Analyse bezig…"],
  "Actualiser l’analyse": ["Refresh analysis", "Analyse aktualisieren", "Analyse vernieuwen"],
  "Analyser maintenant": ["Analyze now", "Jetzt analysieren", "Nu analyseren"],
  "OpenAI inspecte le contexte actuel…": ["OpenAI is inspecting the current context…", "OpenAI prüft den aktuellen Kontext…", "OpenAI onderzoekt de huidige context…"],
  "L’actif, la période et les dernières données sont analysés ensemble.": ["The asset, timeframe and latest data are analyzed together.", "Asset, Zeitraum und neueste Daten werden gemeinsam analysiert.", "Het actief, de periode en de nieuwste gegevens worden samen geanalyseerd."],
  "Analyse OpenAI indisponible": ["OpenAI analysis unavailable", "OpenAI-Analyse nicht verfügbar", "OpenAI-analyse niet beschikbaar"],
  "Limite temporaire atteinte. Réessayez dans une minute.": ["Temporary limit reached. Try again in one minute.", "Temporäres Limit erreicht. Versuchen Sie es in einer Minute erneut.", "Tijdelijke limiet bereikt. Probeer over één minuut opnieuw."],
  "La clé serveur OPENAI_API_KEY n’est pas encore disponible pour ce déploiement.": ["The server OPENAI_API_KEY is not yet available to this deployment.", "Der Server-Schlüssel OPENAI_API_KEY ist für dieses Deployment noch nicht verfügbar.", "De servervariabele OPENAI_API_KEY is nog niet beschikbaar voor deze deployment."],
  "Vérifiez la clé, le crédit API ou réessayez dans quelques instants.": ["Check the key and API credit, or try again shortly.", "Prüfen Sie Schlüssel und API-Guthaben oder versuchen Sie es gleich erneut.", "Controleer de sleutel en het API-tegoed of probeer het zo opnieuw."],
  "Réessayer": ["Try again", "Erneut versuchen", "Opnieuw proberen"],
  "Décision IA conditionnelle": ["Conditional AI decision", "Bedingte KI-Entscheidung", "Voorwaardelijke AI-beslissing"],
  "Confiance d’alignement": ["Alignment confidence", "Übereinstimmungskonfidenz", "Afstemmingsvertrouwen"],
  "Facteurs favorables": ["Supporting factors", "Günstige Faktoren", "Gunstige factoren"],
  "Condition d’invalidation": ["Invalidation condition", "Invalidierungsbedingung", "Invalidatievoorwaarde"],
  "Analyse prête": ["Analysis ready", "Analyse bereit", "Analyse gereed"],
  "Cliquez pour obtenir une explication IA liée à": ["Click for an AI explanation related to", "Klicken Sie für eine KI-Erklärung zu", "Klik voor een AI-uitleg over"],
  "OpenAI apporte une lecture explicative séparée, sans remplacer les données, ni garantir un rendement.": ["OpenAI provides a separate explanatory reading without replacing data or guaranteeing returns.", "OpenAI liefert eine separate Erklärung, ohne Daten zu ersetzen oder Renditen zu garantieren.", "OpenAI biedt een afzonderlijke uitleg zonder gegevens te vervangen of rendement te garanderen."],
  "Le trading peut entraîner une perte partielle ou totale du capital.": ["Trading can result in a partial or total loss of capital.", "Trading kann zu einem teilweisen oder vollständigen Kapitalverlust führen.", "Trading kan leiden tot gedeeltelijk of volledig kapitaalverlies."],
  "Panorama mondial et mood du marché": ["Global overview and market mood", "Globaler Überblick und Marktstimmung", "Wereldwijd overzicht en marktsentiment"],
  "Réduire cette zone": ["Collapse this area", "Diesen Bereich einklappen", "Dit gebied inklappen"],
  "actifs surveillés · afficher les catégories et le sentiment": ["assets monitored · show categories and sentiment", "Assets überwacht · Kategorien und Stimmung anzeigen", "activa gevolgd · categorieën en sentiment tonen"],
  "Voir la prévision": ["View forecast", "Prognose anzeigen", "Prognose bekijken"],
  "Voir l’historique": ["View history", "Historie anzeigen", "Historiek bekijken"],
  "Graphique prévisionnel multi-horizons": ["Multi-horizon forecast chart", "Multi-Horizont-Prognosechart", "Multi-horizon prognosegrafiek"],
  "période active": ["active timeframe", "aktiver Zeitraum", "actieve periode"],
  "Période active": ["Active timeframe", "Aktiver Zeitraum", "Actieve periode"],
  "Rapport prévisionnel complet": ["Full forecast report", "Vollständiger Prognosebericht", "Volledig prognoserapport"],
  "Repli automatique dans": ["Auto-collapse in", "Automatisch einklappen in", "Automatisch inklappen over"],
  "PRÉVISION AFFICHÉE SUR CE GRAPHIQUE": ["FORECAST SHOWN ON THIS CHART", "AUF DIESEM CHART ANGEZEIGTE PROGNOSE", "PROGNOSE OP DEZE GRAFIEK"],
  "Scénario neutre / baissier": ["Neutral / bearish scenario", "Neutrales / bärisches Szenario", "Neutraal / bearish scenario"],
  "Projection éducative calculée avec la période active, la tendance, le momentum, la volatilité et les informations disponibles.": ["Educational projection calculated from the active timeframe, trend, momentum, volatility and available information.", "Pädagogische Projektion auf Basis des aktiven Zeitraums, Trends, Momentums, der Volatilität und verfügbarer Informationen.", "Educatieve projectie berekend met de actieve periode, trend, momentum, volatiliteit en beschikbare informatie."],
  "Plus de détails dans le rapport complet": ["More details in the full report", "Weitere Details im vollständigen Bericht", "Meer details in het volledige rapport"],
  "Sticky activé": ["Sticky enabled", "Sticky aktiviert", "Sticky ingeschakeld"],
  "Sticky désactivé": ["Sticky disabled", "Sticky deaktiviert", "Sticky uitgeschakeld"],
  "Désactiver le mode sticky": ["Disable sticky mode", "Sticky-Modus deaktivieren", "Sticky-modus uitschakelen"],
  "Activer le mode sticky": ["Enable sticky mode", "Sticky-Modus aktivieren", "Sticky-modus inschakelen"],
  "Rechercher ou choisir un actif…": ["Search or choose an asset…", "Asset suchen oder auswählen…", "Zoek of kies een actief…"],
  "Afficher tous les actifs": ["Show all assets", "Alle Assets anzeigen", "Alle activa tonen"],
  "Tous les actifs de la plateforme": ["All platform assets", "Alle Plattform-Assets", "Alle platformactiva"],
  "Accès rapide aux actifs": ["Quick asset access", "Schnellzugriff auf Assets", "Snelle toegang tot activa"],
  "catégories": ["categories", "Kategorien", "categorieën"],
  "Aucun actif ne correspond à cette recherche.": ["No asset matches this search.", "Kein Asset entspricht dieser Suche.", "Geen actief komt overeen met deze zoekopdracht."],
  "CONTRÔLE DE LA DÉCISION": ["DECISION CONTROL", "ENTSCHEIDUNGSKONTROLLE", "BESLISSINGSCONTROLE"],
  "Contrôle et preuves de la décision": ["Decision control and evidence", "Kontrolle und Nachweise der Entscheidung", "Controle en bewijs van de beslissing"],
  "Preuves, divergences et conditions d’activation": ["Evidence, divergences and activation conditions", "Nachweise, Divergenzen und Aktivierungsbedingungen", "Bewijs, verschillen en activeringsvoorwaarden"],
  "Qualité des preuves": ["Evidence quality", "Nachweisqualität", "Kwaliteit van het bewijs"],
  "Accord entre les périodes": ["Timeframe agreement", "Übereinstimmung der Zeiträume", "Overeenstemming tussen periodes"],
  "horizons alignés": ["aligned horizons", "übereinstimmende Horizonte", "afgestemde horizonten"],
  "Scénario conditionnel": ["Conditional scenario", "Bedingtes Szenario", "Voorwaardelijk scenario"],
  "Haussier sous condition": ["Conditionally bullish", "Bedingt bullisch", "Voorwaardelijk stijgend"],
  "Baissier sous condition": ["Conditionally bearish", "Bedingt bärisch", "Voorwaardelijk dalend"],
  "Dernier changement expliqué": ["Latest change explained", "Letzte Änderung erklärt", "Laatste wijziging uitgelegd"],
  "Aucun changement enregistré": ["No recorded change", "Keine Änderung erfasst", "Geen wijziging geregistreerd"],
  "Le suivi commencera dès qu’un nouveau calcul modifiera la décision de cet actif.": ["Tracking will begin as soon as a new calculation changes this asset’s decision.", "Die Nachverfolgung beginnt, sobald eine neue Berechnung die Entscheidung für dieses Asset ändert.", "De opvolging start zodra een nieuwe berekening de beslissing voor dit actief wijzigt."],
  "Contexte Bigdata": ["Bigdata context", "Bigdata-Kontext", "Bigdata-context"],
  "IA explicative": ["Explanatory AI", "Erklärende KI", "Verklarende AI"],
  "non confirmé": ["unconfirmed", "unbestätigt", "niet bevestigd"],
  "non générée": ["not generated", "nicht generiert", "niet gegenereerd"],
  "Gain moyen par signal": ["Average return per signal", "Durchschnittlicher Ertrag pro Signal", "Gemiddeld rendement per signaal"],
  "après frais théoriques": ["after theoretical costs", "nach theoretischen Kosten", "na theoretische kosten"],
  "Facteur de profit": ["Profit factor", "Profitfaktor", "Winstfactor"],
  "gains bruts divisés par pertes brutes": ["gross gains divided by gross losses", "Bruttogewinne geteilt durch Bruttoverluste", "brutowinst gedeeld door brutoverlies"],
  "Référence passive": ["Passive benchmark", "Passive Referenz", "Passieve benchmark"],
  "achat-conservation sur le même échantillon": ["buy-and-hold on the same sample", "Buy-and-Hold auf derselben Stichprobe", "buy-and-hold op dezelfde steekproef"],
  "Qualité de l’échantillon": ["Sample quality", "Stichprobenqualität", "Kwaliteit van de steekproef"],
  "signaux observés": ["observed signals", "beobachtete Signale", "waargenomen signalen"],
  "Fiabilité prévisionnelle": ["Forecast reliability", "Prognosezuverlässigkeit", "Betrouwbaarheid van de prognose"],
  "Preuves contextuelles": ["Contextual evidence", "Kontextnachweise", "Contextueel bewijs"],
  "Moteur quantitatif explicable": ["Explainable quantitative engine", "Erklärbare quantitative Engine", "Uitlegbare kwantitatieve motor"],
};
const idx: Record<Lang, number> = { fr: 0, en: 0, de: 1, nl: 2 };
export function translateText(value: string, lang: Lang) {
  if (lang === "fr" || !value.trim()) return value;
  const padStart = value.match(/^\s*/)?.[0] || "",
    padEnd = value.match(/\s*$/)?.[0] || "",
    raw = value.trim(),
    i = idx[lang];
  if (words[raw]) return padStart + words[raw][i] + padEnd;
  let out = raw;
  for (const key of Object.keys(words).sort((a, b) => b.length - a.length))
    out = out.split(key).join(words[key][i]);
  return padStart + out + padEnd;
}
