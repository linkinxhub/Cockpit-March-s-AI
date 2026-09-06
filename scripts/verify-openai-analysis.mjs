// Explicit deployment diagnostic: one real provider call on the repair preview.
// It runs no user/database mutations and never logs credentials or analysis text.
if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_GIT_COMMIT_REF === 'fix/auth0-ai-consolidation') {
  const { createServer } = await import('vite');
  const { fileURLToPath } = await import('node:url');
  const root = fileURLToPath(new URL('..', import.meta.url));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (...args) => {
    const response = await originalFetch(...args);
    if (String(args[0]) === 'https://api.openai.com/v1/responses' && !response.ok) {
      const detail = await response.clone().json().catch(() => ({}));
      const code = String(detail.error?.code || detail.error?.type || 'unknown').replace(/[^A-Z_a-z]/g, '').slice(0, 60);
      console.log(`OpenAI provider status: ${response.status}, ${code}`);
    }
    return response;
  };
  const vite = await createServer({
    configFile: false, appType: 'custom', root,
    resolve: { alias: { '@': root } },
    server: { middlewareMode: true, hmr: false, watch: null },
    plugins: [{ name: 'deployment-provider-diagnostic', enforce: 'pre',
      resolveId(id) {
        if (id.endsWith('/lib/access-control')) return '\0diagnostic-access';
        if (id.endsWith('/lib/usage-store')) return '\0diagnostic-usage';
      },
      load(id) {
        if (id === '\0diagnostic-access') return 'export async function authorizeFeatureApi(){return {context:{identity:{id:"deployment-diagnostic"},membership:{role:"ADMIN"}}}}';
        if (id === '\0diagnostic-usage') return 'export class UsageLimitError extends Error {} export async function consumeMonthlyUsage(){}';
      },
    }],
  });
  try {
    const { POST } = await vite.ssrLoadModule('/app/api/ai-analysis/route.ts');
    const result = await POST(new Request('https://diagnostic.example/api/ai-analysis', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale: 'fr', timeframe: '1d',
        asset: { symbol: 'BTC/USDT', name: 'Synthetic deployment verification fixture', price: 100, decision: 'ATTENDRE' },
        news: [],
      }),
    }));
    const data = await result.json();
    if (!result.ok || !data.analysis?.summary) {
      throw new Error(`OpenAI diagnostic failed: HTTP ${result.status}, ${String(data.code || data.error || 'INVALID_RESPONSE').replace(/[^A-Z_a-z]/g, '').slice(0, 60)}`);
    }
    console.log(`OpenAI diagnostic passed: HTTP ${result.status}, structured analysis validated.`);
  } finally {
    globalThis.fetch = originalFetch;
    await vite.close();
  }
}
