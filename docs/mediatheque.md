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

---

## Fonctionnalités Avancées Récentes

Afin de simplifier et fiabiliser la planification des grilles de diffusion par l'utilisateur, plusieurs fonctionnalités majeures ont été intégrées :

### 1. Suivi des Diffusions ("Déjà diffusé")
Lors de la création de programmes ou de la planification des playlists, l'utilisateur a désormais une visibilité immédiate sur le statut de diffusion de chaque média :
- **Calcul automatique** : L'API backend (`MediaController` et `PlaylistRepository`) analyse toutes les playlists existantes. Si un média est associé à au moins un élément de playlist (quel que soit le jour ou le créneau), il est immédiatement considéré comme **diffusé**.
- **Badge visuel** : Dans l'interface de la Médiathèque, un badge orange distinctif `⏱️ DIFFUSÉ` s'affiche à côté du titre du média pour donner une visibilité instantanée.
- **Aucun blocage** : L'utilisateur n'est pas bloqué s'il souhaite rediffuser un contenu. L'information est purement indicative et informative.

### 2. Organisation par Onglets (Tabs)
Pour faciliter le filtre et la recherche des médias, la barre de la Médiathèque est découpée en trois onglets :
- **Tous** : Affiche l'intégralité du catalogue des médias disponibles (diffusés et non diffusés).
- **Non diffusés** : Filtre la liste pour afficher uniquement les nouveaux médias qui n'ont encore jamais été planifiés. Très utile pour trouver rapidement de nouveaux contenus à programmer.
- **Déjà diffusés** : Filtre la liste pour n'afficher que les médias ayant déjà fait l'objet d'une planification passée ou future.

### 3. Retrait Facilité des Médias d'une Playlist
Lors de l'édition d'une playlist (après un glisser-déposer ou un clic pour ajouter un média) :
- **Bouton de suppression explicite** : Chaque média présent dans la séquence dispose d'un bouton rouge de suppression `🗑️ Retirer` toujours visible (et non plus masqué sous un survol), facilitant la suppression sur les appareils tactiles et mobiles.
- **Fidélité de la base de données** : Le mécanisme de sauvegarde dans le backend Symfony (`PlaylistController`) a été fiabilisé pour s'assurer que les retraits de médias soient instantanément et correctement appliqués dans la base de données SQLite/PostgreSQL (gestion sécurisée de la collection Doctrine via conversion en tableau).

### 4. Gestion de l'Import des Fichiers `.avi`
Certains navigateurs web ne supportent pas nativement la lecture ou l'extraction automatique des métadonnées (comme la durée en secondes) pour les conteneurs/codecs spécifiques tels que le format `.avi` :
- **Comportement précédent** : L'importation échouait silencieusement ou bloquait l'utilisateur.
- **Mécanisme de repli (Fallback)** : Désormais, si le lecteur HTML5 du navigateur rencontre une erreur lors de l'extraction des métadonnées du fichier (cas des fichiers `.avi`), le système ne bloque plus l'importation. Il extrait le nom du fichier sans extension pour préremplir le titre, laisse le champ de la durée vide (ou à 0) et ouvre directement la modale de création "Nouveau Média" pour permettre à l'utilisateur de saisir manuellement la durée exacte en secondes.
