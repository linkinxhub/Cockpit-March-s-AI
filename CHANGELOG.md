
## 2026-11-14 — Publication Vercel (PR #37)

- Fusion en production de la recherche approfondie IA par actif et période, du support BTC/EUR et des corrections de quotas, sécurité et traitement des sources.
- Vérification des workflows GitHub de Preview et du déploiement Vercel en statut READY sur `60b5899`.
- Publication ChatGPT Sites indépendante non confirmée ; test E2E OpenAI authentifié à exécuter.

# Changelog

## 2026-11-13 — Reprise de validation PR #37

- Ajout de BTC/EUR avec historiques Binance BTCEUR / Yahoo BTC-EUR et actualités dédiées ; sélection Découverte conservée.
- Rafraîchissement du quota après recherche approfondie, erreurs d'accès précises et bouton désactivé si l'historique est en erreur.
- Renforcement du verrou entre modes instantané et approfondi ; rejet des réponses fournisseur incomplètes.
- Clarification des sources consultées ou citées.
- Tests comportementaux ajoutés à la CI : sources, accès, quotas, erreurs, remboursement, paire EUR et mode instantané.
- Baseline a4a5a32 : deux workflows réussis et déploiement Vercel confirmé. Build local et 89 tests ciblés réussis ; E2E OpenAI authentifié et rendu des nouveaux correctifs encore à valider. Preuves et limites dans STATUS.md.
- Aucune publication en production ni fusion.
- Validation distante finale du code `1a983cf` : Preview Build Guardian et Web Flutter Sync Guardian réussis ; Preview Vercel déployée. Libération de la référence d'appel instantané après sa fin pour débloquer la recherche suivante. Le test authentifié reste ouvert.

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

### UX et contrôles de fraîcheur
- Désactivation explicite de la recherche approfondie lorsque le cours actif est signalé périmé.
- Indication des droits et quotas manquants, sans bouton trompeur.
- Ajustement du texte d'erreur pour ne pas garantir un remboursement sans preuve de son exécution.
- Vérification des paramètres de recherche Web utilisés dans les références officielles.
