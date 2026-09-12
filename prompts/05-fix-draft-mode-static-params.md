# Fix — draftMode() dans generateStaticParams casse le build

## Objectif

Corriger un bug bloquant `npm run build` (échoue sur `master`, avant toute autre feature) : `generateStaticParams` de `blog/[slug]`, `categories/[slug]` et `auteurs/[slug]` échoue avec `Route ... used draftMode() inside generateStaticParams`. Gap déjà repéré et documenté dans le message du commit `2377a6d` ("à signaler séparément") mais jamais corrigé depuis ni consigné dans AGENTS.md.

## Fichiers inspectés

- `app/[locale]/blog/[slug]/page.tsx`, `app/[locale]/categories/[slug]/page.tsx`, `app/[locale]/auteurs/[slug]/page.tsx` — les trois `generateStaticParams` fautifs
- `lib/sanity/fetch.ts` — `getPostPaths`, `getCategoryPaths`, `getAuthorPaths`, seules fonctions appelées depuis un `generateStaticParams`
- `sanity/lib/live.ts` — `sanityFetch` vient de `next-sanity/live` (`defineLive`), qui appelle `draftMode()` en interne pour supporter Presentation/Visual Editing — API request-scope, indisponible au moment du build (`generateStaticParams` s'exécute sans requête HTTP)
- `sanity/lib/client.ts` — un client Sanity "plain" (`client`, `useCdn: true`, pas de draft mode) existe déjà et est déjà utilisé ailleurs pour les lectures publiées sans besoin de preview

## Cause racine

Toutes les fonctions de `lib/sanity/fetch.ts` passent par `sanityFetch` (draft-mode aware) — y compris les trois qui ne servent qu'à lister des slugs pour `generateStaticParams`, où ni le mode brouillon ni le live-refresh n'ont de sens (le build génère toujours des pages statiques à partir du contenu publié).

## Fichiers à modifier

- `lib/sanity/fetch.ts` — `getPostPaths`, `getCategoryPaths`, `getAuthorPaths` : remplacer `sanityFetch` (import de `@/sanity/lib/live`) par le client Sanity brut `client.fetch(...)` (import de `@/sanity/lib/client`). Aucune autre fonction de ce fichier n'est appelée depuis un `generateStaticParams` — pas touchée.

## Hypothèses

1. Correction technique pure (pas de choix produit) — pas de point ouvert AGENTS.md concerné. Je documente quand même dans `/prompts/` par cohérence avec la convention du repo, mais je n'attends pas de validation supplémentaire au-delà de l'accord déjà donné de corriger le build en premier.
2. Le comportement runtime des pages elles-mêmes (rendu, preview via `/api/draft-mode/enable`) n'est pas concerné — seule la collecte des chemins au build change de client.

## Critères d'acceptation

- `npm run build` termine sans l'erreur `draftMode() inside generateStaticParams`.
- Aucune régression sur le preview/draft mode des pages (`generateMetadata`/le composant de page continuent d'utiliser `sanityFetch`, donc restent draft-aware).
- `npx tsc --noEmit`, `npm run lint` : aucune nouvelle erreur.

## Comment tester

- `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Vérifier que les pages `/blog/[slug]`, `/categories/[slug]`, `/auteurs/[slug]` sont bien pré-générées (liste des routes dans la sortie de build).
- Activer le draft mode (`/api/draft-mode/enable`) et vérifier qu'un contenu brouillon reste visible sur ces pages en dev (le rendu runtime n'a pas changé de client).
