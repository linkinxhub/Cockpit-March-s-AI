import{assets}from'@/lib/market-data';
import{authorizeFeatureApi}from'@/lib/access-control';
import{consumeMonthlyUsage,UsageLimitError}from'@/lib/usage-store';

const snapshotAt='2026-08-28T21:22:00.000Z';
const fmp='https://site.financialmodelingprep.com';
const docs='https://docs.bigdata.com/api-rest/introduction';

function fallback(kind:string,symbol:string){
 const context:Record<string,{bias:number;confidence:number;summary:string}>={
  Crypto:{bias:-3,confidence:70,summary:'Le snapshot Bigdata montre BTC à -3,62 % et ETH à -3,39 % sur 1 jour, malgré une progression positive sur 1 mois. Le court terme reste sous pression.'},
  Forex:{bias:0,confidence:62,summary:'Le snapshot Bigdata montre un dollar ferme face à plusieurs devises : EUR/USD -0,61 % et USD/JPY +0,44 % sur 1 jour. Le biais dépend fortement de la paire sélectionnée.'},
  Indices:{bias:-1,confidence:68,summary:'Le snapshot Bigdata montre un marché contrasté : S&P 500 -0,25 %, Nasdaq 100 -0,70 %, DAX +0,60 % et Euro Stoxx 50 +0,78 % sur 1 jour.'},
  Métaux:{bias:-4,confidence:71,summary:'Le snapshot Bigdata montre l’or à -2,88 % et l’argent à -3,49 % sur 1 jour, dans un environnement de rendement américain à 10 ans proche de 4,73 %.'},
  Baromètres:{bias:2,confidence:74,summary:'Le VIX ressort à 14,43, en baisse de 30,15 % sur un mois. La volatilité implicite est contenue, mais les rendements américains restent élevés.'}
 };
 const x=context[kind]||{bias:0,confidence:50,summary:'Aucun contexte Bigdata spécifique n’est disponible pour cet actif.'};
 return{provider:'Bigdata.com',mode:'snapshot',connected:false,asset:symbol,updatedAt:snapshotAt,...x,catalysts:[{title:'Volatilité implicite américaine',detail:'VIX à 14,43 dans le dernier snapshot vérifié.',impact:'Modéré',window:'Court terme',url:fmp},{title:'Rendements du Trésor américain',detail:'10 ans à 4,73 % et 2 ans à 4,34 %.',impact:'Élevé',window:'Macro',url:fmp},{title:'Rotation géographique',detail:'Europe positive alors que plusieurs indices américains terminent en baisse.',impact:'Modéré',window:'1 jour',url:fmp}],risks:['Snapshot daté : vérifier la fraîcheur avant toute décision.','Une annonce politique ou monétaire peut modifier le régime instantanément.'],sources:[{title:'Bigdata.com — documentation API',url:docs},{title:'Financial Modeling Prep via Bigdata.com',url:fmp}]};
}

function readAnswer(raw:string){
 const parts:string[]=[];
 for(const line of raw.split('\n')){if(!line.startsWith('data:'))continue;try{const event=JSON.parse(line.slice(5).trim());const tag=String(event.type||event.event||event.name||'').toUpperCase();if(tag.includes('ANSWER')){const value=event.content??event.text??event.delta??event.data;if(typeof value==='string')parts.push(value);else if(value)parts.push(JSON.stringify(value))}}catch{}}
 return parts.join('');
}

export async function GET(req:Request){
 const access=await authorizeFeatureApi('AI_INSTANT_ANALYSIS');if(access.response)return access.response;
 const url=new URL(req.url),key=url.searchParams.get('asset')||'',period=url.searchParams.get('period')||'1d',asset=assets.find(a=>a.key===key);
 if(!asset)return Response.json({error:'Actif invalide'},{status:400});
 const apiKey=process.env.BIGDATA_API_KEY;
 if(!apiKey)return Response.json(fallback(asset.kind,asset.symbol),{headers:{'Cache-Control':'public, max-age=900'}});
 try{await consumeMonthlyUsage('AI_INSTANT_ANALYSIS',access.context.membership)}catch(error){if(error instanceof UsageLimitError)return Response.json({error:'usage_limit_reached',feature:error.feature,used:error.used,limit:error.limit,resetAt:error.resetAt},{status:429});throw error}
 try{
  const message=`Analyse ${asset.symbol} (${asset.kind}) pour l'horizon ${period}. Retourne uniquement un objet JSON avec: bias entier de -8 à 8, confidence de 0 à 100, summary en français (2 phrases), catalysts (maximum 3 objets title, detail, impact, window, url), risks (maximum 3 chaînes), sources (objets title,url). Utilise des faits récents, distingue faits et inférences, et n'invente aucune source.`;
  const response=await fetch('https://agents.bigdata.com/v1/research-agent',{method:'POST',headers:{'X-API-KEY':apiKey,'Content-Type':'application/json'},body:JSON.stringify({message,research_effort:'lite'}),signal:AbortSignal.timeout(50_000)});
  if(!response.ok)throw new Error('Bigdata indisponible');
  const answer=readAnswer(await response.text()),match=answer.match(/\{[\s\S]*\}/);
  if(!match)throw new Error('Réponse incomplète');
  const parsed=JSON.parse(match[0]);
  return Response.json({...fallback(asset.kind,asset.symbol),...parsed,provider:'Bigdata.com',mode:'live',connected:true,asset:asset.symbol,updatedAt:new Date().toISOString()},{headers:{'Cache-Control':'public, max-age=600'}});
 }catch{return Response.json({...fallback(asset.kind,asset.symbol),mode:'snapshot-fallback',error:'Analyse directe temporairement indisponible'},{headers:{'Cache-Control':'public, max-age=300'}})}
}
