# Flutter Android et iPhone — état du 8 septembre 2026

Sources en cours de migration, version candidate 0.2.0+2. Aucun APK, AAB ou IPA validé dans cette livraison.

## Ajouts
- Accueil natif avec les images du site, thème sombre bleu/vert, illustration pédagogique et mouvement lent du globe. Pause et préférence système de réduction des animations.
- Textes FR, EN, DE et NL dans cet accueil. La traduction exhaustive des écrans métier et la persistance de la langue mobile restent à réaliser.
- Centre de mises à jour dans le cockpit : vérification à l’ouverture, toutes les cinq minutes au premier plan et au retour dans l’application ; vérification manuelle, actualisation des marchés et historique.
- Aucun rechargement imposé. Le rafraîchissement conserve les données affichées en cas d’échec.
- Comparaison des numéros de build Android/iOS ; lien de boutique uniquement après une publication réelle. Les changements du code Flutter nécessitent une nouvelle application distribuée. Une modification du site ne transforme pas automatiquement les widgets natifs.

## Connexion
API_BASE_URL doit être une origine HTTPS de la WebApp compatible avec `/api/me`, `/api/mobile-session`, `/mobile-connect` et les API métier du dépôt GitHub. Ne pas utiliser l’origine Sites : son authentification est différente. Le jeton mobile se génère dans la WebApp authentifiée et se conserve dans le stockage sécurisé du téléphone.

## Validation restante
Le démarrage du SDK Flutter a été arrêté par le contrôle automatique de cet environnement après une tentative d’accès aux métadonnées cloud. Aucune analyse Dart ni compilation native n’est annoncée comme réussie. Les dossiers Android/iOS ne sont pas encore générés. Sur un poste Flutter configuré, créer un projet Android/iOS, y intégrer lib/, assets/ et pubspec.yaml de ce dossier, puis résoudre les dépendances et lancer l’analyse et les tests avant compilation. Configurer l’autorisation Internet Android et les identifiants définitifs. iOS nécessite macOS, Xcode et la signature Apple.

## Conditions avant distribution
- Terminer la fidélité visuelle de tous les écrans métier à partir de la WebApp complète ; une capture ne définit pas les écrans absents.
- Traduire et mémoriser la langue dans l’ensemble du cockpit et de la connexion.
- Valider connexion, expiration de session, déconnexion, favoris, journal et reprise réseau sur deux appareils réels.
- Comparer visuellement les écrans aux références, petits écrans et taille de texte agrandie inclus.
- Tester le manifeste entre deux versions, l’échec réseau, le bouton manuel et le retour au premier plan.
- Publier les versions signées ; ensuite seulement inscrire leurs builds et liens réels dans lib/releases.ts.

Le dossier contient une adaptation native en cours, pas une reproduction visuelle finale validée.
