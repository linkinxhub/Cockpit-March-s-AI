import { releaseManifest } from '@/lib/releases';
export const dynamic = 'force-dynamic';
export async function GET() {
  return Response.json(releaseManifest, {headers:{'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'}});
}
