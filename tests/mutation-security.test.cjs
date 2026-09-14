const{test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
function compile(file){const m={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(name=>name==='next/headers'?{headers:async()=>new Headers()}:require(name),m,m.exports);return m.exports;}
const security=compile('lib/request-security.ts');
function request(body,headers={}){return new Request('https://app.test/api/user-sync/workspace',{method:'PUT',headers:{origin:'https://app.test','content-type':'application/json',...headers},body:typeof body==='string'?body:JSON.stringify(body)});}

test('cookie mutations require the exact application origin',async()=>{
 await assert.rejects(security.readBoundedJson(request({}, {origin:'https://evil.test'})),error=>error.status===403);
 await assert.rejects(security.readBoundedJson(new Request('https://app.test/api/user-sync/workspace',{method:'PUT',headers:{'content-type':'application/json'},body:'{}'})),error=>error.status===403);
 assert.deepEqual(await security.readBoundedJson(request({ok:true})),{ok:true});
});

test('mobile bearer mutations do not depend on browser Origin',async()=>{
 const bearer=new Request('https://app.test/api/user-sync/workspace',{method:'PUT',headers:{authorization:'Bearer signed.mobile.token','content-type':'application/json'},body:'{"mobile":true}'});
 assert.deepEqual(await security.readBoundedJson(bearer),{mobile:true});
});

test('mutation JSON enforces content type and byte limit',async()=>{
 await assert.rejects(security.readBoundedJson(request('x'.repeat(100)),32),error=>error.status===413);
 const plain=new Request('https://app.test/api/user-sync/workspace',{method:'PUT',headers:{origin:'https://app.test','content-type':'text/plain'},body:'{}'});
 await assert.rejects(security.readBoundedJson(plain),error=>error.status===415);
});
