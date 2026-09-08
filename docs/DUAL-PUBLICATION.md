# Publication des deux versions web

À chaque modification web de Cockpit Marchés AI, synchroniser les fonctions concernées sur les deux sites puis vérifier leurs publications :
- Vercel : https://cockpit-march-s-ai.vercel.app — dépôt linkinxhub/Cockpit-March-s-AI.
- ChatGPT Sites : https://cockpit-marches-ai.adil-btp.chatgpt.site — projet appgprj_6a90dcf0baa08191bd07d10baa36bdd0.

Reprendre la dernière révision distante avant modification. Porter les changements fonctionnels partagés sans écraser les adaptations propres aux hébergeurs (Auth0 sur Vercel, identité ChatGPT sur Sites, stockage, scripts et configuration). Préserver la vitrine Sites lors des mises à niveau.

Compiler chaque version modifiée. Publier les deux cibles avec leurs mécanismes respectifs et attendre la confirmation terminale de chacune. En cas de blocage d’une cible, signaler explicitement le décalage. Ne pas déclarer les deux versions à jour après une seule publication.

Le centre de mises à jour recharge la publication courante d’un hébergeur ; il ne synchronise pas les dépôts. La double publication est une étape de livraison à réaliser, pas une synchronisation automatique déjà installée. Les binaires Flutter suivent une livraison distincte.
