# Règles de contribution — Cockpit Marchés AI

Ces règles s'appliquent à tout le dépôt. Une instruction plus proche d'un sous-dossier peut les compléter sans réduire les protections ci-dessous.

## Avant toute modification

1. Lire `PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `STATUS.md`, `DECISIONS.md`, `TEST_PLAN.md` et `CHANGELOG.md`.
2. Vérifier `git status`, la branche, les changements existants et la dernière révision distante.
3. Définir un lot borné, ses critères d'acceptation, les fichiers concernés et les risques.
4. Préserver tout travail existant. Ne jamais supprimer une fonction, une donnée, une migration ou une intégration réelle sans autorisation explicite.

## Invariants produit et sécurité

- Cockpit informe et explique ; il n'exécute aucun ordre financier et ne garantit aucun résultat.
- Les rôles, statuts, packs, quotas et droits sont décidés côté serveur. Ne jamais faire confiance au rôle, à l'e-mail, au prix ou au pack envoyé par le client.
- Protéger les routes d'écriture contre les requêtes intersites et valider toutes les entrées.
- Vérifier les signatures Stripe ; une redirection Checkout réussie n'accorde aucun droit.
- Ne jamais exposer ni journaliser les clés OpenAI, Stripe, Auth0, les secrets de session ou les chaînes de connexion.
- Ne jamais remplacer Neon, Cloudflare, Auth0, ChatGPT Sign-in, Stripe ou une source de marché réelle par un mode démonstration silencieux.
- Conserver la séparation des données par utilisateur et la traçabilité des actions administratives.
- Respecter les différences d'hébergement documentées dans `ARCHITECTURE.md` et `docs/DUAL-PUBLICATION.md`.

## Méthode de livraison

- Une branche et une PR par lot cohérent ; pas de modifications hors périmètre.
- Ajouter ou adapter les tests du comportement changé, y compris refus d'accès, erreurs fournisseur et cas limites.
- Exécuter les contrôles ciblés, puis lint, build et tests pertinents selon `TEST_PLAN.md`.
- Déployer d'abord en Preview. La production Vercel et ChatGPT Sites exige l'autorisation explicite du propriétaire.
- Ne jamais contourner un test échoué ou présenter une tâche comme terminée sans preuve.
- Mettre à jour `STATUS.md` et `CHANGELOG.md` à chaque lot livré ; enregistrer les décisions durables dans `DECISIONS.md`.

## Définition de terminé

Un lot est terminé uniquement si ses critères d'acceptation sont vérifiés, les contrôles applicables réussissent, aucune régression connue n'est masquée, la documentation est cohérente et les limites restantes sont consignées dans `STATUS.md`.
