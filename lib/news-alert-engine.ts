export type RawNewsItem={id:string;title:string;publisher:string;link:string;publishedAt:number;thumbnail?:string|null};
export type NewsAlertSeverity='INFO'|'IMPORTANT'|'CRITIQUE';
export type NewsAlertEvent={id:string;assetKey:string;title:string;publisher:string;link:string;publishedAt:number;thumbnail?:string|null;severity:NewsAlertSeverity;reason:string};

const criticalTerms=['fed','fomc','ecb','bce','interest rate','taux','inflation','cpi','employment','jobs report','sec','etf','hack','exploit','bankruptcy','faillite','war','guerre','sanction','tariff','default','liquidation'];
const importantTerms=['earnings','guidance','upgrade','downgrade','partnership','launch','regulation','approval','acquisition','merger','recession','gdp','pib'];

function severityFor(title:string):{severity:NewsAlertSeverity;reason:string}{
 const t=title.toLowerCase();
 const critical=criticalTerms.find(term=>t.includes(term));
 if(critical)return{severity:'CRITIQUE',reason:`Mot-clé sensible détecté : ${critical}`};
 const important=importantTerms.find(term=>t.includes(term));
 if(important)return{severity:'IMPORTANT',reason:`Événement potentiellement significatif : ${important}`};
 return{severity:'INFO',reason:'Actualité de marché'};
}

export function buildNewsAlerts(byAsset:Record<string,RawNewsItem[]>,options?:{since?:number;minSeverity?:NewsAlertSeverity;assets?:string[]}){
 const rank:Record<NewsAlertSeverity,number>={INFO:1,IMPORTANT:2,CRITIQUE:3};
 const since=options?.since??0,min=rank[options?.minSeverity??'INFO'],assets=options?.assets?.length?new Set(options.assets):null;
 const seen=new Set<string>(),events:NewsAlertEvent[]=[];
 for(const [assetKey,items] of Object.entries(byAsset)){
  if(assets&&!assets.has(assetKey))continue;
  for(const item of items){
   if(item.publishedAt<since)continue;
   const dedupeKey=item.id||item.link||`${assetKey}:${item.title}`;
   if(seen.has(dedupeKey))continue;seen.add(dedupeKey);
   const score=severityFor(item.title);if(rank[score.severity]<min)continue;
   events.push({...item,assetKey,severity:score.severity,reason:score.reason});
  }
 }
 return events.sort((a,b)=>b.publishedAt-a.publishedAt);
}
