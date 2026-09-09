export class AccountRequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function readAccountJson(request: Request, limit = 4096): Promise<unknown> {
  const origin = request.headers.get('origin');
  if (request.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== new URL(request.url).origin))
    throw new AccountRequestError(403, 'invalid_origin');
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json'))
    throw new AccountRequestError(415, 'json_required');
  const reader = request.body?.getReader();
  if (!reader) throw new AccountRequestError(400, 'invalid_json');
  const chunks: Uint8Array[] = []; let length = 0;
  try {
    while (true) {
      const {done,value} = await reader.read(); if (done) break;
      length += value.byteLength;
      if (length > limit) { await reader.cancel(); throw new AccountRequestError(413, 'payload_too_large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  try { return JSON.parse(new TextDecoder().decode(bytes)); }
  catch { throw new AccountRequestError(400, 'invalid_json'); }
}
