# Parcours de compréhension et de suivi — 9 septembre 2026

## Objectif produit

Cockpit aide un particulier à comprendre une lecture de marché, comparer les horizons et retrouver son raisonnement. La valeur recherchée est la clarté et le temps gagné. Le nouveau parcours réutilise l'analyse existante et ne déclenche aucun appel OpenAI supplémentaire.

## Recherche et lacunes constatées

Les besoins ci-dessous sont des hypothèses produit issues de la recherche et de l'examen du code, pas des demandes recueillies auprès de clients de Cockpit.

| Besoin | État observé | Réponse intégrée |
|---|---|---|
| Comprendre où commencer | Nombreuses fonctions et guide général déjà présents | Trois étapes près des résultats : Comprendre, Comparer, Suivre |
| Comprendre ce que mesure un score | Précisions présentes mais dispersées | Explication du score, source, date et lexique dans la première étape |
| Comprendre deux périodes contradictoires | Tableau multi-périodes existant | Explication de l'accord, de l'opposition ou de l'attente, avec horizons court et long |
| Passer à la prochaine opération | Favoris, alertes et journal disponibles séparément | Accès directs tenant compte du pack et positionnement sur la section visée |
| Retrouver pourquoi une lecture a changé | Passeports existants, sans comparaison contextualisée | Dernier instantané du même actif, de la même période et de la même méthode |
| Conserver une trace fidèle | Le passeport utilisait les valeurs du scanner actif | Capture du contexte de la période affichée, horodatage ISO et méthode identifiée |

Sources consultées :
- [Nielsen Norman Group, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) : commencer par les commandes essentielles et ouvrir les détails à la demande.
- [FCA, Trading apps review, 11 avril 2025](https://www.fca.org.uk/publications/multi-firm-reviews/trading-apps-high-level-observations) : compréhension du public visé, valeur du service et intérêt d'outils permettant aux utilisateurs de suivre leurs propres activités. Cette étude porte sur des applications de courtage ; les choix UX de Cockpit en sont une adaptation, pas une conclusion réglementaire sur Cockpit.
- [AMF, Baromètre spécial IA, juin 2026](https://www.amf-france.org/fr/actualites-publications/communiques/communiques-de-lamf/edition-speciale-du-barometre-amf-encore-peu-utilisee-dans-les-pratiques-dinvestissement) : résultat indexé repéré mais page complète inaccessible. Aucun pourcentage de cette source n'est utilisé comme critère d'implémentation.

## Conservation et règles

- Les comptes, fournisseurs, quotas IA, facturation et catalogues des packs sont conservés.
- Les nouveaux liens respectent les droits existants de chaque hébergeur ; les API conservent leurs propres protections.
- Un brouillon de journal existant n'est pas écrasé. Le parcours ne sauvegarde pas une note à la place de l'utilisateur.
- Aucun instantané ne peut être créé pendant un chargement, avec une donnée marquée ancienne ou une lecture indisponible.
- Sur Sites, la limite de la sauvegarde authentifiée passe de 100 à 256 ko pour accueillir les extraits bornés (500 caractères de synthèse, 300 d’invalidation) des passeports.
- Les anciens passeports restent présents. Ils sont exclus du nouveau comparateur car leur contexte historique n'est pas vérifiable rétroactivement.
- Deux méthodes différentes, notamment deux modèles IA, ne sont pas comparées comme si elles étaient identiques.
- Le mouvement du cours est présenté comme une observation, jamais comme un rendement réalisé.
- Les nouveaux textes sont disponibles en français, anglais, allemand et néerlandais. Le composant utilise les contrôles accessibles existants et respecte la réduction des animations.

## Validation et suite

Contrôler le typage et les builds des deux cibles, la comparaison de périodes opposées, l'exclusion des contextes incompatibles, les données invalides et la complétude des traductions. Les tests automatisés n'établissent pas la satisfaction de vrais utilisateurs ni le fonctionnement des fournisseurs en production.

Après publication, faire réaliser trois tâches aux premiers utilisateurs : expliquer une divergence, retrouver une analyse enregistrée et choisir la prochaine vérification. Recueillir les difficultés avec le module de retours existant. Mesurer les retours et renouvellements avant d'étendre le périmètre.

Retour arrière : retirer le commit de ce lot sur chaque hébergeur, puis republier. Aucun schéma de données ni migration n'est requis ; les nouveaux champs de passeport sont optionnels.
