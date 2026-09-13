# Spécification produit

## Vision

Cockpit Marchés AI est une plateforme multilingue d'aide à la compréhension des marchés. Elle regroupe données, graphiques, indicateurs techniques, actualités, prévisions et explications IA afin d'aider l'utilisateur à préparer une décision à différents horizons. La décision et le risque restent toujours à sa charge.

## Utilisateurs

- Visiteur : découvre le produit, les tarifs et les informations légales.
- Utilisateur : consulte le cockpit selon son pack et gère ses données personnelles.
- Support : accompagne les utilisateurs sans recevoir les pouvoirs complets d'administration.
- Administrateur : gère comptes, packs, configuration et audit via des contrôles serveur.

## Périmètre fonctionnel de référence

- Marchés : crypto, forex, indices et métaux ; sélection d'actif et d'horizon.
- Analyse : graphiques, indicateurs, Ichimoku avancé, multi-timeframe, prévisions et explication acheter/vendre/attendre conditionnelle.
- Suivi : watchlist, alertes, notifications, passeports de décision, journal et paper trading selon le pack.
- IA : clé propriétaire commune côté serveur, quotas mensuels, restitution du crédit lors d'un échec géré et aucune surfacturation automatique.
- Compte : profil, langue FR/EN/DE/NL, abonnement, usage et factures disponibles via l'intégration de facturation.
- Administration : recherche utilisateurs, rôles autorisés, suspension, attribution de pack, configuration IA/Stripe et journal d'audit.
- Clients : application web et client Flutter partageant la même source durable pour les données utilisateur prises en charge.

## Offres et droits

Le catalogue technique de référence est `lib/entitlements.ts` :

| Pack | Positionnement | Quota IA mensuel actuel |
| --- | --- | ---: |
| DISCOVERY | Découverte et indicateurs essentiels | 5 |
| PRO | Tous actifs, horizons, prévisions, avancé et alertes | 100 |
| EXPERT | Pro, passeports, paper trading et limites supérieures | 300 |

Les prix et libellés commerciaux affichés doivent rester synchronisés avec Stripe et les textes publics. Un statut non actif ramène les droits commerciaux au niveau prévu par la politique serveur ; une suspension bloque l'accès.

## Exigences non fonctionnelles

- Sécurité et autorisations appliquées côté serveur.
- Données fraîches identifiées ; indisponibilité signalée sans fabriquer de valeur.
- Interface responsive, accessible au clavier, lisible et compatible avec la réduction des animations.
- Cohérence des quatre langues sur tout parcours modifié.
- Persistance durable ; aucune mémoire locale ne devient une source de vérité pour les données de compte.
- Observabilité sans données sensibles et erreurs utilisateur actionnables.

## Hors périmètre actuel

- Exécution d'ordres et conservation de fonds.
- Conseil financier personnalisé ou promesse de performance.
- Passage Stripe LIVE tant que les prérequis juridiques, fiscaux, métier et techniques ne sont pas validés.
- Publication production sans autorisation explicite.

## Critères globaux de succès

Un utilisateur comprend la source, l'heure, l'horizon et les limites d'une lecture ; les droits correspondent à son compte ; les données sauvegardées sont retrouvées entre clients ; un échec externe reste sûr et explicite ; toute action sensible est protégée et traçable.
