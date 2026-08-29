# Cockpit Marchés AI — Flutter

Application mobile compagnon de la WebApp principale.

## Principe de synchronisation

La WebApp reste la source de vérité pour les données de marché et la logique métier. Flutter consomme les routes API existantes au lieu de recopier les calculs en Dart.

Première intégration :

- `GET /api/scanner`
- même catalogue d'actifs que `lib/market-data.ts`
- mêmes snapshots/signaux renvoyés par le backend

## Lancement

```bash
cd mobile
flutter pub get
flutter run --dart-define=API_BASE_URL=https://votre-domaine-webapp
```

Pour un émulateur Android local, utiliser l'URL réseau adaptée au serveur Web local.

## Règle de développement

Toute logique sensible de trading (prix, indicateurs, scores, signaux BUY/SELL/WAIT, règles de marché, historique) doit rester côté backend partagé. Flutter ne doit contenir que la présentation, l'état UI, le cache local et les interactions mobiles.

## Prochaines étapes

1. Ajouter la navigation Cockpit / Marchés / Scanner / Indicateurs / Alertes / Journal.
2. Exposer un contrat API versionné pour les indicateurs et Ichimoku.
3. Ajouter l'authentification mobile compatible avec le backend.
4. Ajouter WebSocket/SSE ou polling contrôlé pour le temps réel.
5. Ajouter tests de contrat Web ↔ Flutter dans CI.
