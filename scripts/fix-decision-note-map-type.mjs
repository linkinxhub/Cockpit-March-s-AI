import fs from 'node:fs';
const path='app/page.tsx';
let source=fs.readFileSync(path,'utf8');
const before='? payload.notes.map((item) => ({';
const after='? payload.notes.map((item: { id: unknown; text?: unknown; assetKey?: unknown; createdAt?: unknown }) => ({';
if(!source.includes(before))throw new Error('Expected decision note map fragment not found');
source=source.replace(before,after);
fs.writeFileSync(path,source);
console.log('Decision note map parameter typed.');
