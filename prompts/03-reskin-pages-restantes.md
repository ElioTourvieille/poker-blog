# Finir le reskin des pages restantes (Phase 01)

## Objectif

Appliquer fidèlement l'identité PLO (palette noir/blanc/carmin, typographies Bebas Neue / Source Serif 4 / Inter, composants `app/globals.css`) aux pages et composants qui ne sont pas encore alignés sur le design system ni sur les maquettes `design/references/blog.png` et `design/references/article.png`, et terminer la homepage au-delà du hero (sections "Dernières publications" et "Le Cercle" de `design/references/homepage.png`, hors section Main de la semaine — Phase 03, pas commencée).

## Fichiers inspectés / skills lus

- `AGENTS.md`
- Skills : `nextjs-app-router-i18n`, `origin-studio-workflow`, `sanity-cms-plo`
- `docs/design-tokens.md`
- `app/globals.css` (source de vérité réelle des tokens — voir constat ci-dessous)
- `design/references/homepage.png`, `blog.png`, `article.png`, `dashboard.png` (pour confirmer le périmètre hors scope : dashboard = Phase 04, non traité ici)
- Toutes les pages sous `app/[locale]/` (12 fichiers) et les composants `components/blog/*`, `components/ui/*`, `components/auth/UserMenu.tsx`, `components/auth/LoginButton.tsx`, `components/newsletter/NewsletterForm.tsx`, `components/layout/Navbar.tsx`, `components/layout/Footer.tsx` (référence "déjà fait")
- `messages/fr.json` (structure des namespaces i18n existants)

## Constat d'inspection — important

`app/globals.css` repointe déjà les anciens tokens sémantiques Material (`bg-surface`, `text-on-surface`, `text-on-surface-variant`, `border-outline-variant`, `text-secondary`, `bg-inverse-surface`, `font-serif`…) vers la palette PLO. **Donc une majorité des pages non reskinnées ont déjà les bonnes couleurs "par transitivité"** — ce n'est pas là qu'est le vrai travail restant. Trois problèmes distincts, de gravité croissante :

1. **Pages qui n'utilisent même pas les tokens sémantiques** — Tailwind brut avec palette `zinc-*` et variantes `dark:` (donc supposent un toggle clair/sombre, ce qui viole la règle "dark mode permanent, jamais de toggle"), `rounded-xl/2xl/full` hors avatars.
2. **Pages qui utilisent les tokens sémantiques (couleurs OK) mais violent les règles typo/radius/marque** : titres en `font-serif` (Source Serif) alors que `docs/design-tokens.md` réserve Source Serif au corps d'article et impose Bebas Neue (`font-ui`/`font-display`) pour "tous les titres de page" ; `rounded-full`/`rounded-xl`/`rounded-2xl` hors avatars (max autorisé : 4px) ; nom de marque résiduel **"The Royal"** (login) et **"PokerBlog"** (metadata + copy newsletter) au lieu de PLO.
3. **Pages avec maquette fournie mais dont la structure diverge du mockup**, pas seulement les tokens : liste blog, article, homepage (hors hero).

## Hypothèses prises

1. **Pages sans maquette dédiée** (catégories, auteurs, à-propos, contact, newsletter, login, politique de confidentialité) : pas de fichier `design/references/*` pour elles. Je les habille avec les composants du design system (`.badge`, `.btn-primary/secondary/outline-dark`, `.card-article`, `.input-newsletter`, tokens de `docs/design-tokens.md`) en réutilisant les patterns déjà établis par les maquettes blog/article (headers de page en `text-display`, structure de card, etc.), sans inventer de nouvelle direction visuelle.
2. **Pagination blog/catégories** : restyle visuel uniquement (bouton "Charger l'archive" stylé comme le mockup mais qui reste un lien `?page=N`, pas de fetch client dynamique) — confirmé avec l'utilisateur.
3. **Homepage hors hero** : dans le périmètre — confirmé avec l'utilisateur. J'ajoute la section "Dernières publications" (fond blanc, titre `text-display`, grand article + articles empilés) et "Le Cercle" (citations, fond sombre) du mockup `homepage.png`. La section "Main de la semaine" (fond feutré vert) reste hors scope — Phase 03 pas commencée, aucune donnée `handOfWeek` n'existe.
4. **`components/ui/Breadcrumb.tsx`** : composant actuellement inutilisé nulle part dans `app/` (vérifié par recherche) et absent des deux maquettes fournies. Je le reskin quand même par cohérence (tokens + radius) puisque c'est un composant partagé à faible risque, mais je ne l'intègre à aucune page — pas dans le mockup, pas dans le brouillon initial. Si un usage futur est prévu, à clarifier séparément.
5. **`app/[locale]/auth/login/page.tsx`** : aucune maquette fournie pour l'écran de login. Je conserve la structure actuelle (Google + magic link) et je corrige uniquement : nom de marque ("The Royal" → "PLO", avec le logo comme Navbar/Footer plutôt qu'un texte), typographie (titres en Bebas), radius (max 4px), et j'ajoute l'i18n manquante (la page est actuellement 100% en français en dur, aucune clé `messages/*.json` — nouvelle violation "bilingue FR/EN" détectée pendant l'inspection, à corriger en créant un namespace `auth`).
6. **Contenu de démonstration** : ces pages consomment Sanity (zéro document publié à ce jour) — le reskin sera vérifié à la fois à vide (états `noResults`/vides) et avec des données de démo locales/mockées le temps du test visuel, sans écrire quoi que ce soit dans Sanity (aucun seed réel, conformément à AGENTS.md).
7. Aucune écriture Postgres ni Sanity dans cette feature — uniquement du rendu.

## Fichiers à créer/modifier

**Pages (`app/[locale]/`)**
- `page.tsx` (homepage) — ajout sections "Dernières publications" (fond blanc/`section-light`, titre `text-display`) et "Le Cercle" (citations, fond sombre) ; passage des titres `font-serif` restants (`h2` "Dernières dispatches", newsletter) en `text-display`/`font-ui`
- `blog/page.tsx` — restructuration fidèle à `blog.png` : header `text-display` "LE BLOG" + intro, filtres en liens soulignés (plus de pills `rounded-full`), grille asymétrique (1 grande card + cards empilées), bouton "Charger l'archive" au lieu du composant `Pagination` numéroté
- `blog/[slug]/page.tsx` — hero image + badge catégorie en overlay, titre `text-display` avec accent rouge partiel, tags en bas d'article, section "Continuer la lecture" alignée sur le mockup
- `categories/[slug]/page.tsx` — titres `font-serif` → `text-display`, nettoyage radius
- `auteurs/[slug]/page.tsx` — titres `font-serif` → `text-display`, nettoyage radius
- `a-propos/page.tsx` — remplacement intégral `zinc-*`/`dark:` par tokens PLO + typo
- `contact/page.tsx` + `contact/ContactForm.tsx` — idem, formulaire aligné sur `.input-newsletter`/`.btn-primary`
- `newsletter/page.tsx` — titres `font-serif` → `text-display`, `rounded-lg` → `rounded-none`, correction marque "PokerBlog" → "PLO"
- `auth/login/page.tsx` — correction marque "The Royal" → "PLO" (logo), typo, radius, ajout i18n (nouveau namespace `auth` dans `messages/fr.json` + `messages/en.json`)
- `politique-de-confidentialite/page.tsx` — remplacement `zinc-*`/`dark:` par tokens PLO + typo (le texte légal reste "en attente", cf. gap déjà signalé dans `AGENTS.md`)

**Composants**
- `components/blog/ArticleCard.tsx` — carte alignée sur `blog.png` (badge catégorie positionné comme la maquette, titre `text-display`, radius retiré sur l'image)
- `components/blog/FeaturedArticle.tsx` — idem, badge catégorie en `.badge` plutôt que pill `rounded-full`
- `components/blog/CategoryBadge.tsx` — variante `chip` en `.badge` (design system) plutôt que pill `rounded-full` ad hoc
- `components/blog/AuthorCard.tsx` — remplacement intégral `zinc-*`/`dark:` par tokens PLO
- `components/blog/PortableTextRenderer.tsx` — titres de corps (`h2`/`h3`/`h4`) en `font-ui`/Bebas (cf. `article.png` : les sous-titres d'article sont en Bebas, pas en serif) ; le texte courant (`normal`, `listItem`) reste en Source Serif — conforme à la règle "éditorial = corps uniquement" ; radius image `rounded-xl` → `rounded-none`
- `components/ui/Pagination.tsx` — restyle complet : bouton "Charger l'archive" (voir hypothèse 2), suppression `zinc-*`/`dark:`
- `components/ui/Breadcrumb.tsx` — tokens PLO + radius (cf. hypothèse 4, non intégré à une page)
- `components/auth/UserMenu.tsx` — dropdown `rounded-xl` → `rounded-none`
- `components/auth/LoginButton.tsx` — `rounded-lg` → classe `.btn-primary`/`.btn-secondary` du design system
- `components/newsletter/NewsletterForm.tsx` — alignement mineur (titres `font-serif` → `text-display` sur les états de confirmation)

**i18n**
- `messages/fr.json`, `messages/en.json` — nouveau namespace `auth` (login), clés "Le Cercle" pour la homepage (`home.cercle*`), vérification qu'aucune chaîne de la page login ne reste en dur

## Critères d'acceptation

- Chaque page/composant listé respecte la règle 90 % noir/blanc, 10 % rouge maximum.
- Plus aucune classe `zinc-*`/`slate-*`/`dark:` (pattern toggle clair/sombre) sur les fichiers listés.
- Plus aucun `rounded-lg/xl/2xl` hors avatars — maximum `rounded` (4px), sauf `rounded-full` réservé aux avatars/miniatures rondes.
- Tous les titres de page (`h1`/`h2` hors corps d'article) en Bebas Neue (`text-display`/`font-ui`), plus aucun `font-serif` en dehors du corps éditorial (`PortableTextRenderer` body, citations).
- Aucune occurrence résiduelle de "The Royal" ou "PokerBlog" dans le code — uniquement "PLO".
- Page de login intégralement bilingue FR/EN (namespace `auth` dans les deux fichiers de messages, aucune chaîne française en dur).
- Homepage : section "Dernières publications" et "Le Cercle" présentes et conformes à `homepage.png` ; section Main de la semaine toujours absente (hors scope Phase 03).
- Blog liste + article : correspondance visuelle avec `blog.png`/`article.png` (layout, spacing, badges, pull-quotes, tags) — comparaison écran par écran desktop + mobile, pas "inspiré librement".
- Marque présente en continu (nav/footer/watermark) sur toutes les pages, cohérente avec l'existant.
- Dark mode permanent respecté partout, aucun toggle thème introduit ni supposé.
- Bilingue FR/EN fonctionnel sur chaque page reskinnée (aucune régression de routing/i18n, y compris login).
- Aucune écriture Sanity ou Postgres introduite par cette feature.

## Comment tester

- `npm run typecheck`, `npm run lint`, `npm run build` (ou équivalents du repo — à vérifier dans `package.json`).
- Captures d'écran desktop (1440px) + mobile (375px) de chaque page listée, comparées :
  - Blog liste, article, homepage → comparées à `blog.png`, `article.png`, `homepage.png`.
  - Catégories, auteurs, à-propos, contact, newsletter, login, politique de confidentialité → comparées entre elles pour cohérence du design system (pas de maquette dédiée), plus vérification manuelle des critères d'acceptation (couleurs, radius, typo, marque).
- Navigation manuelle FR → EN sur chaque page reskinnée, y compris `/auth/login`, pour vérifier l'absence de régression i18n et l'absence de texte français en dur.
- Vérification visuelle qu'aucune page ne réintroduit un composant hors design system (`docs/design-tokens.md`).
- Recherche finale `rounded-(lg|xl|2xl|3xl)`, `zinc-`, `slate-`, `dark:`, `The Royal`, `PokerBlog` sur `app/` et `components/` → doit retourner zéro résultat sur les fichiers listés ci-dessus.

## Périmètre explicitement exclu (à ne pas improviser)

- Section "Main de la semaine" de la homepage (fond feutré vert) — Phase 03, schéma `handOfWeek` pas créé.
- Dashboard, forum, revue de session (`dashboard.png`) — Phase 04, scope pas confirmé (point ouvert #1).
- Boutique / page shop (`shop.png`) — page d'attente uniquement, hors périmètre de ce prompt (déjà scopée ailleurs si elle existe).
- Tout comportement de chargement dynamique (vrai load-more, infinite scroll) — restyle visuel uniquement, cf. hypothèse 2.
- Abonnement Stripe — reporté, non concerné de toute façon.
