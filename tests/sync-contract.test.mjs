import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const indicatorEngine=fs.readFileSync('lib/indicator-engine.ts','utf8');
const indicatorRoute=fs.readFileSync('app/api/indicators/route.ts','utf8');
const ichimokuHistory=fs.readFileSync('lib/ichimoku-history.ts','utf8');
const ichimokuHistoryRoute=fs.readFileSync('app/api/ichimoku-history/route.ts','utf8');
const flutterIndicators=fs.readFileSync('mobile/lib/features/indicators/data/indicator_repository.dart','utf8');
const flutterHistory=fs.readFileSync('mobile/lib/features/history/data/history_repository.dart','utf8');
const flutterIchimoku=fs.readFileSync('mobile/lib/features/history/data/ichimoku_history_repository.dart','utf8');
const flutterMarketStatus=fs.readFileSync('mobile/lib/features/markets/data/market_status_repository.dart','utf8');
const flutterNewsAlerts=fs.readFileSync('mobile/lib/features/news/data/news_alert_repository.dart','utf8');
const flutterShell=fs.readFileSync('mobile/lib/app_shell.dart','utf8');
const manifest=fs.readFileSync('app/api/sync/manifest/route.ts','utf8');
const marketSessions=fs.readFileSync('lib/market-sessions.ts','utf8');
const marketStatusRoute=fs.readFileSync('app/api/market-status/route.ts','utf8');
const newsSource=fs.readFileSync('lib/news-source.ts','utf8');
const newsAlertEngine=fs.readFileSync('lib/news-alert-engine.ts','utf8');
const newsRoute=fs.readFileSync('app/api/news/route.ts','utf8');
const newsAlertsRoute=fs.readFileSync('app/api/news-alerts/route.ts','utf8');
const webNotifications=fs.readFileSync('app/notifications/page.tsx','utf8');

test('indicator engine exposes every synchronized indicator',()=>{
 for(const name of ['Ichimoku Kinko Hyo','EMA 20 / EMA 50','RSI 14','MACD 12 / 26','Bandes de Bollinger','ATR 14','Supports / Résistances']) assert.match(indicatorEngine,new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
});

test('web indicator route delegates to shared engine',()=>{assert.match(indicatorRoute,/buildIndicatorCenter/);assert.match(indicatorRoute,/history\(/);assert.match(indicatorRoute,/timeframeSnapshot/);});

test('flutter consumes the web indicator contract',()=>{assert.match(flutterIndicators,/\/api\/indicators/);assert.match(flutterIndicators,/consensus/);assert.doesNotMatch(flutterIndicators,/tenkan|kijun|bollingerUpper|ema\(/i);});

test('flutter consumes shared history and timeframe contracts',()=>{assert.match(flutterHistory,/\/api\/history/);assert.match(flutterHistory,/compare=1/);assert.match(flutterHistory,/TimeframeComparison/);});

test('Ichimoku historical entries and exits are centralized',()=>{assert.match(ichimokuHistory,/buildIchimokuHistoricalSignals/);assert.match(ichimokuHistory,/ACHETER/);assert.match(ichimokuHistory,/VENDRE/);assert.match(ichimokuHistoryRoute,/buildIchimokuHistoricalSignals/);assert.match(flutterIchimoku,/\/api\/ichimoku-history/);assert.doesNotMatch(flutterIchimoku,/midpoint|tenkan|kijun/i);assert.match(flutterShell,/PriceSparkline/);});

test('market sessions are centralized and consumed by Flutter',()=>{assert.match(marketSessions,/BEL20/);assert.match(marketSessions,/indexMarketStatus/);assert.match(marketStatusRoute,/indexMarketStatus/);assert.match(flutterMarketStatus,/\/api\/market-status/);assert.doesNotMatch(flutterMarketStatus,/America\/New_York|Europe\/Brussels|Asia\/Tokyo/);});

test('news source and alert classification are centralized',()=>{assert.match(newsRoute,/loadNewsByAsset/);assert.match(newsAlertsRoute,/loadNewsByAsset/);assert.match(newsAlertsRoute,/buildNewsAlerts/);assert.match(newsAlertEngine,/CRITIQUE/);assert.match(newsAlertEngine,/IMPORTANT/);assert.match(newsSource,/newsForAsset/);assert.match(flutterNewsAlerts,/\/api\/news-alerts/);assert.match(flutterShell,/NewsAlertsView/);assert.match(webNotifications,/\/api\/news-alerts/);});

test('sync manifest publishes contract version and endpoints',()=>{assert.match(manifest,/schemaVersion:'1\.3\.0'/);for(const endpoint of ['/api/scanner','/api/history','/api/indicators','/api/ichimoku-history','/api/market-status','/api/news','/api/news-alerts','/api/notifications/capabilities'])assert.match(manifest,new RegExp(endpoint.replaceAll('/','\\/')));});
