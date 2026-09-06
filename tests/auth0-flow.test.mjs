import test, { after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { NextRequest, NextResponse } from 'next/server.js';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';

const root = fileURLToPath(new URL('..', import.meta.url));
globalThis.__authNextResponse = NextResponse;
const vite = await createServer({
  configFile: false, appType: 'custom', root,
  resolve: { alias: { '@': root } },
  ssr: { noExternal: ['next'] },
  server: { middlewareMode: true, hmr: false, watch: null },
  plugins: [{ name: 'auth0-flow-fixtures', enforce: 'pre',
    resolveId(id, importer) {
      if (id === 'next/server' || id === 'next/server.js') return '\0native-next-server';
      if (id === 'next/headers') return '\0headers-fixture';
      if (id === 'next/navigation') return '\0navigation-fixture';
      if (id === './auth0' && importer?.endsWith('/lib/user-identity.ts')) return '\0auth0-fixture';
    },
    load(id) {
      if (id === '\0native-next-server') return 'export const NextResponse=globalThis.__authNextResponse';
      if (id === '\0headers-fixture') return 'export async function headers(){return globalThis.__authHeaders}';
      if (id === '\0navigation-fixture') return 'export function redirect(url){throw new Error("redirect:"+url)}';
      if (id === '\0auth0-fixture') return 'export function getAuth0Client(){return {getSession:async()=>globalThis.__authSession}}';
    },
  }],
});
const identity = await vite.ssrLoadModule('/lib/user-identity.ts');
const routes = await vite.ssrLoadModule('/app/chatgpt-auth.ts');
const callback = await vite.ssrLoadModule('/lib/auth0-callback.ts');
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
after(async () => { await vite.close(); delete globalThis.__authNextResponse; });

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

test('failed identity-provider callbacks recover without disclosing provider details', async () => {
  const logs = [];
  const original = console.error;
  console.error = (...args) => logs.push(args);
  try {
    const response = await callback.onAuth0Callback({ code: 'authorization_error', cause: {
      code: 'invalid_request', message: 'InternalOAuthError: failed to fetch user profile (status: 401 token=do-not-log)',
    } }, { returnTo: '/account' });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get('location'), '/auth-error?reason=provider_unavailable&returnTo=%2Faccount');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.doesNotMatch(JSON.stringify(logs), /do-not-log|InternalOAuthError/);
    assert.equal(callback.authFailureReason({ code: 'invalid_state' }), 'session_expired');
    assert.equal(callback.authFailureReason({ cause: { code: 'access_denied' } }), 'access_denied');
    for (const unsafe of ['//attacker.test', '/\\attacker.test', '/auth/login', '/auth-error', 'https://attacker.test']) {
      const redirect = await callback.onAuth0Callback(null, { returnTo: unsafe });
      assert.equal(redirect.headers.get('location'), '/');
    }
  } finally { console.error = original; }
});

test('real Auth0 SDK clears failed transactions and persists a successful session with the recovery hook', async () => {
  const issuer = 'https://fixture.auth0.test/';
  const { privateKey, publicKey } = await generateKeyPair('RS256');
  const jwk = { ...await exportJWK(publicKey), kid: 'fixture-key', alg: 'RS256', use: 'sig' };
  let nonce;
  const client = new Auth0Client({
    domain: 'fixture.auth0.test', appBaseUrl: 'https://app.example.test',
    clientId: 'fixture-client', clientSecret: 'fixture-secret', secret: 'f'.repeat(64),
    onCallback: callback.onAuth0Callback,
    customFetch: async (input) => {
      const url = String(input instanceof Request ? input.url : input);
      if (url.endsWith('/.well-known/openid-configuration')) return Response.json({
        issuer, authorization_endpoint: `${issuer}authorize`, token_endpoint: `${issuer}oauth/token`,
        jwks_uri: `${issuer}.well-known/jwks.json`, response_types_supported: ['code'],
        subject_types_supported: ['public'], id_token_signing_alg_values_supported: ['RS256'],
      });
      if (url.endsWith('/.well-known/jwks.json')) return Response.json({ keys: [jwk] });
      if (url.endsWith('/oauth/token')) {
        const idToken = await new SignJWT({ nonce, email: 'fixture@example.test', email_verified: true })
          .setProtectedHeader({ alg: 'RS256', kid: 'fixture-key' }).setIssuer(issuer)
          .setAudience('fixture-client').setSubject('google-oauth2|fixture').setIssuedAt().setExpirationTime('5m').sign(privateKey);
        return Response.json({ access_token: 'fixture-access-token', token_type: 'Bearer', expires_in: 300, id_token: idToken });
      }
      throw new Error(`Unexpected provider request: ${url}`);
    },
  });
  const login = async () => {
    const response = await client.middleware(new NextRequest('https://app.example.test/auth/login?returnTo=%2Faccount'));
    const target = new URL(response.headers.get('location'));
    nonce = target.searchParams.get('nonce');
    return { state: target.searchParams.get('state'), cookie: response.cookies.getAll().map(c => `${c.name}=${c.value}`).join('; ') };
  };
  const failed = await login();
  const errorParams = new URLSearchParams({ state: failed.state, error: 'invalid_request', error_description: 'failed to fetch user profile (status: 401)' });
  const failedResponse = await client.middleware(new NextRequest(`https://app.example.test/auth/callback?${errorParams}`, { headers: { cookie: failed.cookie } }));
  assert.equal(failedResponse.status, 303);
  assert.match(failedResponse.headers.get('location'), /^\/auth-error\?reason=provider_unavailable/);
  assert.ok(failedResponse.cookies.getAll().some(c => c.name.startsWith('__txn_') && c.value === ''));
  assert.equal(failedResponse.cookies.getAll().some(c => c.name.startsWith('__session') && c.value), false);

  const success = await login();
  const successParams = new URLSearchParams({ state: success.state, code: 'fixture-code' });
  const response = await client.middleware(new NextRequest(`https://app.example.test/auth/callback?${successParams}`, { headers: { cookie: success.cookie } }));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), '/account');
  const sessionCookie = response.cookies.getAll().filter(c => c.value).map(c => `${c.name}=${c.value}`).join('; ');
  const session = await client.getSession(new NextRequest('https://app.example.test/account', { headers: { cookie: sessionCookie } }));
  assert.equal(session.user.sub, 'google-oauth2|fixture');
  assert.equal(session.user.email_verified, true);
});
