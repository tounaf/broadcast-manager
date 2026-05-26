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
- **Entité :** `ProgramSlot` (POPO) encapsulant les données métier (Heures, Jour, Thème).
- **Repository :** `ProgramSlotRepositoryInterface` définissant les opérations de persistance.

### 2. Couche Infrastructure (`src/Infrastructure`)
- **Mapping Doctrine :** Configuration XML dans `config/doctrine/ProgramSlot.orm.xml` pour découpler le domaine de la base de données.
- **Repository :** `DoctrineProgramSlotRepository` implémentant l'interface du domaine via Doctrine ORM.

### 3. Couche Interface Utilisateur
- **API (Symfony) :** `ProgramSlotController` fournissant des endpoints REST (`GET`, `POST`, `PUT`, `DELETE`).
- **Frontend (React) :** 
    - `ProgramManager` : Composant principal gérant l'état et l'affichage.
    - **Grille Hebdomadaire :** Affichage visuel 24h/7j avec CSS Grid.
    - **Range Picker :** Utilisation de curseurs (sliders) pour une sélection précise des horaires sans saisie manuelle.
    - **Thématisation :** Couleurs dynamiques via Tailwind CSS.

## Utilisation
1. Accéder à l'onglet **Programmes**.
2. Cliquer sur un créneau existant pour le modifier ou sur "+ Nouveau" pour en créer un.
3. Utiliser les sliders pour ajuster les heures de début et de fin.
4. Enregistrer pour synchroniser avec la base de données.
