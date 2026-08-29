# Stockage durable Web ↔ Flutter

## Recommandation
Pour le déploiement Vercel, utiliser un Postgres serverless (Neon recommandé) comme source durable unique des données utilisateur.

## Pourquoi
Les domaines suivants doivent survivre aux redéploiements et être partagés entre Web et Flutter :
- profils utilisateur ;
- watchlist ;
- préférences de notifications ;
- notifications lues/non lues ;
- paper trading / journal.

Aucun de ces domaines ne doit utiliser localStorage, SharedPreferences ou un Map mémoire comme source de vérité.

## Variables de production
À configurer dans Vercel > Project > Settings > Environment Variables :

- `MOBILE_SESSION_SECRET` : secret aléatoire fort utilisé uniquement côté serveur pour signer les sessions Flutter.
- `USER_SYNC_API_URL` : URL HTTPS du service durable qui implémente le contrat User Sync.
- `USER_SYNC_API_SECRET` : secret serveur-à-serveur entre la WebApp et ce service.

Marquer les secrets comme variables sensibles et les appliquer au minimum à Production, puis redéployer.

## Option recommandée avec Neon
1. Depuis Vercel Marketplace, installer Neon et le rattacher au projet Cockpit Marchés AI.
2. Créer une base Postgres de production.
3. Récupérer la connection string générée par l'intégration (souvent exposée via une variable de type `DATABASE_URL` / `POSTGRES_URL`).
4. Déployer le service User Sync contre cette base et appliquer les tables équivalentes à `db/schema.ts`.
5. Renseigner ensuite `USER_SYNC_API_URL` et `USER_SYNC_API_SECRET` dans la WebApp.

## Génération des secrets
Exemple macOS/Linux :

```bash
openssl rand -base64 48
```

Utiliser une valeur différente pour `MOBILE_SESSION_SECRET` et `USER_SYNC_API_SECRET`.

Ne jamais committer ces valeurs dans GitHub.

## Vérification
Après configuration et redéploiement :
- `/api/user-sync/capabilities` doit retourner `durableStore: true` ;
- `/api/me` doit identifier le même compte sur le Web et via le Bearer Flutter ;
- `/api/user-sync/snapshot` doit retourner la watchlist, les préférences et les IDs de notifications lues ;
- une modification de watchlist sur Web doit être visible sur Flutter après rafraîchissement, et inversement.

## État actuel
Le code Web/Flutter est déjà préparé pour cette synchronisation. Tant que le store durable n'est pas configuré, les routes utilisateur doivent répondre explicitement `503 storage_not_configured` plutôt que simuler une persistance locale.
