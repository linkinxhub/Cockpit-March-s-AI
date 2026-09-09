const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
function compile(file,deps={}){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(n=>{if(n in deps)return deps[n];return require(n);},m,m.exports);return m.exports;}
const http=compile('lib/account-request.ts');
function req(value,origin='https://app.test'){return new Request('https://app.test/api/account/profile',{method:'PATCH',headers:{origin,'content-type':'application/json'},body:typeof value==='string'?value:JSON.stringify(value)});}
test('cross-origin writes and invalid JSON are rejected',async()=>{await assert.rejects(http.readAccountJson(req({},'https://evil.test')),e=>e.status===403);await assert.rejects(http.readAccountJson(req('{')),e=>e.status===400);await assert.rejects(http.readAccountJson(new Request('https://app.test/api/account',{method:'PUT',body:'{}'})),e=>e.status===415);});
test('byte limit applies to streamed multibyte input, valid backups remain intact',async()=>{await assert.rejects(http.readAccountJson(req({value:'é'.repeat(2100)})),e=>e.status===413);const state={favorites:['BTC'],profile:{risk:'balanced'},journal:[]};assert.deepEqual(await http.readAccountJson(req(state),100000),state);});
test('profile cannot grant a role or write another account',async()=>{
 let writes=[];const isSites=fs.readFileSync('app/api/account/profile/route.ts','utf8').includes('getCurrentAccount');
 const user={identity:{email:'self@test.example'},membership:{accountStatus:'active'},db:{update:()=>({set:value=>({where:async filter=>{writes.push({value,filter});}})})}};
 let allowed=true;
 const deps=isSites?{'@/db/schema':{users:{email:'email'}},'drizzle-orm':{eq:(key,id)=>id},'@/lib/current-account':{getCurrentAccount:async()=>allowed?user:null}}:{'@/lib/access-control':{authorizeApiRequest:async()=>allowed?{context:{membership:{userId:'self'}}}:{response:Response.json({},{status:401})}},'@/lib/account-store':{updateOwnProfile:async(id,value)=>{writes.push({id,value});return value;}}};
 const route=compile('app/api/account/profile/route.ts',{...deps,'@/lib/account-request':http});
 const valid=isSites?{displayName:'My name'}:{displayName:'My name',locale:'fr',avatarUrl:null};
 allowed=false;assert.equal((await route.PATCH(req(valid))).status,401);assert.equal(writes.length,0);allowed=true;
 assert.equal((await route.PATCH(req({...valid,role:'admin',userId:'victim'}))).status,400);assert.equal(writes.length,0);
 assert.equal((await route.PATCH(req(valid,'https://evil.test'))).status,403);assert.equal(writes.length,0);
 assert.equal((await route.PATCH(req(valid))).status,200);assert.equal(writes.length,1);assert.equal(isSites?writes[0].filter:writes[0].id,isSites?'self@test.example':'self');
 if(isSites){user.membership.accountStatus='suspended';assert.equal((await route.PATCH(req(valid))).status,403);assert.equal(writes.length,1);}
 else{assert.equal((await route.PATCH(req({...valid,avatarUrl:'javascript:alert(1)'}))).status,400);assert.equal(writes.length,1);}
});
