import fs from'node:fs';
const p='tests/sync-contract.test.mjs';let s=fs.readFileSync(p,'utf8');
const replacements=[
["flutterWorkspace=read('mobile/lib/features/sync/data/user_workspace_repository.dart')","flutterWorkspace=read('mobile/lib/features/sync/data/user_workspace_repository.dart'),flutterBilling=read('mobile/lib/features/billing/data/billing_repository.dart')"],
["for(const table of['user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','paper_trades','decision_notes','user_workspace_state'])","for(const table of['user_profiles','watchlist_items','notification_preferences','notification_reads','notification_devices','notification_deliveries','paper_trades','decision_notes','user_workspace_state','billing_subscriptions','billing_webhook_events'])"],
["schemaVersion:'2\\.4\\.0'","schemaVersion:'2\\.5\\.0'"],
["'/api/notifications/dispatch-preview','/api/scanner'","'/api/notifications/dispatch-preview','/api/notifications/dispatch','/api/billing/status','/api/billing/checkout','/api/billing/portal','/api/commercial-readiness','/api/account/export','/api/account/delete','/api/scanner'"]
];
for(const[a,b]of replacements){if(!s.includes(a))throw new Error(`Missing expected fragment: ${a}`);s=s.replace(a,b);}
const anchor="test('sync manifest publishes contract version and endpoints',()=>";
if(!s.includes(anchor))throw new Error('manifest test anchor missing');
const billingTest="test('Flutter consumes server-side billing entitlements without Stripe logic',()=>{assert.match(flutterBilling,/\\/api\\/billing\\/status/);assert.match(flutterBilling,/BillingEntitlement/);assert.doesNotMatch(flutterBilling,/stripe|checkout|paymentintent/i);});\n";
if(!s.includes(billingTest.trim()))s=s.replace(anchor,billingTest+anchor);
fs.writeFileSync(p,s);
