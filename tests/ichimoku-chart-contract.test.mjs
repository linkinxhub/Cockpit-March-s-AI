import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';

const page=fs.readFileSync('app/page.tsx','utf8');

test('Ichimoku mixed chart uses a bounded recent visible Y domain',()=>{
 assert.match(page,/focusData = visibleData\.slice\(-48\)/);
 assert.match(page,/axisValues = focusData\.flatMap/);
 assert.match(page,/yDomain:\[number,number\]/);
 assert.match(page,/domain=\{technicalStudy\.yDomain\}/);
 assert.match(page,/allowDataOverflow/);
});

test('off-range historical signal markers cannot stretch the Ichimoku axis',()=>{
 for(const key of['buySignalPrice','sellSignalPrice','exitSignalPrice'])assert.match(page,new RegExp(`${key}:[^\\n]+yDomain\\[0\\][^\\n]+yDomain\\[1\\]`));
 assert.match(page,/signal\.price >= yDomain\[0\] && signal\.price <= yDomain\[1\]/);
});
