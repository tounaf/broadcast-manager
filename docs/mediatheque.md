# Médiathèque (Gestion des Assets)

La **Médiathèque** est le catalogue central de tous les contenus disponibles pour la diffusion.

## Données Stockées (Metadata)
Chaque contenu est indexé avec les informations suivantes :
- **ID Unique**
- **Titre**
- **Durée exacte** (HH:MM:SS)
- **Catégorie** (Action, Documentaire, News, Musique, Pub)
- **Source** (YouTube, Disque Dur Local, Production Interne)
- **Localisation physique** (Chemin du fichier au studio)

## Synchronisation
Puisque l'application est sur le web et les fichiers sont au studio :
- Un script local au studio scanne les fichiers et met à jour la base de données web.
- L'opérateur peut ainsi voir ce qui est "prêt" sans avoir à télécharger les vidéos sur son téléphone.

## Gestion des Nouveautés
L'opérateur peut ajouter de nouveaux éléments depuis son mobile en saisissant simplement le titre et la durée après un téléchargement YouTube, par exemple.
