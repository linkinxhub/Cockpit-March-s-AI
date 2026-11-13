import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const route = readFileSync(new URL('../app/api/ai-analysis/route.ts', import.meta.url), 'utf8');
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
test('deep mode preserves server entitlement and quota', () => {
  assert.match(route, /authorizeFeatureApi\("AI_INSTANT_ANALYSIS"\)/);
  assert.match(route, /reserveAIAllowance\(\)/);
  assert.match(route, /refundAIAllowance\(reservation\)/);
  assert.match(route, /body\?\.mode === "deep"/);
});
test('deep mode uses research tool and structured verdict', () => {
  assert.match(route, /web_search_preview/);
  assert.match(route, /z\.enum\(\["ACHETER", "VENDRE", "ATTENDRE"\]\)/);
  assert.match(route, /url\.protocol === "https:"/);
});
test('UI sends current asset and time frame without executing trades', () => {
  assert.match(page, /mode: "deep", locale: language, timeframe/);
  assert.match(page, /symbol: active\.symbol/);
  assert.match(page, /aucun ordre n'est exécuté/);
});
