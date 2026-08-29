# Pré-commercialisation Cockpit Marchés AI

Cette branche prépare la commercialisation sans modifier directement `main`.

## Déjà implémenté dans ce lot
- Stripe Checkout abonnement (test-first) + Customer Portal + webhook signé/idempotent.
- Entitlements durables Free / Pro / Institutionnel dans Neon.
- Page `/pricing` et page `/account`.
- CGU, confidentialité et avertissement risques.
- Export et suppression des données utilisateur.
- Readiness commercial fail-closed `/api/commercial-readiness`.
- Livraison FCM et APNs côté serveur avec politique utilisateur et déduplication durable.
- Dispatcher protégé et scheduler GitHub Actions horaire.
- Contrat Web/Flutter v2.5 et repository mobile d'entitlements.

## Bloqueurs volontairement non inventés
- Prix finaux Pro / Institutionnel et Price IDs Stripe live.
- Identité légale complète et email support.
- Clés Stripe live et webhook live.
- Configuration provider FCM/APNs/Web Push.
- Projets natifs Flutter `android/` et `ios/` avec identifiants de bundle officiels.

La commercialisation doit rester bloquée tant que `/api/commercial-readiness` ne retourne pas `ready: true`.
