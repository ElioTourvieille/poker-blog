> **Brouillon / exemple.** Ce fichier illustre le format attendu et démarre le travail à partir de ce qui est connu dans l'état des lieux du 04/09/2026. Les sections marquées `[à compléter en session]` nécessitent une inspection réelle du repo par l'agent avant validation humaine — ne pas exécuter tel quel.

# Finir le reskin des pages restantes (Phase 01)

## Objectif

Appliquer l'identité PLO (palette noir/blanc/carmin, typographies Bebas Neue / Source Serif 4 / Inter, composants du design system déjà intégré) au reste du site. Le nav, le footer et le hero de la homepage sont déjà reskinnés — il reste les pages de contenu et de compte.

## Fichiers inspectés / skills lus

- `AGENTS.md`
- Skill `nextjs-app-router-i18n`
- Skill `sanity-cms-plo` (pour les pages qui consomment du contenu Sanity : liste blog, article, catégories, auteurs)
- `docs/design-tokens.md` (référence design system existante dans le repo)
- [à compléter en session] : liste exacte des 14 fichiers identifiés dans l'état des lieux comme portant encore "des bords arrondis et anciens contrastes" — à obtenir par inspection du repo, pas par supposition.

## Pages concernées

- Liste blog
- Article (page de détail)
- Catégories
- Auteurs
- À propos
- Contact
- Newsletter
- Auth (login/signup/reset — à confirmer quelles pages exactement existent)

## Hypothèses prises

- Le design system (`docs/design-tokens.md`) couvre déjà les composants nécessaires (boutons, cards, badges, inputs, états) pour habiller ces pages sans en inventer de nouveaux — **à confirmer en session** ; si un composant manque, le signaler avant de l'improviser.
- Ces pages consomment aujourd'hui zéro contenu réel (Sanity vide) — le reskin doit donc être vérifié avec des données de démonstration réalistes (voir skill `origin-studio-workflow`, section seed), pas seulement à vide.
- Aucune de ces pages ne touche à une écriture sensible (pas de logique de vote/soumission ici) — seul le rendu visuel change, pas le comportement.
- Des images de la maquette sont présentes dans `design/references`, elles sont à reproduire de manière la plus fidèle possible

## Fichiers à créer/modifier

`[à compléter en session après inspection]`

## Critères d'acceptation

- Chaque page respecte la règle 90 % noir/blanc, 10 % rouge maximum.
- Plus aucun bord arrondi ni contraste hérité de l'ancien habillage "The Royal" sur les 14 fichiers identifiés.
- Marque présente en continu (nav/footer/watermark cohérents avec la homepage déjà reskinnée).
- Dark mode permanent respecté, aucun toggle thème introduit.
- Bilingue FR/EN fonctionnel sur chaque page reskinnée (pas de régression de routing/i18n).

## Comment tester

- Typecheck, lint, build.
- Captures d'écran desktop + mobile de chaque page reskinnée, comparées à la maquette de référence.
- Navigation manuelle FR → EN sur chaque page pour vérifier l'absence de régression i18n.
- Vérification visuelle qu'aucune page ne réintroduit un composant hors design system.