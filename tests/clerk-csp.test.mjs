import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

// Execute the actual Next configuration without requiring Next's build loader.
const { outputText } = ts.transpileModule(fs.readFileSync('next.config.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { contentSecurityPolicy, default: config } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);
const key = (host, type = 'test') => `pk_${type}_${Buffer.from(`${host}$`).toString('base64').replace(/=+$/, '')}`;
const directives = policy => new Map(policy.split(';').filter(p => p.trim()).map(p => {
  const [name, ...sources] = p.trim().split(/\s+/);
  return [name, sources];
}));

test('the emitted page header permits its configured Clerk script origin', async () => {
  const previous = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  try {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = key('fair-beagle-5601.clerk.accounts.dev');
    const routes = await config.headers();
    const header = routes[0].headers.find(h => h.key === 'Content-Security-Policy');
    const sources = directives(header.value).get('script-src');
    const script = new URL('https://fair-beagle-5601.clerk.accounts.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js');
    assert.ok(sources.includes(script.origin));
    assert.ok(sources.includes("'self'"));
    for (const broad of ['https:', 'http:', '*', "'unsafe-eval'"]) assert.ok(!sources.includes(broad));
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    else process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = previous;
  }
});

test('custom production instances and Clerk challenges have the required directives', () => {
  const csp = directives(contentSecurityPolicy(key('clerk.cockpit.example', 'live')));
  assert.ok(csp.get('script-src').includes('https://clerk.cockpit.example'));
  for (const directive of ['script-src', 'frame-src']) {
    assert.ok(csp.get(directive).includes('https://challenges.cloudflare.com'));
    assert.ok(csp.get(directive).includes('https://*.protect.clerk.com'));
  }
  assert.ok(csp.get('connect-src').includes('https://*.protect.clerk.com:*'));
  assert.deepEqual(csp.get('worker-src'), ["'self'", 'blob:']);
  assert.ok(csp.get('frame-src').includes('https://*.stripe.com'));
  assert.deepEqual(csp.get('object-src'), ["'none'"]);
});

test('builds without Clerk retain the original restrictive script policy', () => {
  const csp = directives(contentSecurityPolicy());
  assert.deepEqual(csp.get('script-src'), ["'self'", "'unsafe-inline'"]);
  assert.deepEqual(csp.get('form-action'), ["'self'"]);
});

test('malformed keys cannot inject sources or directives', () => {
  for (const value of ['invalid', key('clerk.example; script-src *'), key('clerk.example/path'), key('clerk.example:443')]) {
    assert.throws(() => contentSecurityPolicy(value), /Invalid Clerk publishable key/);
  }
});
