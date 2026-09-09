import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";
import ts from "typescript";
const root = fileURLToPath(new URL("..", import.meta.url));
const vite = await createServer({appType:"custom", configFile:false, root, resolve:{alias:{"@":root}}, server:{middlewareMode:true}});
after(()=>vite.close());
const {DiscoveryView} = await vite.ssrLoadModule("/app/decouvrir/discovery.tsx");
const {discoveryTranslations,discoveryText} = await vite.ssrLoadModule("/app/decouvrir/translations.ts");
for (const [language,headline,play,question] of [
  ["fr","Votre décision.","Lire la démonstration","Les cours sont-ils toujours en temps réel ?"],
  ["en","Your decision.","Play demonstration","Are prices always real time?"],
  ["de","Ihre Entscheidung.","Demonstration abspielen","Sind die Kurse immer in Echtzeit?"],
  ["nl","Uw beslissing.","Demonstratie afspelen","Zijn de koersen altijd realtime?"],
]) test(`renders the complete discovery page in ${language}`,()=>{
  const html=renderToStaticMarkup(React.createElement(DiscoveryView,{language,setLanguage:()=>{}}));
  for(const text of [headline,play,question]) assert.ok(html.includes(text),text);
  assert.ok(html.includes(`lang="${language}"`));
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.equal((html.match(/aria-label="(?:Français|English|Deutsch|Nederlands)"/g)||[]).length,4);
  assert.ok(html.includes('<table'));
  assert.ok(html.includes('id="demonstration"'));
  assert.ok(html.includes('href="/"'));
  if(language!=="fr") for(const text of ["Plus de clarté.","Exemples pédagogiques","Une prévision peut-elle", "Court terme"]) assert.ok(!html.includes(text),`Untranslated: ${text}`);
});
test("all discovery text and scenario data have three non-empty translations",async()=>{
  const keys=new Set();
  const invariant=new Set(["Bitcoin","EUR / USD","S&P 500"]);
  for(const file of ["discovery.tsx","market-walkthrough.tsx"]){
    const source=await readFile(new URL(`../app/decouvrir/${file}`,import.meta.url),"utf8");
    const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    function collect(n){if(ts.isStringLiteral(n)&&/[A-Za-zÀ-ÿ]/.test(n.text))keys.add(n.text.trim());ts.forEachChild(n,collect);}
    function visit(n){
      if(ts.isCallExpression(n)&&n.expression.getText(ast)==="t")n.arguments.forEach(collect);
      if(ts.isPropertyAssignment(n)&&["label","period","title","text","points","name","rows"].includes(n.name.getText(ast)))collect(n.initializer);
      if(ts.isArrayLiteralExpression(n)&&n.elements.every(x=>ts.isStringLiteral(x)))collect(n);
      ts.forEachChild(n,visit);
    }
    visit(ast);
  }
  for(const key of keys){
    if(invariant.has(key))continue;
    assert.ok(discoveryTranslations[key],`Missing translation: ${key}`);
    assert.equal(discoveryTranslations[key].length,3);
    for(const value of discoveryTranslations[key])assert.ok(value.trim());
  }
  assert.ok(keys.size>130);
  assert.equal(discoveryText(" Votre décision. ","en")," Your decision. ");
});
