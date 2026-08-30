# Pré-commercialisation — Cockpit Marchés AI

## État technique validé

- Contrat Web ↔ Flutter : schema v2.5.0.
- Migrations Neon 0001 à 0007 appliquées sur l'environnement preview contrôlé.
- Billing durable : `billing_subscriptions` + journal idempotent `billing_webhook_events`.
- Notifications : journal de livraison `notification_deliveries` et déduplication par utilisateur/événement/appareil.
- Stripe : Checkout hébergé, Customer Portal, webhook signé et entitlements serveur.
- RGPD : export utilisateur et suppression confirmée.
- Pages légales : CGU, confidentialité, avertissement risques.
- Push serveur : Web Push/VAPID, FCM Android et APNs iOS prêts lorsque les credentials externes sont configurés.
- Flutter : projets Android et iOS générés et versionnés ; `flutter analyze` et tests passent.
- Next.js : `npm ci` + build passent.
- Les previews automatiques sont désactivés sur `feat/precommercialization-audit` pour préserver le quota Vercel Hobby.

## Stripe test déjà présent

Compte Stripe test SMARTDEV :
- Pro : 24,00 EUR / mois — `price_1U9hfjPaqMcvZjThyHhCdmiO`.
- Trader+ : 49,00 EUR / mois — `price_1U9hfpPaqMcvZjThgzBA4ADB`.

`Trader+` n'est pas automatiquement assimilé au plan `INSTITUTIONAL`. Le mapping final doit être validé avant configuration production.

## Paramètres obligatoires avant commercialisation

- `STRIPE_SECRET_KEY` live.
- `STRIPE_WEBHOOK_SECRET` live.
- `STRIPE_PRICE_PRO`.
- `STRIPE_PRICE_INSTITUTIONAL` ou décision explicite de remplacer Institutionnel par Trader+.
- `PUBLIC_APP_URL`.
- `LEGAL_OPERATOR_NAME`.
- `LEGAL_OPERATOR_ADDRESS`.
- `LEGAL_OPERATOR_COUNTRY`.
- `LEGAL_COMPANY_NUMBER` si applicable.
- `NEXT_PUBLIC_SUPPORT_EMAIL`.
- `MOBILE_SESSION_SECRET`.
- `NOTIFICATION_DISPATCH_SECRET` côté Vercel et GitHub Actions.
- Web Push : `WEB_PUSH_PUBLIC_KEY`, `WEB_PUSH_PRIVATE_KEY`.
- Android : `FCM_PROJECT_ID`, `FCM_CLIENT_EMAIL`, `FCM_PRIVATE_KEY` et configuration Firebase du build.
- iOS : `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_PRIVATE_KEY`, `APNS_BUNDLE_ID` et configuration Apple du build.
- Signature Android release et équipe/signing iOS avant soumission aux stores.

## Règles de lancement

La commercialisation doit rester bloquée tant que `/api/commercial-readiness` ne retourne pas `ready: true`.
Le produit ne doit pas être annoncé comme conseil financier personnalisé, courtier ou promesse de rendement. Le Paper Trading reste une simulation. Les droits Pro/Institutionnel ne sont accordés qu'après état Stripe vérifié côté serveur. Flutter consomme les entitlements serveur et ne duplique pas la logique de paiement.
