# Feuille de route

Les lots sont ordonnés par réduction du risque. Leur avancement réel est suivi dans `STATUS.md`.

## P0 — Stabiliser avant commercialisation

- [ ] Auditer l'ensemble du parcours critique : inscription, cockpit, quotas, abonnement, factures, portail et suspension.
- [ ] Corriger les écarts de schéma/migrations et confirmer la persistance Web ↔ Flutter.
- [ ] Vérifier toutes les protections serveur des rôles, packs, quotas et actions administratives.
- [ ] Éliminer les incohérences de textes, prix, noms de packs et états de paiement.
- [ ] Compléter les tests négatifs et les tests de régression des intégrations.

## P1 — Préparer Stripe LIVE et le lancement mondial

- [ ] Fournir l'identité juridique de l'opérateur et valider territoires, fiscalité, TVA, rétractation, remboursement et confidentialité.
- [ ] Définir explicitement les pays servis et le géoblocage éventuel ; ne pas déduire la conformité du seul blocage de la Belgique.
- [ ] Configurer produits/prix LIVE, webhook LIVE, portail et facturation sans réutiliser les identifiants TEST.
- [ ] Exécuter une répétition complète en Preview puis un canari contrôlé autorisé.
- [ ] Mettre en place suivi des coûts IA, alertes opérationnelles et procédure d'incident.

## P2 — Qualité produit

- [ ] Finaliser l'audit typographique, responsive, accessibilité et navigation longue.
- [ ] Harmoniser Web, ChatGPT Sites et Flutter sur les fonctions réellement supportées.
- [ ] Améliorer la pédagogie des signaux, conflits d'horizons, risques et données anciennes.
- [ ] Mesurer activation, compréhension, rétention et usage des quotas sans profilage excessif.

## P3 — Croissance maîtrisée

- [ ] Valider les segments et pays cibles avec recherche utilisateur et contraintes réglementaires.
- [ ] Tester la proposition de valeur et les offres sans promesse financière.
- [ ] Industrialiser support, retours, localisation et suivi qualité fournisseur.

## Règles de priorité

Une fonction commerciale ne passe pas devant une faille d'autorisation, une perte de données, un défaut de facturation ou une obligation juridique. Les E2E authentifiés et la parité ChatGPT Sites sont exécutés uniquement au signal du propriétaire, mais restent des portes de sortie obligatoires avant le lancement concerné.
