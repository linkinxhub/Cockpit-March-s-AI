# Configuration IA propriétaire

Page /admin/ai-settings ; API /api/admin/ai-settings. Sites réserve cet accès aux comptes actifs administrateurs de la liste ADMIN_EMAILS. Vercel le réserve au compte ADMIN correspondant au BOOTSTRAP_ADMIN_STABLE_USER_ID. Les rôles sont vérifiés côté serveur avant lecture, test ou écriture.

La clé saisie est envoyée uniquement au serveur de ce site et au service OpenAI officiel pour le test. Elle n’est jamais stockée dans le navigateur, renvoyée par l’API ou ajoutée aux journaux. Le chiffrement AES-256-GCM utilise un nonce aléatoire et une clé dérivée avec séparation de domaine du secret serveur AI_SETTINGS_ENCRYPTION_KEY ; Vercel peut utiliser AUTH0_SECRET existant. Ne pas changer ce secret sans rechiffrer la configuration ou ressaisir la clé. Le modèle, la date et l’auteur du dernier enregistrement sont sauvegardés avec le texte chiffré.

Le bouton Tester lance une petite requête Responses avec le modèle sélectionné. Enregistrer refait ce test avant d’écrire : un échec laisse la configuration précédente intacte. Un champ clé vide conserve la clé existante. Les réponses du fournisseur sont réduites à des codes génériques pour ne pas exposer la clé. Test et sauvegarde sont susceptibles d’être facturés par OpenAI.

La configuration enregistrée est prioritaire sur OPENAI_API_KEY et OPENAI_MODEL ; chaque analyse relit la configuration serveur sans nécessiter de redéploiement. Les deux hébergements disposent de paramètres distincts. La configuration existante de Vercel n’est pas écrasée lors de la publication. Les changements futurs sont possibles depuis cette page.
