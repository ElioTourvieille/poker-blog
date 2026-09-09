# /prompts — convention

Chaque feature, avant d'être implémentée, obtient un fichier ici : `NN-nom-de-la-feature.md`.

Ce fichier est écrit **par l'agent**, à partir d'un prompt humain court, après lecture de `AGENTS.md` + des skills pertinents + inspection du code existant. Il doit être **validé explicitement par un humain** avant que la moindre ligne de code ne soit écrite (voir skill `origin-studio-workflow`).

## Template

```markdown
# [Nom de la feature]

## Objectif
[Une à deux phrases]

## Fichiers inspectés / skills lus
[Liste]

## Hypothèses prises
[Liste]

## Fichiers à créer/modifier
[Liste]

## Critères d'acceptation
[Liste vérifiable]

## Comment tester
[Commandes, scénarios, captures d'écran attendues si UI]
```

## Pourquoi ce dossier existe

C'est la trace écrite du plan validé, versionnée dans le repo — pas seulement dans l'historique d'une session de chat qui disparaît. En cas de revue de code, on compare le résultat livré à `prompts/NN-nom-de-la-feature.md`, pas à un souvenir de conversation.

## Fichier d'exemple

`00-exemple-reskin-pages-restantes.md` — brouillon pré-rempli pour la prochaine étape connue de la roadmap PLO (finir le reskin des pages restantes, Phase 01). Il est volontairement marqué comme brouillon : certains champs ne peuvent être complétés qu'après inspection réelle du repo par l'agent, en session.
