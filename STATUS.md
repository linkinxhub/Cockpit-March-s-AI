# État du projet

Dernière mise à jour : 13 septembre 2026 (UTC)

## Référence inspectée

- Dépôt : `linkinxhub/Cockpit-March-s-AI`
- Branche distante inspectée : `main`
- Révision de départ : `6128833` — fusion de la PR #34
- Branche de structuration : `chore/project-structure`

## État confirmé par inspection

- Application web Next.js/React avec API serveur et client Flutter présent.
- Authentification différenciée Auth0/ChatGPT selon l'hébergement.
- Schéma Postgres pour profils, abonnements, quotas, audit et données utilisateur.
- Catalogue serveur des rôles, packs, statuts et entitlements.
- Intégrations OpenAI et Stripe présentes, avec documentation indiquant Stripe TEST.
- Workflows existants pour build Preview et contrats Web/Flutter.
- Documentation thématique existante dans `docs/`, mais documents directeurs absents avant ce lot.

## Lot en cours — Structuration du projet

Critères d'acceptation :

- [x] règles globales de contribution et de sécurité ;
- [x] spécification produit alignée sur le code ;
- [x] architecture et frontières de confiance ;
- [x] feuille de route priorisée ;
- [x] registre initial des décisions ;
- [x] plan de test et preuves attendues ;
- [x] suivi d'état et changelog ;
- [x] validation des liens et cohérence documentaire ;
- [ ] commit/PR distante.

## Risques et blocages connus

- Stripe LIVE n'est pas autorisé ni déclaré prêt ; les prérequis juridiques/fiscaux restent à valider.
- La parité complète entre Vercel, ChatGPT Sites et Flutter n'est pas prouvée par ce lot documentaire.
- Aucun E2E authentifié n'est exécuté dans ce lot, conformément au déclenchement réservé au signal du propriétaire.
- L'ancien `README.md` décrit encore largement le starter technique et devra être refondu dans un lot séparé.

## Prochaine étape recommandée

Faire relire ce socle dans une PR, puis démarrer P0 par un audit traçable des parcours critiques et des protections serveur, sans publication production.
