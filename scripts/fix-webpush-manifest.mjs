import fs from'node:fs';
const p='app/api/sync/manifest/route.ts';let s=fs.readFileSync(p,'utf8');
const from="webPush:'registration-ready-delivery-pending-library'",to="webPush:'server-delivery-ready'";
if(!s.includes(from))throw new Error('Expected Web Push manifest marker not found');
s=s.replace(from,to);
fs.writeFileSync(p,s);
