import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page=fs.readFileSync('app/page.tsx','utf8');

test('main cockpit favorites use the shared Neon watchlist contract',()=>{
 assert.match(page,/\/api\/user-sync\/snapshot/);
 assert.match(page,/\/api\/user-sync\/watchlist/);
 assert.match(page,/method:\s*"PUT"/);
 assert.match(page,/assetKeys:\s*next/);
 assert.doesNotMatch(page,/localStorage\.(getItem|setItem)\("cockpit-favorites"/);
});
