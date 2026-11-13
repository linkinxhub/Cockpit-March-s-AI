# État du projet — 13 novembre 2026

Branche : `feature/deep-market-research`. PR : https://github.com/linkinxhub/Cockpit-March-s-AI/pull/37 (ouverte, non fusionnée).

## Baseline distante vérifiée : a4a5a32

- SHA : `a4a5a32ad53b60215d532d4611d0d64461a8c78d` ; état initial propre après clonage dans le dossier vide.
- Aucun AGENTS.md trouvé dans le dépôt ni les parents contrôlés. README, documentation IA/publication, workflows et changements existants examinés.
- Preview Build Guardian : **success** — https://github.com/linkinxhub/Cockpit-March-s-AI/actions/runs/43375038993
- Web Flutter Sync Guardian : **success** — https://github.com/linkinxhub/Cockpit-March-s-AI/actions/runs/43375038930
- Vercel : **success / Deployment has completed**, 13/11/2026 05:55:26 UTC — https://vercel.com/adilbtp-8978s-projects/cockpit-march-s-ai/45Nm9fYiiLdMrfzZ8XeaeeU9q5Ri
- Preview reliée au SHA par GitHub Deployments : https://cockpit-march-s-la2d9zjau-adilbtp-8978s-projects.vercel.app
- L'URL miborfrra de la conversation n'est pas celle retournée pour ce SHA. Connecteurs indisponibles : preuves obtenues via API publiques GitHub ; journaux Vercel privés non consultés.

## Corrections de cette reprise

- BTC/EUR manquait au catalogue : ajout de Binance BTCEUR, secours Yahoo BTC-EUR et actualités Bitcoin/EUR. La sélection Découverte reste BTC/USDT, ETH/USDT, BNB/USDT. BTC/EUR et 1 mois conservent les droits existants Pro/Expert.
- Vérification externe : exchangeInfo Binance indique base BTC, cotation EUR, statut TRADING. Klines renvoie 186 bougies 4 h, du 13 octobre au 13 novembre 2026. Aucun secours USD pour cette paire EUR.
- Rafraîchissement du quota à la fin d'une recherche approfondie ; préservation des erreurs d'accès renvoyées dans `error`.
- Verrou par références des requêtes en cours en complément de l'état React contre le départ simultané des modes instantané et approfondi.
- Bouton approfondi désactivé si l'historique est en erreur. Réponses fournisseur explicitement incomplètes rejetées avec tentative de remboursement.
- Libellé « Sources consultées ou citées » : les métadonnées comprennent aussi des pages consultées sans citation dans la synthèse.
- Tests exécutant la route avec fournisseur, identité et quota simulés, ajoutés à la CI Preview. Aucun secret réel utilisé.

## Preuves locales et navigateur

- Installation exacte du lockfile réussie. Premier essai npm en échec de certificats ; reprise avec `NODE_USE_SYSTEM_CA=1`, sans désactiver TLS ni modifier le lockfile.
- `node node_modules/next/dist/bin/next build` : **réussi**, compilation, TypeScript et génération de 48 pages.
- **89/89 tests ciblés réussis** : recherche, quotas, configuration IA, rendu du fil d'analyse, Auth0, en-têtes de sécurité contrats Web/Flutter, accès aux packs et récupération des analyses.
- Tests comportementaux : BTC/EUR / 1mo, réservation unique, 401/403 avant lecture des clés, quota épuisé sans appel fournisseur, remboursement sur erreur/timeout, absence de recherche/source, URL HTTP/javascript/avec identifiants, JSON invalide, réponse incomplète et préservation du mode instantané.
- Preview a4a5a32 : titre Cockpit Marchés AI, page non vide, navigation Prévisions puis 1 mois répercutée dans le panneau ; bouton Accès IA requis désactivé en session anonyme. Aucun écran d'erreur framework ni erreur/alerte console capturée pendant ce parcours.
- Responsive baseline : 1280 px (document 1265) et 390 × 844 (document 375), sans débordement horizontal mesuré. Captures observées dans l'outil navigateur. Le bandeau sticky occupe une part importante du mobile ; rapport long authentifié à contrôler.
- Mon compte ouvre Auth0 ; aucune session authentifiée disponible. Les données de marché du parcours anonyme sont indisponibles. Les appels HTTP directs rencontrent Vercel Authentication : ils ne prouvent pas le statut de l'API applicative.

## Limites et suite

- **E2E réel BTC/EUR 1 mois non réalisé** : connexion Pro/Expert nécessaire, puis test sur une Preview contenant les correctifs. Aucune consommation OpenAI réelle ni qualité/fraîcheur des sources réelles attestée.
- Les mocks prouvent le comportement de la route, pas le débit/remboursement Neon ni la compatibilité du modèle configuré. Un arrêt brutal peut conserver une réservation ; le limiteur de rafale reste local à une instance.
- Snapshot technique fourni par le client, contrôle de fraîcheur de cotation côté UI. Les liens HTTPS reçus du fournisseur ne prouvent pas la véracité de chaque affirmation.
- Remboursement tenté dans finally ; aucune garantie affichée si le stockage échoue.
- L'outil navigateur a été retiré en cours de session : rendu des nouveaux correctifs non revalidé. Build et tests ne remplacent pas cette validation.
- AI-PLANS mentionne historiquement 1800 tokens : instantané 1800, approfondi 3200. Une recherche réserve une utilisation IA ; le contexte Bigdata peut avoir sa propre consommation existante.
- Aucune fusion, promotion Vercel ou publication Sites/production. La consigne explicite de validation en branche prévaut sur docs/DUAL-PUBLICATION.md.
