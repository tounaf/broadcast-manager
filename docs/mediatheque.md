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

## Importer depuis le disque

L'interface permet d'importer un fichier audio ou vidéo directement depuis le disque dur. Le flux est le suivant :

- Cliquer sur le bouton `Importer` dans la médiathèque.
- Choisir un fichier local (audio/video). L'interface lira le fichier en local pour extraire automatiquement :
	- le titre (prérempli depuis le nom du fichier sans extension),
	- la durée en secondes (extrait via un élément audio/vidéo HTML5).
- Une barre de progression indique l'avancement de la lecture et de l'extraction des métadonnées.
- Une fois l'extraction terminée, un formulaire s'ouvre avec les champs préremplis ; l'utilisateur peut ajuster le `type` (film/clip/pub/filler) puis `Enregistrer` pour créer l'entrée dans la médiathèque.

Notes techniques :

- L'extraction de la durée est effectuée côté client via `URL.createObjectURL(file)` et l'écoute de l'événement `loadedmetadata` d'un élément `audio` ou `video`.
- Aucun fichier n'est envoyé automatiquement au serveur par défaut ; le backend actuel prend une entrée JSON `{ title, duration, type }`. Si tu souhaites stocker le fichier sur le serveur, il faudra ajouter un endpoint d'upload (`multipart/form-data`) côté API.
- Pendant l'import un retour visuel (barre de progression et pourcentage) est affiché pour guider l'utilisateur.

Si tu veux que je rajoute l'upload du fichier sur le serveur (stockage et lien), dis-le moi et j'ajouterai l'endpoint API et la gestion côté client.
