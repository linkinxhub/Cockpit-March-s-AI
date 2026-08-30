import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const shell=read('mobile/lib/app_shell.dart'),prefs=read('mobile/lib/features/news/presentation/notification_preferences_view.dart'),billing=read('mobile/lib/features/billing/data/billing_repository.dart'),android=read('mobile/android/app/build.gradle.kts'),androidManifest=read('mobile/android/app/src/main/AndroidManifest.xml'),ios=read('mobile/ios/Runner.xcodeproj/project.pbxproj'),info=read('mobile/ios/Runner/Info.plist');

test('native Android and iOS projects are versioned',()=>{assert.match(android,/applicationId\s*=\s*"ai\.cockpitmarches\.cockpit_marches_ai"/);assert.match(androidManifest,/android\.intent\.action\.MAIN/);assert.match(ios,/PRODUCT_BUNDLE_IDENTIFIER = ai\.cockpitmarches\.cockpitMarchesAi/);assert.match(info,/CFBundleDisplayName|CFBundleName/);});
test('Flutter news state is initialized outside build mutations',()=>{assert.doesNotMatch(shell,/if\(snapshot\.hasData&&read\.isEmpty\)read=/);assert.match(shell,/sync\.then\(\(snapshot\)/);assert.doesNotMatch(prefs,/prefs\?\?=/);assert.match(prefs,/future\.then\(\(snapshot\)/);});
test('mobile billing stays entitlement-only',()=>{assert.match(billing,/\/api\/billing\/status/);assert.doesNotMatch(billing,/stripe|checkout|paymentintent/i);});
