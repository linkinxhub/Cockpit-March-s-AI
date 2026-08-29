import{assets,chartPeriods,history,type ChartPeriod}from'@/lib/market-data';
import{buildIchimokuHistoricalSignals}from'@/lib/ichimoku-history';

export async function GET(req:Request){
  const url=new URL(req.url),key=url.searchParams.get('symbol')||'',period=(url.searchParams.get('period')||'1d')as ChartPeriod;
  if(!assets.some(a=>a.key===key))return Response.json({error:'Symbole invalide'},{status:400});
  if(!(period in chartPeriods))return Response.json({error:'Période invalide'},{status:400});
  try{
    const points=await history(key,period),signals=buildIchimokuHistoricalSignals(points);
    return Response.json({symbol:key,period,signals,updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'public, max-age=60'}});
  }catch{return Response.json({error:'Historique indisponible'},{status:503});}
}
