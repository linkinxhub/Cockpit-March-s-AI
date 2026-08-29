import{loadNewsByAsset}from'@/lib/news-source';
export async function GET(){const byAsset=await loadNewsByAsset();return Response.json({byAsset,updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'public, max-age=300'}})}
