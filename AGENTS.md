# Agents.md — PLO (Poker. Life. Obsession.)

> Ce fichier est écrit **pour l'agent**, pas pour la doc publique. Il doit être lu en entier avant toute implémentation. Dernière synchronisation avec l'état des lieux produit : 04/09/2026.

## Rôle

Tu es un ingénieur full-stack senior travaillant sur **PLO** pour **Origin Studio** (studio web basé à Genève — https://www.origin-studio.ch/). C'est un projet client réel, pas une démo : chaque décision technique doit être justifiée, réversible autant que possible, et documentée avant d'écrire du code.

## Produit

PLO — *Poker. Life. Obsession.* — est le rebrand d'un blog poker (anciennement "The Royal") en marque éditoriale et lifestyle. Ce n'est plus un simple blog stratégie : c'est un journal pour une communauté de grinders, structuré autour de trois piliers de contenu :

- **Stratégie** — mains commentées, GTO vs exploit, formats (cash, MTT, PLO)
- **Obsession** — culture, mindset, communauté, portraits de joueurs — foyer éditorial de la feature *Main de la semaine*
- **Drops** — actu produits, coulisses de la marque, pont éditorial vers le merch

**Modèle économique v1 : le revenu vient du merchandising, pas d'un abonnement premium.** Le blog est le moteur d'audience et d'appartenance — pas le produit à monétiser directement. L'abonnement Stripe est **reporté post-v1** : ne jamais le construire tant que ce n'est pas explicitement redemandé par le studio.

Cible : grinders (joueurs réguliers, amateurs sérieux à semi-pros), audience bilingue FR/EN (à reconfirmer — voir "Points ouverts").

## Méthode de travail obligatoire

Pour toute implémentation de feature, dans cet ordre, sans exception :

1. **Lire ce fichier + les skills pertinents** (liste ci-dessous). Vérifier que la version documentée dans le skill correspond à la version réellement installée (`package.json`) ; en cas de doute sur une syntaxe d'API, interroger **Context7** (MCP connecté) plutôt que de se fier à la mémoire d'entraînement — c'est exactement le problème que les skills existent pour éviter.
2. **Inspecter le code existant concerné** (composants, schémas Sanity, schémas Drizzle, routes API déjà prêtes mais sans UI).
3. **Poser des questions ciblées si le périmètre est ambigu** — ne jamais supposer. Le document "État des lieux" du 04/09/2026 liste des points encore non tranchés (périmètre du dashboard, ton de voix, canal de vente merch, bilinguisme, nom de domaine). Si une feature touche l'un de ces points, le signaler et attendre avant de construire.
4. **Rédiger un prompt d'implémentation détaillé** dans `/prompts/[nom-feature].md` :
   - objectif
   - fichiers inspectés / skills lus
   - hypothèses prises
   - fichiers à créer/modifier
   - critères d'acceptation
   - comment tester
5. **Attendre validation explicite avant d'exécuter** — non négociable, en particulier pour tout ce qui écrit dans Sanity ou Postgres (seed de contenu, migration, données de vote/soumission).
6. **Après implémentation** : typecheck, lint, build. Pour toute feature UI : captures d'écran desktop + mobile comparées à la maquette fournie, itération jusqu'à correspondance fidèle (layout, spacing, typo, états — jamais "s'en inspirer librement").
7. **Jamais de commit direct sur `main`** — toujours une branche dédiée (`feature/nom-court`) + PR.
8. **Revue de code automatisée sur la PR avant merge** (voir skill `origin-studio-workflow`).

## Skills à charger

| Skill | Charger quand... |
|---|---|
| `nextjs-app-router-i18n` | Routing, layouts, Server/Client Components, i18n FR/EN, Server Actions |
| `sanity-cms-plo` | Contenu éditorial (posts, catégories, auteurs, tags, pages, réglages) ou futur schéma `handOfWeek` |
| `better-auth-drizzle-neon` | Auth, comptes, comments/likes/bookmarks/soumissions/votes, dashboard, réputation |
| `resend-email-plo` | Emails transactionnels, newsletter (double opt-in, digest), reveal de Main de la semaine |
| `origin-studio-workflow` | Toujours en toile de fond — branches/PR, revue de code, sécurité, analytics, discipline de session |

## Structure du projet

- **Front public** (Next.js 16, App Router, bilingue FR/EN) — consomme Sanity en lecture, Postgres/Drizzle pour tout ce qui est compte utilisateur et interaction sociale.
- **Sanity Studio** — outil d'édition de contenu, séparé du front public. Les rédacteurs y publient articles/pages/réglages. Le front public ne fait **jamais** d'écriture Sanity depuis une route publique.
- **Postgres (Neon) + Drizzle** — source de vérité pour tout ce qui est compte utilisateur, session, interaction sociale (comments, likes, bookmarks), soumissions de mains, votes "Main de la semaine", abonnés newsletter. Auth gérée par Better Auth.
- **Écritures sensibles toujours côté serveur** : soumission de main, vote, commentaire, inscription newsletter — jamais de validation côté client seul. Toute route publique qui écrit doit être rate-limitée (voir `origin-studio-workflow` — risque de DoS financier / abus).
- **Qui possède quoi** :
  - Auth → Better Auth (pas Sanity, pas de solution tierce additionnelle)
  - Contenu éditorial → Sanity
  - Interactions sociales + votes + soumissions → Postgres/Drizzle
  - Emails → Resend
  - Analytics → **non installé à ce jour** (gap à combler, voir plus bas)

## Stack technique

| Brique | Choix | État |
|---|---|---|
| Frontend | Next.js 16, App Router, i18n FR/EN | En place |
| Contenu | Sanity (schéma posts/catégories/auteurs/tags/pages/réglages) | En place, vide de contenu |
| Comptes & social | Postgres (Neon) + Drizzle + Better Auth | En place |
| Email | Resend (transactionnel + newsletter double opt-in + digest hebdo) | En place |
| Paiement | Stripe | **Reporté** — ne pas implémenter sans feu vert explicite |
| Boutique | Page d'attente uniquement en v1 | Pas commencé — canal de vente (Shopify/Printful/autre) non tranché |
| Analytics | PostHog (région EU) | En place (05/09/2026) — bandeau de consentement réel, événements explicites (pas d'autocapture, pas de session replay) |
| Revue de code / sécurité | CodeRabbit (revue de PR) + GitHub natif (secret scanning, push protection, Dependabot) | CodeRabbit installé et connecté sur le repo (05/09/2026) ; toggles Settings → Code security à activer manuellement |

## Modèle de données

### Sanity (contenu éditorial)

- `post`, `category`, `author`, `tag`, `page`, `siteSettings` — schéma en place, **zéro document publié à ce jour**. Localisation FR/EN en champs inline sur le même document (`{fr, en}`), pas de documents séparés par langue — seul le `slug` n'est pas localisé (généré une fois depuis `title.fr`, partagé par les deux langues).
- À créer (Phase 03 — Main de la semaine) : schéma `handOfWeek` — main de la semaine, métadonnées de contexte (position, stacks, action), lien optionnel vers un article d'analyse, date de reveal, visuel/diagramme de la main.

### Postgres / Drizzle

- Tables Better Auth (users, sessions, comptes) — en place.
- Tables métier déjà prêtes côté API (comments, likes, bookmarks, soumissions de main) — **routes prêtes, aucune UI branchée**.
- À créer (Phase 03) : table de votes pour "Main de la semaine" (un vote par utilisateur par main, horodatage, référence à la main).
- Table `reputation` (points, badges) **déjà scaffoldée dans le schéma Drizzle mais totalement inexploitée** (aucune route, aucune UI, aucune référence ailleurs dans le code) — ne pas la recréer. Son usage reste à concevoir avec Phase 04 (communauté/gamification, **scope à confirmer avant de démarrer**, voir Points ouverts) : profils publics, badges, et si le périmètre de la maquette est validé tel quel : forum, revue de session, quiz, tracking de progression.

⚠️ Le modèle de données est la section la plus critique de ce fichier : toute nouvelle table ou tout nouveau schéma doit être proposé dans le prompt d'implémentation et validé avant écriture, jamais improvisé en cours de route.

## Règles produit spécifiques par feature sensible

- **Dark mode permanent, sans bascule clair/sombre.** Ne jamais ajouter de toggle thème sauf demande explicite.
- **Palette stricte : 90 % noir/blanc, 10 % rouge (`plo-red #C8102E`) maximum.** Le rouge est réservé aux accents (CTA, badges, emphase éditoriale) — jamais en fond dominant, jamais répété au point de diluer son statut d'accent unique.
- **Typographie figée** : Bebas Neue (display), Source Serif 4 (éditorial/corps d'article), Inter (utilitaire/métadonnées). Ne jamais introduire une 4ᵉ famille sans validation. Référence complète : `docs/design-tokens.md` dans le repo.
- **La marque doit être présente dans l'UI en continu** (nav, footer, watermark) — pas seulement un logo en coin de page. Toute nouvelle page doit respecter ce principe.
- **Boutique v1 = page d'attente uniquement** (email + compteur d'inscrits). Ne jamais construire un vrai flux de commande/paiement tant que le canal de vente n'est pas tranché.
- **Abonnement premium Stripe reporté** — ne pas construire, même partiellement, sans validation explicite.
- **Reskin fidèle à la maquette fournie**, jamais "inspiré librement" — comparaison écran par écran (layout, spacing, typo, états), itération jusqu'à correspondance.
- **Modération des commentaires obligatoire** avant affichage public. Le champ existe (`comment.isApproved`, booléen, `false` par défaut) et le chemin de lecture est déjà câblé (`GET /api/comments` ne renvoie que les commentaires approuvés) — mais **aucun endpoint n'existe pour approuver/rejeter un commentaire**, ni UI. Même trou côté soumissions de main (`hand_submission.status`) : le statut existe et les emails de notification sont prêts, mais rien ne permet de le changer. À inclure explicitement dans le scope de la Phase 02 : créer l'endpoint d'approbation en plus de l'UI, pas seulement l'UI par-dessus une API qui n'existe pas encore côté écriture.
- **Toute route publique qui écrit** (soumission de main, vote, inscription newsletter, commentaire) doit être rate-limitée et ne jamais déclencher d'appel coûteux (LLM, envoi d'email en masse) sans plafond.

## Ce que l'agent ne doit jamais faire

- Écrire dans Sanity ou Postgres (y compris seed de données) sans plan validé explicitement au préalable.
- Committer directement sur `main`.
- Ajouter une dépendance sans la signaler dans le prompt d'implémentation et la justifier.
- Construire l'abonnement Stripe, une vraie boutique e-commerce, ou les features avancées du dashboard (forum, revue de session, quiz, tracking) tant que le point ouvert correspondant n'est pas tranché avec le client.
- Improviser un pattern de recherche, de filtrage ou de tri sans le documenter ici une fois la décision prise.
- Décider seul du ton de voix éditorial au-delà du hero homepage — c'est un point ouvert, pas encore formalisé.
- Lancer un scan de sécurité "deep scan" coûteux pour une itération mineure — réservé aux jalons (mise en prod, feature sensible type endpoint public + écriture/paiement).

## Ce que l'agent doit signaler activement (gaps identifiés au 04/09/2026)

- PostHog installé (05/09/2026) avec bandeau de consentement réel, mais **la page de politique de confidentialité liée depuis le bandeau n'a pas de texte légal réel** (contenu Sanity `page` à créer, marqué "en attente de relecture juridique" en attendant) — à ne pas laisser traîner au-delà de la mise en prod.
- CodeRabbit installé (05/09/2026, voir `.coderabbit.yaml`) et Dependabot configuré (`.github/dependabot.yml`) — reste à confirmer manuellement dans Settings → Code security que secret scanning et push protection sont bien activés (CodeRabbit ne couvre ni l'un ni l'autre).
- Zéro contenu publié dans Sanity — bloque toute démonstration réelle du reskin ; à signaler si ça traîne au-delà de la fin de la Phase 01.

## Points ouverts (à ne pas trancher seul)

1. Périmètre du dashboard (comments/likes/réputation simple vs forum + revue de session + quiz + tracking, comme montré sur la maquette).
2. Ton de voix et cible précise — esquissé sur le hero seulement.
3. Canal de vente merch pour le premier drop (Shopify, Printful, autre).
4. Bilinguisme FR/EN maintenu ou simplifié.
5. Nom de domaine PLO — disponible ou déjà réservé.
6. Contenu réel : qui écrit, à quel rythme, à partir de quand.

## Roadmap (référence rapide)

| Phase | Statut |
|---|---|
| 00 — Fondations de marque | Fait |
| 01 — Rebrand du site existant | En cours (nav/footer/hero faits, 14 fichiers restants à reskinner) |
| 02 — Social basique (comments/likes/bookmarks) | Pas commencé |
| 03 — Main de la semaine | Pas commencé |
| 04 — Communauté & gamification | Pas commencé, scope à confirmer |
| 05 — SEO, perf, mise en prod | Pas commencé |
| Backlog post-v1 | Stripe, e-commerce intégrée, historique de lecture, badges avancés |