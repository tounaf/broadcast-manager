# Gestion des Playlists (Planification Opérationnelle)

Le module **Playlists** permet de remplir les slots définis dans la structure de programme avec du contenu réel.

## Fonctionnement
Pour chaque jour de la semaine, l'opérateur accède à une vue chronologique des slots.
1. **Sélection du jour** : Un sélecteur de date permet de naviguer dans le calendrier.
2. **Vue des slots** : Les slots programmés pour ce jour s'affichent avec leur statut (Vide, Brouillon, À valider, Validé).
3. **Édition** : En cliquant sur un slot, l'opérateur ouvre l'éditeur de playlist.
4. **Médiathèque intégrée** : Une barre latérale permet de rechercher et d'ajouter des médias (films, clips, publicités, fillers).
5. **Gestion de la durée** : Une barre de progression visuelle indique en temps réel le taux de remplissage du slot par rapport à sa durée définie dans le programme. Les dépassements sont signalés en rouge.
6. **Réorganisation** : Les médias peuvent être ajoutés ou supprimés pour ajuster la séquence de diffusion.

## Données Techniques
- **Entités** : `Playlist` (date, statut, slot), `PlaylistItem` (media, position), `Media` (titre, durée, type).
- **API** :
  - `GET /api/playlists/daily?date=YYYY-MM-DD` : Liste des slots et playlists pour un jour.
  - `POST /api/playlists/{slotId}` : Mise à jour ou création d'une playlist.
  - `GET /api/medias` : Accès au catalogue.

## Validation
Une fois la playlist d'une journée complétée et équilibrée en durée, elle passe au statut "À Valider". Un administrateur peut alors la réviser avant diffusion.
