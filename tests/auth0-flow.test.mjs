import test, { after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const vite = await createServer({
  configFile: false, appType: 'custom', root,
  resolve: { alias: { '@': root } },
  ssr: { noExternal: ['next'] },
  server: { middlewareMode: true, hmr: false, watch: null },
  plugins: [{ name: 'auth0-flow-fixtures', enforce: 'pre',
    resolveId(id, importer) {
      if (id === 'next/headers') return '\0headers-fixture';
      if (id === 'next/navigation') return '\0navigation-fixture';
      if (id === './auth0' && importer?.endsWith('/lib/user-identity.ts')) return '\0auth0-fixture';
    },
    load(id) {
      if (id === '\0headers-fixture') return 'export async function headers(){return globalThis.__authHeaders}';
      if (id === '\0navigation-fixture') return 'export function redirect(url){throw new Error("redirect:"+url)}';
      if (id === '\0auth0-fixture') return 'export function getAuth0Client(){return {getSession:async()=>globalThis.__authSession}}';
    },
  }],
});
const identity = await vite.ssrLoadModule('/lib/user-identity.ts');
const routes = await vite.ssrLoadModule('/app/chatgpt-auth.ts');
const keys = ['VERCEL','AUTH0_DOMAIN','AUTH0_CLIENT_ID','AUTH0_CLIENT_SECRET','AUTH0_SECRET','MOBILE_SESSION_SECRET'];
const saved = Object.fromEntries(keys.map(key => [key, process.env[key]]));
beforeEach(() => {
  process.env.VERCEL = '1';
  for (const key of keys.slice(1)) process.env[key] = 'local-test-placeholder';
  globalThis.__authHeaders = new Headers();
  globalThis.__authSession = null;
});
afterEach(() => {
  for (const key of keys) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  delete globalThis.__authHeaders;
  delete globalThis.__authSession;
});
after(() => vite.close());

test('public identity headers never authenticate a Vercel request', async () => {
  globalThis.__authHeaders.set('oai-authenticated-user-email', 'owner@example.test');
  assert.equal(await identity.getSharedUserIdentity(), null);
  assert.equal(await routes.getChatGPTUser(), null);
});

test('only a verified Auth0 email resolves to a stable user identity', async () => {
  const user = { sub: 'auth0|fixture', email: 'user@example.test', name: 'Fixture', email_verified: false };
  globalThis.__authSession = { user };
  assert.equal(await identity.getSharedUserIdentity(), null);
  user.email_verified = true;
  assert.deepEqual(await identity.getSharedUserIdentity(), {
    id: 'auth0:auth0|fixture', email: user.email, displayName: 'Fixture', source: 'auth0',
  });
});

test('malformed, tampered and expired mobile tokens fail closed', async () => {
  for (const token of ['invalid', 'abc.!!!', 'abc.def.extra']) {
    globalThis.__authHeaders.set('authorization', `Bearer ${token}`);
    assert.equal(await identity.getSharedUserIdentity(), null);
  }
  const user = { id: 'auth0:fixture', email: 'fixture@example.test', displayName: 'Fixture', source: 'auth0' };
  const expired = await identity.createMobileSessionToken(user, -10);
  globalThis.__authHeaders.set('authorization', `Bearer ${expired.token}`);
  assert.equal(await identity.getSharedUserIdentity(), null);
  const valid = await identity.createMobileSessionToken(user, 60);
  globalThis.__authHeaders.set('authorization', `Bearer ${valid.token}`);
  assert.equal((await identity.getSharedUserIdentity()).id, user.id);
});

test('login and signup preserve a private destination and reject redirect loops', () => {
  const target = '/journal?asset=BTCUSDT';
  assert.equal(routes.chatGPTSignInPath(target), `/auth/login?returnTo=${encodeURIComponent(target)}`);
  assert.equal(routes.auth0SignUpPath(target), `/auth/login?screen_hint=signup&returnTo=${encodeURIComponent(target)}`);
  for (const unsafe of ['https://other.example', '//other.example', '/\\other.example', '/auth/login', '/auth/logout', '/auth/callback', '/sign-in']) {
    assert.equal(routes.chatGPTSignInPath(unsafe), '/auth/login?returnTo=%2F');
  }
});

test('logout delegates the absolute return URL to the Auth0 SDK', () => {
  assert.equal(routes.chatGPTSignOutPath('/'), '/auth/logout');
  assert.equal(routes.chatGPTSignOutPath('https://other.example'), '/auth/logout');
});
