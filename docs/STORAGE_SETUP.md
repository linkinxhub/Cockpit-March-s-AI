# Stockage durable Web ↔ Flutter

## Architecture retenue
Le projet `cockpit-march-s-ai` utilise directement la ressource Neon/Postgres liée à Vercel comme source durable unique des données utilisateur.

Projet Vercel courant : `prj_geoT6Sz3Yb3LxIcRY2hn1t8iHBcf` dans l’équipe `team_EubY4MykE1gNJ4vdUlfL7KaC`.

Les domaines persistants sont :
- profils utilisateur ;
- watchlist ;
- préférences de notifications ;
- notifications lues/non lues ;
- appareils push ;
- paper trading / journal.

Aucun de ces domaines ne doit utiliser localStorage, SharedPreferences ou un Map mémoire comme source de vérité.

## Connexion Vercel ↔ Neon
L’intégration Neon du projet Vercel injecte la chaîne de connexion dans l’environnement du backend. Le code accepte les noms suivants :
- `DATABASE_URL`
- `POSTGRES_URL`
- `NEON_DATABASE_URL`
- `NEON_POSTGRES_URL`

Il n’est plus nécessaire d’utiliser `USER_SYNC_API_URL` ni `USER_SYNC_API_SECRET`.

Un preview Vercel de la branche `feat/flutter-mobile-sync` a déjà confirmé au runtime `durableStore: true` et `provider: vercel-neon-postgres`.

## Session mobile
La seule variable applicative supplémentaire requise est :
- `MOBILE_SESSION_SECRET` : secret aléatoire fort utilisé uniquement côté serveur pour signer les sessions Flutter.

Ne jamais committer ce secret dans GitHub.

## Base Neon cible
Ressource Vercel/Neon reliée au projet Cockpit Marchés AI. Le schéma applicatif de référence est `db/schema.ts`, désormais aligné sur Postgres.

Migrations versionnées :
- `db/migrations/0001_user_sync_postgres.sql`
- `db/migrations/0002_notification_devices.sql`
- `db/migrations/0003_notification_timezone.sql`

## Diagnostic en lecture seule
`/api/user-sync/health` effectue uniquement des lectures et ne modifie jamais la base. Il vérifie :
- la présence de la connexion Neon ;
- les tables utilisateur attendues ;
- la table `notification_devices` ;
- les colonnes de fuseau horaire des préférences.

Le endpoint ne retourne jamais la chaîne de connexion ni les secrets Vercel/Neon.

## Vérification après déploiement
- `/api/user-sync/capabilities` doit retourner `durableStore: true` et `provider: vercel-neon-postgres` ;
- `/api/user-sync/health` doit retourner `healthy: true` avant activation complète des fonctions persistantes ;
- `/api/me` doit identifier le même compte sur le Web et via le Bearer Flutter ;
- `/api/user-sync/snapshot` doit retourner la watchlist, les préférences et les IDs de notifications lues ;
- une modification de watchlist sur Web doit être visible sur Flutter après rafraîchissement, et inversement ;
- les préférences de notification et le fuseau horaire doivent être identiques sur les deux clients ;
- les appareils push doivent être enregistrables et révocables par utilisateur.

## Sécurité
Le backend ne crée pas silencieusement les tables au premier appel. Le schéma doit être appliqué explicitement à la base avant activation de la synchronisation. Tant que les tables ou la connexion ne sont pas disponibles, les routes utilisateur répondent par une erreur explicite au lieu de simuler une persistance locale.
