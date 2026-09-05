---
name: sanity-cms-plo
description: Décisions PLO spécifiques sur Sanity — non couvertes par les skills officiels sanity-io déjà installés (sanity-best-practices, content-modeling-best-practices, portable-text-*, sanity-migration, seo-aeo-best-practices, agent-context). Charger cette skill EN COMPLÉMENT des skills officiels, jamais à leur place, pour toute feature touchant au contenu éditorial PLO ou au futur schéma handOfWeek.
---

# Sanity — décisions spécifiques PLO

> Pour la syntaxe Sanity (GROQ, schémas, portable text, migrations, SEO/AEO), consulter d'abord les skills officiels déjà installés dans `.claude/skills/` : `sanity-best-practices`, `content-modeling-best-practices`, `content-experimentation-best-practices`, `portable-text-conversion`, `portable-text-serialization`, `sanity-migration`, `seo-aeo-best-practices`. Cette skill-ci ne répète pas cette doc — elle documente uniquement ce qui est propre au projet PLO et qu'aucun skill générique ne peut connaître.

## Séparation stricte front / studio

Le front public **ne fait jamais d'écriture Sanity** depuis une route publique ou une Server Action accessible aux visiteurs. Sanity est l'outil des rédacteurs, pas une base transactionnelle pour l'interaction utilisateur — ça, c'est le rôle de Postgres/Drizzle (voir skill `better-auth-drizzle-neon`).

## Schéma en place chez PLO

`post`, `category`, `author`, `tag`, `page`, `siteSettings`. **Zéro document publié à ce jour** — toute feature de listing/pagination/recherche doit être testée avec un seed réaliste et volumineux (voir skill `origin-studio-workflow`), jamais 2-3 entrées factices.

Catégories : **le schéma ne modélise pas les 3 piliers éditoriaux** (Stratégie/Obsession/Drops) — `category` est un document libre (`title{fr,en}`, `slug` généré depuis `title.fr`, `description{fr,en}`, `color` hex, `icon` emoji), sans enum ni liste fixe. L'alignement sur les 3 piliers est une convention éditoriale à faire respecter au moment du seed de contenu, pas une contrainte de schéma — ne pas coder en dur un slug de catégorie en supposant qu'il existe déjà.

## À créer — schéma `handOfWeek` (Phase 03, pas commencé)

Nouvelle table de vérité de contenu — à proposer dans un prompt d'implémentation et faire valider avant création, pas un simple champ ajouté à un schéma existant. Champs pressentis à partir du besoin produit (à confirmer, pas à coder tel quel) :

- titre / identifiant de la main
- représentation de la main (cartes, position, stacks, action)
- date de reveal
- référence optionnelle vers un `post` d'analyse associé
- visuel/diagramme

Le vote associé (qui a voté, quand) vit côté **Postgres/Drizzle**, pas dans Sanity — Sanity reste le contenu éditorial de la main, pas la donnée d'interaction utilisateur.

## i18n du contenu — confirmé (vérifié 05/09/2026)

Champs localisés **inline sur le même document**, en objet `{fr, en}` — pas de documents séparés par langue. Confirmé sur `post` (`title`, `excerpt`, `body`), `category` (`title`, `description`), `page` (`title`, `body`), `author.bio`, `siteSettings.description`.

**Le `slug` n'est PAS localisé** : généré une seule fois à partir de `title.fr` (`options.source: 'title.fr'`), partagé tel quel par les deux langues (idem `author.slug` depuis `name`, `tag.slug` depuis `name`). Implication directe pour le routing bilingue : pas de slug EN distinct à gérer, mais pas non plus de moyen d'avoir une URL différente par langue pour un même contenu sans faire évoluer le schéma — à signaler si une feature en a besoin.

## Revalidation (à venir, Phase 05)

Pas de webhook de revalidation Sanity → Next.js à ce jour. En attendant, le front tourne en ISR classique. Ne pas construire le webhook en marge d'une autre feature — le signaler comme dette Phase 05 si besoin s'en fait sentir plus tôt.
