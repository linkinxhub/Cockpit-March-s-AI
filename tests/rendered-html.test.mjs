import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
test("renders production metadata without development markers", async () => {
 const html = await readFile(new URL("../.next/server/app/pricing.html", import.meta.url), "utf8");
 assert.match(html, /<title>Cockpit Marchés AI<\/title>/i);
 assert.match(html, /Scanner éducatif pour cryptomonnaies, Forex et indices\./i);
 assert.doesNotMatch(html, /codex-preview/i);
 assert.match(html, /Navigation principale/);
});
