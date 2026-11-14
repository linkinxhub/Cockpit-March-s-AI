const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function compile(file, deps = {}, fetchImpl) {
  const m = {exports: {}};
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  }).outputText;
  new Function('require', 'module', 'exports', 'fetch', js)(name => {
    if (name in deps) return deps[name];
    throw Error(`Unexpected dependency: ${name}`);
  }, m, m.exports, fetchImpl);
  return m.exports;
}
const context = compile('lib/analysis-context.ts');
const {AIQuotaError} = compile('lib/ai-allowance-types.ts');
const analysis = {decision:'ATTENDRE',confidence:45,summary:'Signaux mitigés.',drivers:['Tendance'],risks:['Volatilité'],invalidation:'Cassure',horizon:'1 mois',disclaimer:'Capital à risque.'};
const source = {url:'https://example.com/market',title:'Marché'};
const result = () => ({status:'completed',output_text:JSON.stringify(analysis),output:[{type:'web_search_call',status:'completed',action:{sources:[source]}}]});
function harness({status=200, data=result(), denied, quota=false, failure} = {}) {
  const calls = {reserve:0,refund:0,provider:0,settings:0};
  const reservation = {id:'test',start:1};
  const route = compile('app/api/ai-analysis/route.ts', {
    '@/lib/analysis-context':context,
    '@/lib/market-data':{chartPeriods:{'1mo':{}}},
    '@/lib/ai-allowance-types':{AIQuotaError},
    '@/lib/access-control':{authorizeFeatureApi:async()=>denied ? {response:Response.json({error:denied===401?'authentication_required':'entitlement_required'},{status:denied})} : {context:{identity:{id:'test-user'}}}},
    '@/lib/ai-settings':{getAICredentials:async()=>{calls.settings++;return {apiKey:'test-placeholder',model:'test-model'};}},
    '@/lib/ai-allowance':{
      reserveAIAllowance:async()=>{calls.reserve++;if(quota)throw new AIQuotaError(5,5,123);return reservation;},
      refundAIAllowance:async r=>{assert.equal(r,reservation);calls.refund++;},
    },
    'next/server':{NextResponse:Response},zod:require('zod'),
  }, async(url,options)=>{calls.provider++;calls.url=url;calls.payload=JSON.parse(options.body);if(failure)throw failure;return Response.json(data,{status});});
  return {calls, post:(overrides={})=>route.POST(new Request('https://app.test/api/ai-analysis',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'deep',locale:'fr',timeframe:'1mo',asset:{symbol:'BTC/EUR',price:90000},...overrides})}))};
}

test('deep BTC/EUR 1 month sends web search and returns verified sources with one charge',async()=>{
  const h=harness(),r=await h.post(),body=await r.json();
  assert.equal(r.status,200);assert.equal(r.headers.get('Cache-Control'),'no-store');
  assert.deepEqual(body.analysis.sources,[source]);assert.equal(body.mode,'deep');
  assert.equal(h.calls.reserve,1);assert.equal(h.calls.refund,0);assert.equal(h.calls.provider,1);
  assert.equal(h.calls.url,'https://api.openai.com/v1/responses');
  assert.equal(h.calls.payload.store,false);assert.equal(h.calls.payload.tool_choice,'required');
  assert.deepEqual(h.calls.payload.include,['web_search_call.action.sources']);
  const snapshot=JSON.parse(h.calls.payload.input.split('\n').slice(1).join('\n'));
  assert.equal(snapshot.asset.symbol,'BTC/EUR');assert.equal(snapshot.timeframe,'1mo');
});
test('anonymous and denied accounts cannot read credentials, reserve quota or call provider',async()=>{
  for(const denied of [401,403]){const h=harness({denied});assert.equal((await h.post()).status,denied);assert.deepEqual(h.calls,{reserve:0,refund:0,provider:0,settings:0});}
});
test('exhausted quota prevents provider call and does not refund an unreserved use',async()=>{
  const h=harness({quota:true}),r=await h.post();assert.equal(r.status,429);assert.equal((await r.json()).code,'USAGE_LIMIT_REACHED');assert.equal(h.calls.provider,0);assert.equal(h.calls.refund,0);
});
test('missing, unsafe or model-invented sources cannot validate deep research',async()=>{
  for(const output of [[],[{type:'web_search_call',status:'failed',action:{sources:[source]}}],[{type:'web_search_call',status:'completed',action:{sources:[{url:'http://example.com'},{url:'javascript:alert(1)'},{url:'https://user:password@example.com'}]}}]]){
    const h=harness({data:{output,output_text:JSON.stringify({...analysis,sources:[source]})}}),r=await h.post();
    assert.equal(r.status,502);assert.equal((await r.json()).code,'RESEARCH_NOT_VERIFIED');assert.equal(h.calls.refund,1);
  }
});
test('provider errors and timeout return safe codes and refund exactly once',async()=>{
  for(const [status,code] of [[400,'RESEARCH_UNAVAILABLE'],[401,'OPENAI_AUTH_ERROR'],[429,'OPENAI_LIMIT'],[500,'OPENAI_ERROR']]){
    const h=harness({status,data:{error:{message:'private-provider-detail'}}}),r=await h.post();assert.equal((await r.json()).code,code);assert.equal(h.calls.refund,1);
  }
  const h=harness({failure:new DOMException('private-detail','TimeoutError')}),r=await h.post();assert.equal(r.status,504);assert.equal((await r.json()).code,'OPENAI_TIMEOUT');assert.equal(h.calls.refund,1);
});
test('incomplete responses and malformed analyses are rejected and refunded',async()=>{
  for(const data of [{...result(),status:'incomplete'},{...result(),output_text:'invalid JSON'},{...result(),output_text:JSON.stringify({...analysis,confidence:101})}]){
    const h=harness({data}),r=await h.post();assert.equal(r.status,502);assert.equal((await r.json()).code,'OPENAI_ERROR');assert.equal(h.calls.refund,1);
  }
});
test('instant mode remains usable without web sources',async()=>{
  const h=harness({data:{output_text:JSON.stringify(analysis)}}),r=await h.post({mode:'instant'});
  assert.equal(r.status,200);assert.equal(h.calls.payload.tools,undefined);assert.equal(h.calls.refund,0);
});

test('BTC/EUR uses euro providers on both primary and fallback history paths',async()=>{
  const urls=[];
  let fallback=false;
  const market=compile('lib/market-data.ts',{},async url=>{
    urls.push(url);
    const points=Array.from({length:120},(_,i)=>[i*14400000,100,102,99,101]);
    if(url.includes('binance.com'))return fallback ? new Response('',{status:503}) : Response.json(points);
    return Response.json({chart:{result:[{timestamp:points.map(p=>p[0]/1000),indicators:{quote:[{close:points.map(p=>p[4])}]}}]}});
  });
  assert.deepEqual(market.assets.find(a=>a.key==='BTCEUR'),{symbol:'BTC/EUR',key:'BTCEUR',name:'Bitcoin / Euro',kind:'Crypto'});
  assert.equal((await market.history('BTCEUR','1mo')).length,120);
  assert.match(urls[0],/symbol=BTCEUR&interval=4h&limit=186/);
  fallback=true;urls.length=0;
  assert.equal((await market.history('BTCEUR','1mo')).length,120);
  assert.ok(urls.some(url=>url.includes('/chart/BTC-EUR?')));
  assert.ok(urls.every(url=>!url.includes('BTC-USD')&&!url.includes('BTCUSDT')));
  const {discoveryAssets}=compile('lib/market-pack-policy.ts');
  assert.deepEqual(discoveryAssets(market.assets).filter(a=>a.kind==='Crypto').map(a=>a.key),['BTCUSDT','ETHUSDT','BNBUSDT']);
});
