# Changelog

## 2026-11-13 — En validation (branche feature/deep-market-research)

- Ajout d'un déclenchement manuel de recherche approfondie sur l'actif et la périodicité sélectionnés.
- Extension de l'API IA avec option `mode: "deep"`, recherches Web et réponse structurée.
- Affichage séparé du verdict, de l'alignement, des risques, de la condition d'invalidation et des sources.
- Conservation du mode instantané, des autorisations, du quota mensuel et de l'absence d'exécution automatique.
- En attente des tests techniques et fonctionnels avant fusion.

### Renforcements de validation

- Rejet des rapports sans recherche Web confirmée et sans source exploitable.
- Ajout de la récupération des métadonnées de recherche et suppression des URL générées uniquement par le modèle.
- Adaptation du prompt aux données externes non fiables, avec préférence pour « ATTENDRE » si les preuves sont insuffisantes.
- Affichage d'une progression en cinq étapes sans avancement fictif.
- Ajout d'un test de contrat au pipeline CI Preview.

### Correctifs supplémentaires
- Empêche l'exécution simultanée de l'analyse instantanée et du mode approfondi.
- Messages explicites `RESEARCH_NOT_VERIFIED` et `RESEARCH_UNAVAILABLE` ; erreurs sécurisées côté utilisateur.
- Tests de contrat CI étendus à ces protections et au remboursement des requêtes IA échouées.
