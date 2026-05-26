# Gestion des Playlists (Planification Opérationnelle)

Le module **Playlists** permet de remplir les slots définis dans la structure de programme avec du contenu réel.

## Fonctionnement
Pour chaque jour de la semaine, l'opérateur voit la liste des slots vides.
1. Il sélectionne un slot (ex: 06h00 - Film Action).
2. Il accède à la médiathèque pour choisir un film spécifique (ex: Jackie Chan - Police Story).
3. Le système affiche automatiquement la durée restante du slot si le contenu est plus court.
4. L'opérateur comble le vide avec des "fillers" (clips, autopromos, spots pub).

## Automatisation
Le système peut proposer des remplissages automatiques basés sur l'historique :
- "Ce film n'a pas été diffusé depuis 3 mois."
- "Ce spot publicitaire doit passer prioritairement dans ce créneau."

## Validation
Une fois la playlist d'une journée complétée, elle passe au statut "À Valider" pour la direction.
