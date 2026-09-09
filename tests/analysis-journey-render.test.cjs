const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const cache = new Map();
function localModule(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText;
  const resolve = name => {
    if (name.endsWith('.css')) return {};
    if (!name.startsWith('@/') && !name.startsWith('.')) return require(name);
    const base = name.startsWith('@/') ? path.resolve(name.slice(2)) : path.resolve(path.dirname(file), name);
    const target = ['.ts', '.tsx'].map(extension => base + extension).find(filename => fs.existsSync(filename));
    return localModule(target);
  };
  new Function('require', 'module', 'exports', source)(resolve, module, module.exports);
  return module.exports;
}
const Journey = localModule(path.resolve('components/analysis-journey.tsx')).default;
const props = { language: 'fr', symbol: 'BTC/USD', period: '1h', decision: 'ACHETER', busy: false, ready: true,
  stale: false, source: 'VERIFIED_SOURCE', dataUpdatedAt: 1788944400000, ai: false, price: 100,
  comparisons: [], comparisonsBusy: false, previous: null, favorite: false,
  access: { compare: false, alert: false, journal: false, passport: false }, onAction() {},
};
const render = extra => renderToStaticMarkup(React.createElement(Journey, { ...props, ...extra }));
test('the entry step exposes three accessible tabs and the source for the selected reading', () => {
  const html = render({});
  assert.equal((html.match(/role="tab"/g) || []).length, 3);
  assert(html.includes('VERIFIED_SOURCE'));
  assert(html.includes('Orientation haussière'));
  assert(html.includes('Ce n’est pas une probabilité de gain.'));
});
test('unavailable or loading selections hide the previous orientation and evidence', () => {
  for (const state of [{ ready: false, busy: true }, { ready: false, stale: true }, { ready: false }]) {
    const html = render(state);
    assert(!html.includes('Orientation haussière'));
    assert(!html.includes('VERIFIED_SOURCE'));
  }
});
test('source values are escaped and the four language variants render', () => {
  assert(!render({ source: '<script>unsafe()</script>' }).includes('<script>'));
  for (const language of ['fr', 'en', 'de', 'nl']) assert(render({ language }).includes('role="tablist"'));
});
