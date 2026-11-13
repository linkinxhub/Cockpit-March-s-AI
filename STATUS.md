# État du projet — 2026-11-13

## En cours : recherche approfondie IA sur les marchés

- Branche de travail : `feature/deep-market-research`.
- Nouveau mode manuel `deep` sur `POST /api/ai-analysis`, conservant l'authentification, les quotas et le contrôle d'accès existants.
- Analyse des actifs et périodes déjà sélectionnés dans le cockpit, avec tentative de recherche Web via l'outil du fournisseur IA.
- UI de synthèse : Acheter / Vendre / Attendre, confiance d'alignement, facteurs, risques, invalidation, sources citées et avertissement.
- Source des données : instantané marché transmis par le cockpit et recherche Web seulement si l'outil externe réussit.
- **Validations obtenues** : première Preview Vercel READY, Preview Build Guardian et Web Flutter Sync Guardian réussis sur le premier jalon. Le dernier jalon doit encore être vérifié.
- **À valider** : requête OpenAI réellement exécutée, disponibilité de `web_search` pour le modèle configuré, qualité des sources citées, test E2E des droits et quotas et test mobile réel.
- **Non publié** en production. Ne pas fusionner avant vérification Preview et accord.

## Renforcement du 13 novembre

- Le mode approfondi exige un appel de recherche Web réussi et des sources HTTPS reçues par les métadonnées du fournisseur ; sinon erreur `RESEARCH_NOT_VERIFIED`, sans verdict inventé.
- Le backend transmet `include: ["web_search_call.action.sources"]` et garde les recherches dans la limite de 120 secondes côté serveur.
- La Preview dispose maintenant d'un contrôle de contrat automatisé lors des Pull Requests.
- La progression à cinq étapes est informative : elle ne prétend pas connaître l'avancement interne exact du modèle.
- Le mode approfondi compte actuellement comme une utilisation de l'analyse IA ; coût et positionnement commercial sont encore à arbitrer avant production.
