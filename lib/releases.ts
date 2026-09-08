import { BUILD_ID } from './build-version';
export const releaseManifest = {
  schemaVersion: 1,
  buildId: BUILD_ID,
  version: '2026.09.08.2',
  publishedAt: '2026-09-08',
  mobile: { android: {version: '0.2.0', build: 2, storeUrl: null}, ios: {version: '0.2.0', build: 2, storeUrl: null} },
  releases: [
    {version:'2026.09.08.2',date:'2026-09-08',status:'current',notes:{fr:['Feedback avec capture facultative et réception privée dans l’administration.'],en:['Feedback with optional screenshot and private administration inbox.'],de:['Feedback mit optionalem Screenshot und privatem Verwaltungspostfach.'],nl:['Feedback met optionele screenshot en privé-inbox voor beheer.']}},
    {version:'2026.09.08.1',date:'2026-09-08',status:'previous',notes:{fr:['Vérification automatique des mises à jour et actualisation à votre demande.','Historique des nouveautés accessible depuis la vitrine et le cockpit.','Conservation de l’actif, de la période et de la langue lors de l’actualisation.'],en:['Automatic update checks and refresh on request.','Release history available from the landing page and cockpit.','Asset, timeframe and language retained during refresh.'],de:['Automatische Update-Prüfung und Aktualisierung auf Wunsch.','Versionsverlauf auf der Website und im Cockpit.','Wert, Zeitraum und Sprache bleiben beim Aktualisieren erhalten.'],nl:['Automatische updatecontrole en vernieuwen op verzoek.','Versiegeschiedenis vanuit de website en het cockpit.','Activum, periode en taal blijven behouden bij vernieuwen.']}},
    {version:'45',date:'2026-09-08',status:'previous',notes:{fr:['Globe animé avec pause et prise en compte des préférences de mouvement.'],en:['Animated globe with pause and reduced-motion support.'],de:['Animierter Globus mit Pause und reduziertem Bewegungsmodus.'],nl:['Geanimeerde globe met pauze en ondersteuning voor minder beweging.']}},
    {version:'44',date:'2026-09-08',status:'previous',notes:{fr:['Arrière-plans financiers optimisés pour mobile.'],en:['Financial backgrounds optimized for mobile.'],de:['Für Mobilgeräte optimierte Finanzhintergründe.'],nl:['Financiële achtergronden geoptimaliseerd voor mobiel.']}},
    {version:'43',date:'2026-09-07',status:'previous',notes:{fr:['Vitrine en français, anglais, allemand et néerlandais.','Démonstration interactive du parcours d’analyse.'],en:['French, English, German and Dutch landing page.','Interactive analysis walkthrough.'],de:['Website auf Französisch, Englisch, Deutsch und Niederländisch.','Interaktive Demonstration der Analyse.'],nl:['Website in Frans, Engels, Duits en Nederlands.','Interactieve demonstratie van de analyse.']}}
  ],
  upcoming: {fr:['Application Flutter Android/iPhone : intégration et validation en cours, sans date de disponibilité annoncée.'],en:['Flutter Android/iPhone app: integration and validation in progress; no release date announced.'],de:['Flutter-App für Android/iPhone: Integration und Prüfung laufen; noch kein Veröffentlichungstermin.'],nl:['Flutter-app voor Android/iPhone: integratie en validatie lopen; nog geen releasedatum.']}
} as const;
