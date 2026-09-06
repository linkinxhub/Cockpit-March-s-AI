import { NextResponse } from 'next/server';
import { safeRelativeReturnPath } from '../app/chatgpt-auth';

type CallbackContext = { returnTo?: string; appBaseUrl?: string };
type AuthFailure = { code?: unknown; cause?: { code?: unknown; message?: unknown } };

export function authFailureReason(error: unknown) {
  const failure = error as AuthFailure | null;
  const code = failure?.code;
  if (code === 'invalid_state' || code === 'missing_state') return 'session_expired';
  const cause = failure?.cause;
  if (code === 'authorization_error' && typeof cause?.message === 'string' &&
      /failed to fetch user profile/i.test(cause.message)) return 'provider_unavailable';
  if (cause?.code === 'access_denied') return 'access_denied';
  return 'connection_failed';
}

export async function onAuth0Callback(error: unknown, context: CallbackContext) {
  const returnTo = safeRelativeReturnPath(context.returnTo || '/');
  if (error) {
    const reason = authFailureReason(error);
    // Never log the provider response, callback query, tokens or personal data.
    console.error('auth0_callback_failed', { reason });
    const params = new URLSearchParams({ reason, returnTo });
    return new NextResponse(null, {
      status: 303,
      headers: { Location: `/auth-error?${params}`, 'Cache-Control': 'no-store' },
    });
  }
  // Keep the redirect on the host that owns the transaction cookie. The SDK
  // completes session storage and transaction cleanup after this hook returns.
  return new NextResponse(null, {
    status: 303,
    headers: { Location: returnTo, 'Cache-Control': 'no-store' },
  });
}
