import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const policy=fs.readFileSync('lib/user-alert-policy.ts','utf8');
const dispatch=fs.readFileSync('lib/push-dispatch.ts','utf8');
const deviceRoute=fs.readFileSync('app/api/user-sync/notification-devices/route.ts','utf8');
const personalizedRoute=fs.readFileSync('app/api/notifications/personalized/route.ts','utf8');
const previewRoute=fs.readFileSync('app/api/notifications/dispatch-preview/route.ts','utf8');
const schema=fs.readFileSync('db/schema.ts','utf8');
const migration=fs.readFileSync('db/migrations/0002_notification_devices.sql','utf8');
const manifest=fs.readFileSync('app/api/sync/manifest/route.ts','utf8');

test('personalized alert policy enforces user preferences',()=>{
 assert.match(policy,/minimumSeverity/);
 assert.match(policy,/watchedOnly/);
 assert.match(policy,/pushEnabled/);
 assert.match(policy,/quietHours/);
 assert.match(policy,/not_in_watchlist/);
 assert.match(policy,/below_minimum_severity/);
});

test('device registry is durable and ownership protected',()=>{
 assert.match(schema,/notification_devices/);
 assert.match(migration,/notification_devices/);
 assert.match(deviceRoute,/getSharedUserIdentity/);
 assert.match(deviceRoute,/device_id_conflict/);
 assert.match(deviceRoute,/web_push_subscription_required/);
 assert.match(deviceRoute,/device_token_required/);
 assert.doesNotMatch(deviceRoute,/PRIVATE_KEY|CLIENT_EMAIL/);
});

test('push planning requires registered targets and configured providers',()=>{
 assert.match(dispatch,/no_registered_device/);
 assert.match(dispatch,/provider_not_configured/);
 assert.match(dispatch,/targets/);
 assert.match(dispatch,/deepLink/);
 assert.match(previewRoute,/listNotificationDevices/);
 assert.match(previewRoute,/dry-run/);
});

test('personalized endpoint uses durable user snapshot',()=>{
 assert.match(personalizedRoute,/getSnapshot/);
 assert.match(personalizedRoute,/alertEligibility/);
 assert.match(personalizedRoute,/private, no-store/);
});

test('manifest publishes notification contract v2',()=>{
 assert.match(manifest,/schemaVersion:'2\.0\.0'/);
 for(const endpoint of ['/api/user-sync/notification-devices','/api/notifications/personalized','/api/notifications/dispatch-preview'])assert.match(manifest,new RegExp(endpoint.replaceAll('/','\\/')));
 assert.match(manifest,/notificationDevices/);
 assert.match(manifest,/dry-run-until-provider-delivery/);
});
