import fs from'node:fs';
const path='mobile/lib/app_shell.dart';let s=fs.readFileSync(path,'utf8');
const marker='})]));}\n}\n\nclass IndicatorsView';
if(!s.includes(marker))throw new Error('Expected extra AssetDetail closing brace not found');
s=s.replace(marker,'})]));}\n\nclass IndicatorsView');
fs.writeFileSync(path,s);console.log('Removed extra Flutter shell brace.');
