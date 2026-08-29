import{loadNewsByAsset}from'@/lib/news-source';
import{buildNewsAlerts,type NewsAlertSeverity}from'@/lib/news-alert-engine';

const allowed=new Set<NewsAlertSeverity>(['INFO','IMPORTANT','CRITIQUE']);
export async function GET(req:Request){
 const url=new URL(req.url),sinceRaw=Number(url.searchParams.get('since')||0),severityRaw=(url.searchParams.get('severity')||'IMPORTANT').toUpperCase() as NewsAlertSeverity,assetsRaw=url.searchParams.get('assets');
 const since=Number.isFinite(sinceRaw)?sinceRaw:0,minSeverity=allowed.has(severityRaw)?severityRaw:'IMPORTANT',assets=assetsRaw?assetsRaw.split(',').map(v=>v.trim()).filter(Boolean):undefined;
 const byAsset=await loadNewsByAsset(),events=buildNewsAlerts(byAsset,{since,minSeverity,assets});
 return Response.json({events,filters:{since,minSeverity,assets:assets??null},updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'public, max-age=120'}});
}
