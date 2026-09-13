# Registre des décisions

Les nouvelles décisions sont ajoutées sans réécrire l'historique. Statuts : proposé, accepté, remplacé.

## ADR-001 — Deux hébergements, responsabilités explicites

- Statut : accepté
- Décision : maintenir Vercel et ChatGPT Sites comme cibles distinctes avec adaptations d'identité et de stockage propres.
- Conséquence : chaque livraison indique précisément les cibles validées ; aucune parité n'est supposée.

## ADR-002 — Autorisation et entitlements côté serveur

- Statut : accepté
- Décision : rôles, statuts, packs, quotas et accès aux fonctions sont calculés côté serveur à partir de l'identité stable et des données persistées.
- Conséquence : l'interface peut masquer une option, mais elle ne constitue jamais une barrière de sécurité.

## ADR-003 — Clé OpenAI propriétaire

- Statut : accepté
- Décision : tous les comptes utilisent la configuration OpenAI du propriétaire selon leur quota ; l'utilisateur ne fournit pas sa clé.
- Conséquence : coût, limitation, chiffrement, rotation et surveillance relèvent de l'opérateur.

## ADR-004 — Stripe fait autorité sur les abonnements payants

- Statut : accepté
- Décision : seul un webhook signé, suivi d'une relecture Stripe d'un abonnement et d'un prix reconnus, peut activer les droits payants.
- Conséquence : la page de succès, le client et l'e-mail ne sont pas des preuves de paiement.

## ADR-005 — Persistance durable partagée

- Statut : accepté
- Décision : les données utilisateur synchronisées Web/Flutter utilisent la base durable de la cible ; les caches locaux ne sont pas la source de vérité.
- Conséquence : une indisponibilité de stockage produit une erreur explicite, jamais une fausse sauvegarde.

## ADR-006 — Livraison Preview avant production

- Statut : accepté
- Décision : toute modification applicative est vérifiée en branche/PR et en Preview avant production. La publication production exige l'autorisation explicite du propriétaire.
- Conséquence : un build local réussi ne vaut ni validation Preview ni autorisation de publier.

## ADR-007 — Positionnement informatif

- Statut : accepté
- Décision : Cockpit fournit analyse et pédagogie, sans exécuter d'ordre, garantir un rendement ou présenter un signal comme une consigne certaine.
- Conséquence : textes, IA, notifications et marketing conservent les limites et la responsabilité de décision de l'utilisateur.
