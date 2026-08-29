import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const workflow = fs.readFileSync('.github/workflows/manual-vercel-preview.yml', 'utf8');

test('Flutter sync branch does not auto-deploy to Vercel', () => {
  assert.equal(config.git?.deploymentEnabled?.['feat/flutter-mobile-sync'], false);
  assert.notEqual(config.git?.deploymentEnabled?.main, false);
  assert.equal(config.framework, 'nextjs');
});

test('manual preview is explicit and prebuilt', () => {
  assert.match(workflow, /workflow_dispatch/);
  assert.match(workflow, /DEPLOY_PREVIEW/);
  assert.match(workflow, /secrets\.VERCEL_TOKEN/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /vercel@latest build/);
  assert.match(workflow, /deploy --prebuilt --archive=tgz/);
});
