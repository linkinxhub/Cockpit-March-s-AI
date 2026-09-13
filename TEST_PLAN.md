# Plan de test

## Portes de qualité par lot

1. Revue du diff et contrôle des fichiers hors périmètre.
2. Tests ciblés du comportement modifié et de ses refus.
3. `npm run lint`.
4. `npm run build`.
5. `npm test` lorsque le lot web touche un contrat ou un parcours couvert.
6. Dans `mobile/` : `flutter analyze`, puis `flutter test` si des tests existent.
7. Preview de la cible concernée et contrôle manuel des critères d'acceptation.

Les commandes coûteuses peuvent être ciblées pendant le développement, mais les portes applicables doivent être exécutées avant livraison. Les E2E authentifiés et la vérification de parité ChatGPT Sites sont lancés au signal explicite du propriétaire.

## Matrice minimale

| Domaine | Cas nominal | Cas négatif / limite |
| --- | --- | --- |
| Identité | connexion, profil stable, déconnexion | anonyme, session expirée, retour invalide |
| Autorisation | accès conforme au rôle/pack | rôle client falsifié, suspendu, pack insuffisant |
| IA | analyse, quota débité, réponse valide | quota épuisé, timeout, clé invalide, crédit restitué selon politique |
| Marché | actif/horizon valides, fraîcheur visible | symbole invalide, fournisseur indisponible, donnée ancienne |
| Stripe | Checkout, webhook, portail, facture | signature invalide, événement ancien, prix inconnu, paiement échoué |
| Données | sauvegarde et lecture du même utilisateur | isolation inter-utilisateur, base absente, conflit/migration |
| Admin | action autorisée et auditée | USER/SUPPORT refusé, auto-blocage critique, limite de débit |
| Interface | desktop/mobile, clavier, quatre langues | petit écran, texte long, erreur, chargement, mouvement réduit |
| Web/Flutter | contrat et état partagés | version incompatible, session mobile révoquée, réseau coupé |

## Sécurité

- Rechercher les secrets committés et les données sensibles dans les logs/réponses.
- Vérifier validation de schéma, limite de taille, même origine/CSRF, cache privé et rate limiting.
- Vérifier IDOR, escalade de rôle, contournement de quota et confusion entre comptes Stripe.
- Tester que les Previews ne modifient pas implicitement les ressources de production.

## Régression visuelle et métier

Contrôler la navigation principale, le changement d'onglet avec maintien du contexte, les accès rapides, les états vides/chargement/erreur, la lisibilité, les tableaux/graphiques et la cohérence des fonctions avec le pack. Aucun signal ou graphique ne doit perdre source, période ou horodatage pertinent.

## Preuves attendues

Pour chaque lot, consigner dans `STATUS.md` : commit/PR, commandes exécutées, résultat, Preview testée, cas manuels, limites et prochaine étape. Ne jamais noter « validé » sans sortie ou observation réelle.
