const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
function compile(file,deps={}){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(n=>{if(n in deps)return deps[n];throw Error(n)},m,m.exports);return m.exports;}
const policy=compile('lib/market-pack-policy.ts');
const assets=['Crypto','Indices','Forex','Métaux','Baromètres'].flatMap(kind=>Array.from({length:6},(_,i)=>({kind,key:kind+i})));
test('Discovery includes exactly twelve assets across all five markets',()=>{const selection=policy.discoveryAssets(assets);assert.equal(selection.length,12);assert.equal(new Set(selection.map(x=>x.key)).size,12);assert.deepEqual(Object.fromEntries(['Crypto','Indices','Forex','Métaux','Baromètres'].map(k=>[k,selection.filter(x=>x.kind===k).length])),{Crypto:3,Indices:3,Forex:3,'Métaux':2,'Baromètres':1});});
test('history blocks premium symbols, periods and comparisons before fetching data',async()=>{
 let full=false,calls=0;
 const market={assets,chartPeriods:{'1d':{},'1h':{},'1w':{},'15m':{}},history:async()=>{calls++;return[]},timeframeSnapshot:()=>({points:[]})};
 const site=fs.existsSync('lib/market-pack-access.ts');
 const deps={'@/lib/market-pack-policy':policy,'@/lib/market-data':market,...(site?{'@/lib/market-pack-access':{marketPackAccess:async()=>({allAssets:full,advanced:full})}}:{'@/lib/access-control':{authorizeApiRequest:async()=>({context:{membership:{}}})},'@/lib/entitlements':{canAccess:()=>full}})};
 const route=compile('app/api/history/route.ts',deps);
 const get=q=>route.GET(new Request('https://app.test/api/history?'+q));
 for(const query of ['symbol=Indices5&period=1d','symbol=Crypto0&period=15m','symbol=Crypto0&period=1d&compare=1'])assert.equal((await get(query)).status,403);
 assert.equal(calls,0);assert.equal((await get('symbol=Indices0&period=1d')).status,200);assert.equal(calls,1);
 full=true;assert.equal((await get('symbol=Indices5&period=15m')).status,200);assert.equal(calls,2);
});
