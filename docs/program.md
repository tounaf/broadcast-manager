# Gestion des Programmes (Grille de Structure)

Le module **Programmes** définit la structure hebdomadaire de la station. Il ne s'agit pas du contenu final, mais des "cases" (slots) à remplir.

## Concept de "Slot"
Un slot est un créneau horaire défini par :
- **Heure de début**
- **Heure de fin**
- **Thématique/Genre** (ex: Film Action, Journal, Musique Gasy, Publicité)
- **Récurrence** (ex: Tous les lundis, du Lundi au Vendredi, etc.)

## Interface Utilisateur (Web/Mobile)
- Une vue calendrier hebdomadaire.
- Possibilité de glisser-déposer des blocs pour modifier la structure.
- Codes couleurs par thématique pour une lecture rapide.

## Implémentation Technique (Clean Architecture)

### 1. Couche Domaine (`src/Domain`)
- **Entité :** `ProgramSlot` (POPO) encapsulant les données métier (Heures, Jour, Libellé, Thème).
- **Entité :** `Theme` (POPO) définissant une catégorie (Label, Couleur).
- **Repository :** `ProgramSlotRepositoryInterface` et `ThemeRepositoryInterface`.

### 2. Couche Infrastructure (`src/Infrastructure`)
- **Mapping Doctrine :** 
    - `config/doctrine/ProgramSlot.orm.xml`
    - `config/doctrine/Theme.orm.xml`
- **Repository :** Implémentations Doctrine concrètes utilisant `ServiceEntityRepository`.

### 3. Couche Interface Utilisateur
- **API (Symfony) :** 
    - `ProgramSlotController` : `/api/programs` (CRUD).
    - `ThemeController` : `/api/themes` (GET/POST).
- **Frontend (React) :** 
    - `ProgramManager` : Grille interactive avec thème "Dark Slate".
    - `ThemePicker` : Gestionnaire de thématiques intégré permettant la création à la volée.
    - **Range Picker :** Sélection temporelle intuitive via sliders.

## Gestion des Thématiques
Les thématiques ne sont plus statiques. L'utilisateur peut :
- Choisir parmi les thèmes existants.
- Créer un nouveau thème avec un libellé et une couleur personnalisée directement depuis la modale de création d'un programme.
- Les couleurs sont synchronisées visuellement sur la grille hebdomadaire.

## Installation / Mise à jour
Suite aux changements de structure, il est impératif de mettre à jour la base de données :
```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```
