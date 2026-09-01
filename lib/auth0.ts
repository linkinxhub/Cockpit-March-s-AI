import { Auth0Client } from '@auth0/nextjs-auth0/server';

let client: Auth0Client | null = null;

export function auth0Configured() {
  return Boolean(
    process.env.AUTH0_DOMAIN &&
      process.env.AUTH0_CLIENT_ID &&
      process.env.AUTH0_CLIENT_SECRET &&
      process.env.AUTH0_SECRET,
  );
}

export function getAuth0Client() {
  if (!auth0Configured()) throw new Error('auth0_not_configured');
  client ??= new Auth0Client();
  return client;
}
