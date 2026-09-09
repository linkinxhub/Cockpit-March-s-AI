# Vitrine : comprendre l’offre avant de s’inscrire

La page `/decouvrir` présente maintenant la même expérience sur Sites et Vercel, en français, anglais, allemand et néerlandais. Elle conserve les images existantes, la démonstration illustrative et les avertissements de disponibilité.

## Contenu relié aux fonctions disponibles

- Comprendre : fil d’analyse, définitions, facteurs, source et date lorsqu’elles sont connues.
- Comparer : explication des accords et divergences entre périodes ; accès Pro et Expert.
- Suivre : passeports et comparaison contextualisée, avec accès au journal ; présentés comme inclus dans Expert, conformément aux droits des deux hébergeurs.
- IA incluse : aucun achat ni saisie de clé par le client ; quota de son compte Cockpit.
- Choix du pack par usage, avec quotas provenant de `AI_MONTHLY_LIMITS`, également utilisé par les cartes d’offres.
- FAQ : valeur du parcours organisé, clé API, épuisement du quota, interprétation du score et retours utilisateur.

La comparaison des passeports respecte les règles décrites dans `USER-JOURNEY.md`. Il n’y a pas d’archivage automatique de toutes les analyses, pas de promesse de gain et pas de témoignage inventé. Les besoins proposés sont des hypothèses produit, sans étude de satisfaction de clients Cockpit.

## Modèle IA et sources

Le service Cockpit appelle l’API côté serveur. Le client utilise ses droits et son quota applicatifs ; aucune clé n’est distribuée aux utilisateurs. L’exploitant reste responsable de la consommation API du service. Le catalogue commercial et le mode de facturation existants sont conservés.

Documentation officielle consultée le 9 septembre 2026 :
- [OpenAI — sécurité des clés API](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety) : conserver les clés côté serveur et ne pas les publier dans un navigateur ni un dépôt.
- [OpenAI — facturation ChatGPT et API](https://help.openai.com/en/articles/9039756) : systèmes de facturation séparés. Un abonnement ChatGPT payant n’ajoute pas de quota à Cockpit.

## Validation et limites

Vérifier le typage, la compilation de chaque hébergeur, le rendu de la vitrine dans les quatre langues et les tests fonctionnels du parcours avant publication. Conserver les contrôles CI du dépôt Vercel. Ces contrôles n’établissent pas la disponibilité des fournisseurs ni la conversion commerciale en production.

Les paiements gardent leur état configuré, notamment l’indication du mode test si applicable. Aucun fournisseur, secret, accès utilisateur, prix ni schéma de stockage n’est changé par l’enrichissement de la vitrine. La politique de publication des deux sites reste celle de `DUAL-PUBLICATION.md`.
