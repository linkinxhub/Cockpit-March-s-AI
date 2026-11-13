# État du projet — 2026-11-13

## En cours : recherche approfondie IA sur les marchés

- Branche de travail : `feature/deep-market-research`.
- Nouveau mode manuel `deep` sur `POST /api/ai-analysis`, conservant l'authentification, les quotas et le contrôle d'accès existants.
- Analyse des actifs et périodes déjà sélectionnés dans le cockpit, avec tentative de recherche Web via l'outil du fournisseur IA.
- UI de synthèse : Acheter / Vendre / Attendre, confiance d'alignement, facteurs, risques, invalidation, sources citées et avertissement.
- Source des données : instantané marché transmis par le cockpit et recherche Web seulement si l'outil externe réussit.
- **Non validé** : build/tests en environnement hébergé, disponibilité de `web_search_preview` pour le modèle configuré, validité des sources citées, test E2E de souscription et test mobile réel.
- **Non publié** en production. Ne pas fusionner avant vérification Preview et accord.
