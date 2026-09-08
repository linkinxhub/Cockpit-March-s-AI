# Feedback avec capture

Le bouton « Votre avis » est disponible sur la vitrine et le cockpit. Un compte actif est requis pour envoyer un message. Le formulaire est disponible en FR, EN, DE et NL. La capture d’écran est volontaire, dépend du navigateur, et dispose d’une alternative par fichier PNG/JPEG/WebP. L’image est réencodée en JPEG, sans métadonnées, et plafonnée à 700 000 caractères base64 (environ 512 Ko). Le corps JSON est limité à 800 000 octets. Aucun cookie, token ou paramètre d’URL n’est joint.

La boîte `/admin/feedback` et ses API sont réservées au rôle administrateur existant, le niveau le plus élevé de l’application (ADMIN sur Vercel, admin sur Sites). Les membres Support et les utilisateurs ne peuvent pas lire les messages ni les images. Le statut peut passer de Nouveau à En cours ou Résolu ; le dernier administrateur et la date sont enregistrés. Les 100 derniers messages sont affichés. Les images sont chargées à la demande avec des en-têtes privés sans cache. Limite de 10 retours par heure et par compte.

Chaque hébergement conserve ses propres retours : il ne s’agit pas d’une boîte fusionnée entre les deux sites. La livraison se fait dans l’espace administrateur, sans notification par e-mail.

Sites : métadonnées dans D1, images privées dans R2 FEEDBACK_IMAGES ; migration Drizzle appliquée à la publication.
Vercel : table PostgreSQL feedback, pièces jointes bornées dans la même base. Le build de production applique uniquement la migration additive 0007_feedback.sql ; il échoue si le stockage est indisponible. Les previews ne modifient pas la base de production.
