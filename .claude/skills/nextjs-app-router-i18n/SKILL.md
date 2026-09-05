---
name: nextjs-app-router-i18n
description: Conventions Next.js 16 App Router bilingue FR/EN pour PLO (Origin Studio). Charger systématiquement cette skill pour toute feature touchant au routing, aux layouts, aux Server/Client Components, aux Server Actions, au SEO par locale, ou à la revalidation — même si la demande semble simple ("ajoute une page", "crée un formulaire"). Contient une hypothèse sur la librairie i18n à confirmer contre le repo réel avant tout usage.
---

# Next.js App Router + i18n — PLO

## i18n — confirmé sur le repo (vérifié 05/09/2026)

Le routing bilingue repose bien sur un segment `[locale]` dans `app/`, avec **next-intl** (`next-intl@^4.13.0` dans `package.json`, `defineRouting({ locales: ['fr', 'en'], defaultLocale: 'fr' })` dans `i18n/routing.ts`). Si une divergence majeure apparaît par rapport à ce qui suit (nouvelle lib, structure différente), corriger cette skill en premier — elle sert de référence à toutes les features suivantes.

## Arborescence réelle

```
app/
  [locale]/
    layout.tsx          # layout racine par locale (fonts, providers, nav/footer)
    page.tsx            # homepage
    blog/, blog/[slug]/
    categories/, categories/[slug]/
    auteurs/, auteurs/[slug]/
    auth/login/
    a-propos/, contact/, newsletter/
proxy.ts                # PAS middleware.ts — Next.js 16 a renommé la convention.
                         # Enveloppe next-intl (createIntlMiddleware) + garde d'auth
                         # (cookie better-auth.session_token) sur /dashboard, /submit-hand,
                         # /profile — ces 3 routes n'existent pas encore sous app/[locale]/.
i18n/
  routing.ts, navigation.ts, request.ts
messages/
  fr.json, en.json
```

**Point d'attention Next.js 16** : ne jamais créer de `middleware.ts` — toute logique de routing/garde s'ajoute dans `proxy.ts`, qui existe déjà et porte deux responsabilités (i18n + gate d'auth).

## Server vs Client Components

- **Server Component par défaut.** Ne jamais ajouter `"use client"` par réflexe en tête de fichier.
- Client Component réservé à l'interactivité réelle : vote "Main de la semaine", formulaire de soumission de main, dropdown/menu, like/bookmark en optimistic UI, formulaire newsletter.
- Un composant server peut englober un sous-composant client minimal (pattern "îlot") plutôt que de faire remonter `"use client"` à toute une page.

## Server Actions vs routes API existantes

- Les routes API pour comments/likes/bookmarks/soumissions de main **existent déjà** — ne pas les dupliquer avec des Server Actions sans que ce soit explicitement le scope de la feature demandée.
- Pour toute **nouvelle** écriture déclenchée par un formulaire (ex. vote Main de la semaine), Server Action de préférence à une route API + fetch client, sauf si la cohérence avec les routes existantes impose l'inverse — le signaler dans le prompt d'implémentation si un choix est fait.

## SEO / metadata par locale

- `generateMetadata` par route, localisé (titre, description, OG).
- `hreflang` FR/EN sur toutes les pages de contenu.
- Sitemap dynamique : **pas encore construit** (Phase 05 de la roadmap) — ne pas l'improviser en marge d'une autre feature, le signaler comme dette si une feature en cours en aurait besoin.

## Revalidation

- Pas de webhook de revalidation Sanity en place à ce jour (Phase 05).
- En attendant : ISR classique (`revalidate` raisonnable, ex. quelques minutes) sur les pages consommant Sanity. Ne pas mettre `revalidate: 0` par défaut — ça annule le bénéfice du cache sans qu'on l'ait décidé.

## Avant d'utiliser une API Next.js spécifique

Next.js 16 App Router a beaucoup évolué entre versions mineures (routing, caching, `use cache`, conventions de metadata). Avant d'utiliser une API dont la syntaxe exacte n'est pas certaine, interroger **Context7** (MCP connecté) pour la doc à jour de la version réellement installée plutôt que de se fier à la mémoire d'entraînement.
