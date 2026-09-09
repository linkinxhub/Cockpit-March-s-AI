const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file) {
  const module = { exports: {} };
  new Function('require', 'module', 'exports', ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText)(require, module, module.exports);
  return module.exports;
}
const { compareHorizons, latestComparableSnapshot, observedPriceChange, snapshotReady } = load('lib/analysis-journey.ts');
const { journeyCopy, readingLabel, periodLabel } = load('lib/journey-copy.ts');

test('short declines and long rises remain an explicit divergence, regardless of input order', () => {
  const result = compareHorizons([{ period: '1w', decision: 'ACHETER' }, { period: '1h', decision: 'VENDRE' }, { period: '1d', decision: 'ATTENDRE' }]);
  assert.equal(result.state, 'opposed');
  assert.equal(result.shortest.period, '1h');
  assert.equal(result.longest.period, '1w');
});
test('waiting and unavailable readings never manufacture a directional agreement', () => {
  assert.equal(compareHorizons([{ period: '1h', decision: 'ACHETER' }, { period: '1d', decision: 'ATTENDRE' }]).state, 'mixed');
  assert.equal(compareHorizons([{ period: '1h', decision: 'ACHETER' }, { period: '1d', decision: 'INDISPONIBLE' }]).state, 'insufficient');
  assert.equal(compareHorizons([{ period: '1d', decision: 'ATTENDRE' }, { period: '1w', decision: 'ATTENDRE' }]).state, 'aligned');
});
test('duplicate and conflicting periods cannot count as independent evidence', () => {
  assert.equal(compareHorizons([{ period: '1h', decision: 'ACHETER' }, { period: '1h', decision: 'ACHETER' }]).state, 'insufficient');
  assert.equal(compareHorizons([{ period: '1h', decision: 'ACHETER' }, { period: '1h', decision: 'VENDRE' }, { period: '1d', decision: 'ACHETER' }]).state, 'insufficient');
});
const now = Date.parse('2026-09-09T10:00:00Z');
const snapshot = { sourceVersion: 2, assetKey: 'BTCUSD', symbol: 'BTC/USD', period: '1h', engine: 'technical:v1', decision: 'ACHETER', price: 100, recordedAtIso: '2026-09-09T09:00:00Z' };
const context = { assetKey: 'BTCUSD', period: '1h', engine: 'technical:v1' };
test('historical comparison isolates asset, timeframe, method and valid capture date', () => {
  const invalid = [
    { ...snapshot, assetKey: 'ETHUSD' }, { ...snapshot, period: '1w' }, { ...snapshot, engine: 'ai:model-x' },
    { ...snapshot, sourceVersion: undefined }, { ...snapshot, recordedAtIso: 'not-a-date' },
    { ...snapshot, recordedAtIso: '2026-09-10T09:00:00Z' }, { ...snapshot, price: NaN },
  ];
  assert.equal(latestComparableSnapshot(invalid, context, now), null);
  assert.equal(latestComparableSnapshot([...invalid, snapshot], context, now), snapshot);
});
test('latest comparison uses recording time rather than the incoming array order', () => {
  const latest = { ...snapshot, recordedAtIso: '2026-09-09T09:30:00Z' };
  assert.equal(latestComparableSnapshot([snapshot, latest], context, now), latest);
});
test('no snapshot can be taken during loading or from unavailable, stale or invalid readings', () => {
  const valid = { unavailable: false, last: 100, decision: 'ACHETER' };
  assert.equal(snapshotReady(valid, false), true);
  assert.equal(snapshotReady(valid, true), false);
  for (const row of [null, { ...valid, unavailable: true }, { ...valid, stale: true }, { ...valid, last: null }, { ...valid, last: NaN }, { ...valid, last: 0 }, { ...valid, decision: 'INDISPONIBLE' }]) assert.equal(snapshotReady(row, false), false);
});
test('observed movement does not treat missing or zero prices as a financial result', () => {
  assert(Math.abs(observedPriceChange(100, 110) - 10) < 1e-10);
  assert.equal(observedPriceChange(null, 110), null);
  assert.equal(observedPriceChange(0, 110), null);
  assert.equal(observedPriceChange(100, NaN), null);
});
test('all supported languages provide the same complete journey and localized readings', () => {
  for (const lang of ['fr', 'en', 'de', 'nl']) {
    assert.deepEqual(Object.keys(journeyCopy[lang]).sort(), Object.keys(journeyCopy.fr).sort());
    assert(Object.values(journeyCopy[lang]).every(text => typeof text === 'string' && text.trim()));
    assert.notEqual(readingLabel('ACHETER', lang), 'ACHETER');
    assert.notEqual(periodLabel('1w', lang), '1w');
  }
});
