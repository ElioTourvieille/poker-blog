# Analytics — PostHog avec bandeau de consentement réel

## Objectif

Installer PostHog (région EU) pour combler le gap analytics identifié dans AGENTS.md, avec un plan de tracking réel mais volontairement minimal — limité à ce qui a déjà une UI branchée aujourd'hui. **Décision validée (05/09/2026) : vrai bandeau de consentement**, pas de contournement "pas de cookie donc pas de bandeau" — PostHog ne se déclenche qu'après acceptation explicite.

## Fichiers inspectés / skills lus

- `AGENTS.md` (stack technique — Analytics : Manquant)
- Skill `origin-studio-workflow` (sections Analytics et Sécurité)
- [lib/auth.ts](lib/auth.ts) — hook `databaseHooks.user.create.after` déjà présent (envoi du welcome email)
- [components/newsletter/NewsletterForm.tsx](components/newsletter/NewsletterForm.tsx)
- [app/api/newsletter/confirm/route.ts](app/api/newsletter/confirm/route.ts)
- [app/[locale]/layout.tsx](app/[locale]/layout.tsx)
- [components/layout/Footer.tsx](components/layout/Footer.tsx) — contient déjà un lien `footer.links.privacy` ("Confidentialité"), mais pointé vers `/a-propos` : probable placeholder, pas une vraie page de confidentialité
- [messages/fr.json](messages/fr.json) — confirme l'absence de contenu de politique de confidentialité réel
- [docs/design-tokens.md](docs/design-tokens.md) — palette/typo/composants à respecter pour le bandeau (pas de maquette dédiée pour cet élément)
- [.env.local.example](.env.local.example)

## Hypothèses prises

1. **Région PostHog Cloud EU** (`eu.i.posthog.com`), pas US — cohérent avec un studio basé à Genève et un public RGPD/nLPD.
2. **Bandeau de consentement réel (tranché, plus une hypothèse)** — binaire Accepter/Refuser, une seule catégorie à consentir ("mesure d'audience") puisqu'aucun autre cookie tiers n'existe aujourd'hui (pas de pub, pas de widget embed). PostHog s'initialise avec `opt_out_capturing_by_default: true` et n'est activé (`posthog.opt_in_capturing()`) qu'après clic sur "Accepter". Le choix est mémorisé (`localStorage` + un cookie technique `plo-cookie-consent`, lui-même exempté de consentement puisqu'il sert uniquement à retenir le consentement) et modifiable à tout moment via un lien "Gérer les cookies" au footer. Autocapture et session replay restent désactivés (indépendamment du consentement — philosophie "événements explicites" du skill).
3. **Aucune vraie page de politique de confidentialité n'existe** — `footer.links.privacy` pointe actuellement vers `/a-propos`. Ce prompt scaffolde une vraie page dédiée (structure : qui collecte, quelles données, PostHog EU, durée de conservation, droits RGPD/nLPD, contact) mais **ne rédige pas le texte légal définitif** — ce n'est pas une décision produit/dev à prendre seul. Le contenu sera marqué `[texte à valider légalement — studio/juriste]` en attendant une relecture.
4. **Pas de reverse-proxy same-origin** pour contourner les ad-blockers en v1 — appel direct à l'API PostHog EU. Évite délibérément le risque nommé dans le skill `origin-studio-workflow` (fuite de cookies de session via un proxy analytics same-origin). Un sous-domaine dédié pourra être envisagé plus tard si le under-counting devient un problème produit réel.
5. **Plan d'événements v1 limité à l'UI qui existe déjà** — comments/likes/bookmarks/vote/soumission de main n'ont pas d'UI branchée à ce jour (AGENTS.md), donc pas d'événement pour eux dans ce prompt ; ils seront ajoutés au fil de l'eau dans les prompts de leurs propres features (Phase 02/03) :
   - `$pageview` — automatique à chaque changement de route (uniquement après consentement), propriété `locale`
   - `newsletter_subscribe_submitted` — client, à la soumission du formulaire
   - `newsletter_subscribe_confirmed` — serveur, dans la route de confirmation double opt-in
   - `user_signed_up` — serveur, dans le hook Better Auth déjà existant
6. **Aucune PII au-delà de l'ID utilisateur** : `distinct_id` = `user.id` (Better Auth) une fois connecté, jamais l'email ou le nom en propriété d'événement.
7. Nouvelles dépendances ajoutées : `posthog-js` (client) + `posthog-node` (capture serveur, cohérent avec la règle du skill "captation côté serveur quand l'action déclenchante est côté serveur"). Aucune lib tierce pour le bandeau lui-même — composant maison, pour rester fidèle au design system PLO plutôt qu'à un style de lib générique.

## Fichiers à créer/modifier

- `.env.local.example` : ajouter `NEXT_PUBLIC_POSTHOG_KEY=` et `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`
- `lib/posthog-client.ts` (nouveau) : init du client `posthog-js`, `opt_out_capturing_by_default: true`, autocapture off, session replay off, `capture_pageview: false` (géré manuellement) ; expose `optInAnalytics()` / `optOutAnalytics()`
- `lib/posthog-server.ts` (nouveau) : client `posthog-node` pour capture serveur
- `lib/consent.ts` (nouveau) : get/set/subscribe du choix de consentement (`localStorage` + cookie technique `plo-cookie-consent`, valeurs `granted`/`denied`/`undecided`)
- `components/analytics/PostHogProvider.tsx` (nouveau, Client Component) : provider + init, écoute le consentement pour opt-in/opt-out
- `components/analytics/PageviewTracker.tsx` (nouveau, Client Component) : écoute `usePathname`/`useSearchParams`, envoie `$pageview` avec `locale` (no-op si pas de consentement)
- `components/analytics/ConsentBanner.tsx` (nouveau, Client Component) : bandeau bas de page, boutons "Accepter" (`btn-primary`, seul rouge de la section) / "Refuser" (`btn-outline-dark`), lien "En savoir plus" vers la page confidentialité, typographie Inter (`text-label`)/Bebas selon les tokens existants — pas de maquette dédiée, respecter `docs/design-tokens.md`
- [app/[locale]/layout.tsx](app/[locale]/layout.tsx) : monter provider + tracker + bandeau en îlots client, sans transformer le layout en Client Component
- [components/layout/Footer.tsx](components/layout/Footer.tsx) : corriger `links.privacy` vers la nouvelle page dédiée (plus `/a-propos`), ajouter un lien "Gérer les cookies" qui rouvre le bandeau/remet le choix à `undecided`
- `app/[locale]/politique-de-confidentialite/page.tsx` (nouveau) : page scaffoldée, contenu marqué `[texte à valider légalement]`
- [messages/fr.json](messages/fr.json) + [messages/en.json](messages/en.json) : clés `cookieBanner.*`, correction/ajout des clés footer liées
- [components/newsletter/NewsletterForm.tsx](components/newsletter/NewsletterForm.tsx) : event `newsletter_subscribe_submitted`
- [app/api/newsletter/confirm/route.ts](app/api/newsletter/confirm/route.ts) : event serveur `newsletter_subscribe_confirmed`
- [lib/auth.ts](lib/auth.ts) : event serveur `user_signed_up` dans le hook `create.after` existant

## Critères d'acceptation

- Le bandeau apparaît à la première visite (`plo-cookie-consent` absent) et reste caché aux visites suivantes une fois un choix fait.
- **Zéro requête réseau vers PostHog avant clic sur "Accepter"** — vérifiable dans l'onglet Network, y compris le `$pageview` de la première page vue.
- Après "Accepter" : `$pageview` et les 3 événements custom apparaissent dans PostHog (Live Events, projet EU) avec les bonnes propriétés, sans PII au-delà de l'ID utilisateur.
- Après "Refuser" : aucun appel réseau PostHog, de façon persistante après reload, tant que le choix n'est pas changé via "Gérer les cookies".
- Le lien "Gérer les cookies" au footer permet de rouvrir le bandeau et de changer d'avis à tout moment.
- La page de politique de confidentialité existe, est linkée depuis le bandeau et le footer, contenu clairement marqué `[à valider légalement]`.
- Le bandeau respecte le design system (palette 90/10, un seul bouton rouge = "Accepter", radius ≤ 4px, dark mode permanent).
- Aucune requête PostHog ne transite par un chemin same-origin du site — host direct `eu.i.posthog.com`.
- Captures d'écran desktop + mobile du bandeau (pas de maquette de référence existante pour cet élément, à valider visuellement avant merge).
- Typecheck, lint, build passent.

## Comment tester

- Vider `localStorage` + cookies, recharger : vérifier l'apparition du bandeau et l'absence de tout appel réseau PostHog avant clic.
- Cliquer "Accepter" : vérifier l'apparition des appels réseau + persistance après reload ; naviguer FR → EN, vérifier les pageviews dans PostHog Live Events.
- Réinitialiser, cliquer "Refuser" cette fois : vérifier l'absence totale d'appel réseau, persistance après reload.
- Cliquer "Gérer les cookies" au footer, changer d'avis dans les deux sens, vérifier que le comportement suit.
- Soumettre le formulaire newsletter puis confirmer via le lien reçu (Resend en mode dev/test) — vérifier les 2 events dans PostHog (après consentement accordé).
- Créer un compte de test (magic link ou Google OAuth), vérifier `user_signed_up`.
- Devtools → Application → Cookies : confirmer l'absence de cookie `ph_*` avant consentement, présence après.
