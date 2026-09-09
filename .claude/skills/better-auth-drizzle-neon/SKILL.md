---
name: better-auth-drizzle-neon
description: Décisions PLO spécifiques sur l'auth et les écritures publiques — non couvertes par les skills officiels better-auth déjà installés (better-auth-best-practices, create-auth, email-and-password-best-practices, organization-best-practices, two-factor-authentication-best-practices, better-auth-security-best-practices). Charger EN COMPLÉMENT des skills officiels pour toute feature touchant aux comptes, aux interactions sociales, ou à toute écriture publique en base (Postgres/Drizzle/Neon).
---

# Better Auth + Drizzle + Neon — décisions spécifiques PLO

> Pour la configuration Better Auth elle-même (setup, email/password, organisations, 2FA, sécurité générale) consulter d'abord les skills officiels déjà installés : `better-auth-best-practices`, `create-auth`, `email-and-password-best-practices`, `organization-best-practices`, `two-factor-authentication-best-practices`, `better-auth-security-best-practices`. Cette skill-ci ne répète pas cette doc — elle documente le modèle de données et les règles de sécurité **propres à PLO**, que Better Auth ne peut pas connaître.

## Ce qui est en place côté PLO

Better Auth branché sur Postgres (Neon) via Drizzle — tables users/sessions/comptes en place. Routes API pour comments, likes, bookmarks, soumissions de main — **prêtes côté backend, sans UI branchée à ce jour**. Avant de reconstruire une de ces routes, vérifier si elle existe déjà et se contenter de brancher l'UI dessus.

## Convention de migrations (projet)

Toute évolution de schéma passe par une migration Drizzle versionnée (`drizzle-kit generate` puis review du SQL généré), jamais un `push` direct en environnement partagé/prod. Une migration = une PR dédiée si elle accompagne une feature volumineuse, ou intégrée à la PR de la feature si elle est petite et directement liée.

## Sécurité des écritures publiques — point critique propre à PLO

C'est la zone la plus sensible du projet à ce jour : plusieurs endpoints publics vont écrire en base (soumission de main, vote Main de la semaine, commentaire, inscription newsletter). Pour chacun :

- **Authentification requise** avant écriture, sauf décision produit explicite contraire (ex. inscription newsletter anonyme — à confirmer au cas par cas, ne pas supposer).
- **Rate limiting obligatoire** — pas de solution confirmée dans le repo à ce jour : le signaler comme dette dès la première feature qui expose une écriture publique, ne pas la construire sans protection en se disant "on ajoutera le rate limit plus tard".
- **Un vote par utilisateur par main** — contrainte d'unicité en base (index unique `user_id + hand_id`), pas seulement une vérification côté application.

## Modération — état réel (vérifié 05/09/2026)

Le champ existe déjà, mais pas sous la forme attendue : `comment.isApproved` est un **booléen** (`default false`), pas un enum `pending/approved/rejected`. Le chemin de lecture est déjà câblé côté serveur — `GET /api/comments` ne renvoie que `WHERE isApproved = true`, et `POST /api/comments` force `isApproved: false` à la création.

**Ce qui manque réellement** : aucun endpoint n'existe pour faire passer `isApproved` à `true` (ni PATCH, ni route admin) — seuls `GET`/`POST` sur `/api/comments` et `DELETE` sur `/api/comments/[id]` existent. Aucune UI de modération non plus (`/dashboard`, `/admin` : aucun n'existe sous `app/[locale]/`). Même trou sur `hand_submission.status` (enum `PENDING/APPROVED/REJECTED` déjà en place, emails `sendHandSelectedEmail`/`sendHandRejectedEmail` déjà prêts dans `lib/mailer.tsx`) — mais `app/api/hand-submissions/route.ts` n'a que `POST`/`GET`, pas de PATCH pour changer le statut.

**Implication pour la Phase 02** : le scope doit inclure la création de l'endpoint d'approbation/rejet (comments et hand_submission), pas seulement une UI par-dessus une API qui n'existe pas encore côté écriture.

## Relations confirmées (vérifié 05/09/2026)

Noms de tables réels (singulier) : `user`, `session`, `account`, `verification` (Better Auth) ; `comment`, `like`, `bookmark`, `newsletter_subscriber`, `hand_submission`, `reputation` (métier). `like`/`bookmark` ont une clé primaire composite `(userId, postSlug)` — pas de FK vers Sanity, juste le slug en texte.

- `user` → `comment`, `like`, `bookmark`, `hand_submission` (1-N) ; `user` → `reputation` (1-1, `userId` avec contrainte `unique()`) — et à créer : `vote` (Main de la semaine, Phase 03).
- `reputation` (`points`, `badges[]`) **existe déjà dans le schéma mais n'est référencée nulle part ailleurs dans le code** (aucune route, aucune UI) — ne pas la recréer pour la Phase 04, juste concevoir son usage.
- Phase 04 (scope à confirmer) : profil public, badges, éventuellement participation forum/quiz si le périmètre validé va jusque-là.
