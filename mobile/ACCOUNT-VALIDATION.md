# Lot compte mobile — 9 septembre 2026

Base : branche principale `12ff87db457904c75e598f84fce74e87c4f2ddcd`.

## Fonctionnement ajouté

- Icône « Mon compte » dans la barre supérieure, accessible indépendamment du chargement des marchés.
- Identité de la session, pack, statut, consommation IA du serveur, renouvellement du quota en UTC et échéance d’abonnement si disponible.
- Actualisation manuelle et au retour au premier plan ; les données précédentes sont masquées pendant le chargement et en cas d’échec.
- Message distinct pour une session expirée ; déconnexion disponible même si l’API échoue.
- Jeton masqué pendant la saisie et champ vidé après connexion ; déconnexion supprimant le secret du stockage sécurisé avant de quitter la session.
- Signaux du scanner identifiés comme techniques, sans les attribuer à OpenAI.

Le quota utilise `/api/account/subscription` et l’identité `/api/me` du backend Vercel. L’application ne recalcule pas les droits commerciaux. Le serveur vérifie le jeton et les autorisations à chaque appel. Le nom affiché provient de l’identité du jeton et peut nécessiter une reconnexion après modification du profil web.

La déconnexion est locale : elle ne révoque pas une copie du jeton ni les autres sessions. Le jeton expire selon sa durée serveur. Aucun paiement mobile ni bouton d’achat n’est ajouté.

## Vérifications effectuées

- Six contrôles Dart : quota serveur, échéance UTC, quota épuisé, quota illimité, suspension, rejet de quota invalide.
- Analyse Dart du modèle et du fichier de contrôle : aucune erreur.
- Syntaxe des fichiers modifiés vérifiée par le formateur Dart.

L’analyse complète Flutter, les tests de widgets, le rendu sur appareil et les compilations Android/iOS ne sont PAS validés. Le lancement de Flutter a été arrêté par le contrôle automatique en raison d’un accès à un service de métadonnées de la machine. Aucun contournement n’a été appliqué.

## Validation à reprendre sur une machine de développement adaptée

1. Installer Flutter et Android SDK ; pour iOS, utiliser macOS avec Xcode.
2. Dans `mobile`, générer les projets natifs Android/iOS avec Flutter en préservant `lib/`, les assets et `pubspec.yaml`. Les dossiers natifs ne sont pas encore livrés dans ce lot.
3. Exécuter `flutter pub get`, `flutter analyze`, puis `dart test/account_model_check.dart`.
4. Tester connexion, compte gratuit/Pro/Expert/suspendu, quota épuisé, absence de réseau, retour au premier plan et déconnexion après ouverture de plusieurs écrans.
5. Compiler avec `--dart-define=API_BASE_URL=https://cockpit-march-s-ai.vercel.app` ; vérifier la configuration serveur `MOBILE_SESSION_SECRET` par le parcours connecté `/mobile-connect`.
6. Vérifier les textes FR/EN/DE/NL, la fidélité visuelle, les périodes et l’analyse OpenAI. Le mobile actuel reste principalement en français et l’analyse OpenAI interactive n’est pas encore portée.
7. Configurer les identifiants définitifs, signatures et distribution Android/TestFlight avant livraison. Aucun APK ni archive iOS n’est validé à ce stade.

Ce lot ne modifie aucun backend ni aucune version web. Il est conservé en demande de fusion brouillon tant que Flutter n’a pas pu être validé.
