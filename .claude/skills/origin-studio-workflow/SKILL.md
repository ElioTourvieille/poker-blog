---
name: origin-studio-workflow
description: Méthode de développement agentique Origin Studio — branches/PR, format du prompt d'implémentation, revue de code, sécurité, analytics, discipline de session. À charger en toile de fond sur TOUS les projets Origin Studio (Next.js, NestJS, Python), indépendamment de l'outil métier concerné. Ne pas confondre avec les skills techniques par outil (CMS, auth, etc.) — celle-ci capture le process, pas une lib précise.
---

# Origin Studio Workflow

Cette skill est générique : elle capture la méthode de travail du studio, pas la connaissance d'un outil précis. Elle s'applique identiquement sur un projet Next.js/Sanity, un projet NestJS/Prisma, ou un pipeline Python — seul le skill technique associé change.

## Boucle par feature (rappel)

1. Prompt humain court (le contexte lourd vit dans `AGENTS.md` + les skills, pas dans le prompt).
2. Inspection par l'agent : `AGENTS.md`, skills concernés, code existant.
3. Questions ciblées si ambiguïté — ne jamais deviner un choix produit ou architecture.
4. Prompt d'implémentation écrit dans `/prompts/[nom-feature].md`.
5. **Validation humaine explicite avant exécution** — point de contrôle non négociable.
6. Implémentation + auto-vérification (typecheck, lint, build, captures d'écran si UI).
7. Branche dédiée + PR — jamais de commit direct sur `main`.
8. Revue de code automatisée avant merge.
9. Merge.

## Format du prompt d'implémentation (`/prompts/[nom-feature].md`)

```markdown
# [Nom de la feature]

## Objectif
[Une à deux phrases]

## Fichiers inspectés / skills lus
[Liste]

## Hypothèses prises
[Liste — chaque hypothèse non confirmée doit être visible ici, pas enfouie dans le code]

## Fichiers à créer/modifier
[Liste]

## Critères d'acceptation
[Liste vérifiable — pas "ça marche bien" mais des critères testables]

## Comment tester
[Commandes, scénarios manuels, captures d'écran attendues si UI]
```

## Conventions Git

- Branches : `feature/nom-court`, `fix/nom-court`.
- Une PR = une feature = une session de chat dédiée. Ne pas enchaîner plusieurs features distinctes dans la même branche/PR.
- Le titre de PR référence le fichier `/prompts/[nom-feature].md` correspondant, pour que la revue humaine puisse comparer le plan validé au résultat livré.

## Revue de code

- Chaque PR passe par une revue automatisée avant merge, **dès la première feature** — pas seulement en fin de projet.
- Outil pressenti côté studio : CodeRabbit (ou équivalent CI de revue + scan secrets/dépendances). À confirmer/brancher sur chaque nouveau repo dès la Phase 01.

## Sécurité

- Scan de secrets exposés + dépendances vulnérables en continu sur chaque PR.
- Deep scan avant les jalons importants : mise en prod, ou toute feature combinant endpoint public + appel à un modèle IA ou paiement.
- Vigilance particulière sur les **vulnérabilités d'architecture** (chaque ligne isolée est correcte, mais l'interaction entre composants crée la faille) :
  - Endpoint public qui déclenche un appel IA sans rate limit ni plafond de coût → DoS financier.
  - Reverse-proxy same-origin pour un outil d'analytics, combiné à des cookies de session → fuite de cookies sensibles vers un tiers.
- Ne jamais considérer le coût d'un deep scan comme optionnel dès qu'il s'agit d'un projet réel destiné à des utilisateurs (par opposition à un prototype jetable).

## Analytics

- Installé tôt dans le projet, pas en fin de parcours.
- Plan de tracking précis par feature livrée (événements + propriétés), pas seulement des pageviews génériques. Captation côté serveur quand l'action déclenchante est côté serveur.
- Les questions produit précèdent les dashboards : "est-ce que les gens utilisent X ?", "est-ce que ceux qui utilisent X vont plus loin que les autres ?" — pas le volume de trafic brut pour lui-même.
- Jamais de donnée personnelle identifiable au-delà de l'identifiant utilisateur déjà géré par l'auth.

## Discipline de session

- **Une session de chat = une feature.** Ne pas enchaîner plusieurs features dans une session interminable — la qualité se dégrade avec un contexte trop chargé ("context rot"), souvent avant même d'atteindre la limite technique de la fenêtre.
- Repère empirique : viser un budget de l'ordre de 100–150k tokens par session, quelle que soit la fenêtre annoncée par le modèle utilisé.

## Données de test / seed

- Faire générer un jeu de données réaliste et volumineux plutôt que quelques entrées factices, pour tester dans des conditions proches du réel (recherche, tri, pagination).
- Le plan de seed est **toujours validé avant exécution** — c'est la première fois que l'agent écrit dans la base réelle, ça ne se valide jamais à l'aveugle.

## Features à risque

- Décomposer en sous-étapes explicites avec un scope clairement délimité à chaque fois ("pour l'instant on ne construit que X, pas Y") plutôt que de tout demander d'un coup.

## Maquettes UI

- Toute feature UI doit partir d'une maquette visuelle fournie, reproduite fidèlement (layout, spacing, typo, états) — pas "s'en inspirer". Comparaison écran par écran, multi-résolutions, jusqu'à correspondance.