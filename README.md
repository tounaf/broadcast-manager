# Broadcast Manager - Digitalisation TV & RADIO (Madagascar)

Ce projet vise à digitaliser la gestion d'une station de TV et Radio à Madagascar, remplaçant les processus manuels basés sur Word par une plateforme web moderne et accessible (PWA).

## Contexte du Projet

Actuellement, la programmation est gérée sous Microsoft Word. Une seule personne s'occupe de la création des programmes, des playlists, du téléchargement de contenus (YouTube, films, documentaires) et de la gestion des publicités. 

L'objectif est d'offrir une autonomie totale à l'opérateur (travail à distance via mobile/web) et une supervision en temps réel pour la direction.

## Architecture du Projet : Clean Architecture

Pour garantir la pérennité du projet et faciliter les futures migrations ou évolutions, nous utilisons la **Clean Architecture**.

### Structure des dossiers (`src/`)

- **`Domain/`** : Le cœur métier. Contient les entités, les objets de valeur (Value Objects) et les interfaces des dépôts (Repositories). Cette couche est indépendante de tout framework.
- **`Application/`** : Contient la logique applicative (Cas d'utilisation / Use Cases). Elle orchestre le flux de données vers et depuis les entités du domaine.
- **`Infrastructure/`** : Implémentations techniques. Contient les dépôts Doctrine, les services externes (APIs), la configuration de persistance et les outils spécifiques au framework Symfony.
- **`UserInterface/`** : Point d'entrée des utilisateurs. Contient les Contrôleurs Symfony (API & Web), les formulaires, et les commandes CLI. C'est également ici que s'intègre la couche React.

## Stack Technique

- **Backend** : Symfony 7+ (PHP 8.4)
- **Frontend** : React.js via Webpack Encore
- **Mobile** : Progressive Web App (PWA) pour une installation sur smartphone
- **Base de données** : PostgreSQL

## Documentation Fonctionnelle

Les détails fonctionnels sont disponibles dans le dossier `docs/` :
- [Gestion des Programmes](docs/program.md) : Définition de la grille de structure (slots).
- [Gestion des Playlists](docs/playlist.md) : Remplissage des slots par du contenu réel.
- [Médiathèque](docs/mediatheque.md) : Indexation des contenus (films, YouTube, etc.).
- [Tableau de bord (Dashboard)](docs/dashboard.md) : Supervision pour la direction.

## Installation & Lancement

```bash
# Installation des dépendances PHP
composer install

# Installation des dépendances JS
npm install

# Compilation des assets (React)
npm run dev

# Lancement du serveur local
symfony serve
```
