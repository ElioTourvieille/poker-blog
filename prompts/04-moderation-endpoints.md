# Endpoints de modération (commentaires + soumissions de main)

## Objectif

Combler le trou identifié dans AGENTS.md et dans le skill `better-auth-drizzle-neon` : les champs de modération (`comment.isApproved`, `hand_submission.status`) existent déjà en base et les emails de notification (`sendHandSelectedEmail`, `sendHandRejectedEmail`) sont prêts dans `lib/mailer.tsx`, mais **aucune route n'existe pour changer ces états**. Cette feature crée uniquement les endpoints d'approbation/rejet côté API — pas de dashboard ni d'UI de modération (hors scope, décision confirmée avec le studio).

## Fichiers inspectés / skills lus

- `AGENTS.md`
- Skills : `better-auth-drizzle-neon`, `origin-studio-workflow`
- `db/schema.ts` (tables `comment`, `hand_submission`, `user.role`)
- `app/api/comments/route.ts`, `app/api/comments/[id]/route.ts`
- `app/api/hand-submissions/route.ts` (pas de route `[id]` existante)
- `lib/auth.ts` (rôle `admin` déjà supporté par Better Auth via `user.role`)
- `lib/validators.ts` (schémas Zod existants)
- `lib/mailer.tsx` (`sendHandSelectedEmail`, `sendHandRejectedEmail` — vérifié : non appelées ailleurs dans le code à ce jour)
- `package.json` (scripts disponibles : pas de script `typecheck` dédié → `tsc --noEmit` direct)

## Constat d'inspection

- Le pattern admin existe déjà et est réutilisé tel quel : `session.user.role === 'admin'` (vu dans `DELETE /api/comments/[id]` et `GET /api/hand-submissions`).
- Aucune migration de schéma n'est nécessaire : tous les champs requis (`isApproved`, `status`, `rejectionNote`, `publishedHandId`) existent déjà.
- `sendHandSelectedEmail` attend un `publishUrl` obligatoire — or aucune page de publication réelle n'existe (schéma Sanity `handOfWeek` = Phase 03, pas commencée). Voir hypothèse 3 ci-dessous, c'est le point le plus ambigu de ce prompt.
- Pas de solution de rate limiting dans le repo (dette déjà documentée). Ces endpoints sont admin-only (auth + rôle), pas des écritures publiques anonymes — donc hors du périmètre "route publique qui écrit" visé par cette règle. Je ne construis pas de rate limiting ici, cohérent avec `DELETE /api/comments/[id]` qui n'en a pas non plus.

## Hypothèses prises

1. **Pas d'UI** — endpoints testés manuellement (curl / client HTTP), aucune page `/dashboard` ou `/admin` créée. Confirmé par le choix fait dans cette session.
2. **Rejet de commentaire = suppression existante** — `comment` n'a pas d'état "rejeté", seulement `isApproved` (booléen). Le rejet reste donc `DELETE /api/comments/[id]` (déjà en place), cette feature ajoute uniquement l'**approbation**.
3. **`sendHandSelectedEmail` sans page de publication réelle (Phase 03 non commencée)** : je rends `publishUrl` **optionnel** dans le corps de la requête PATCH. Si l'admin le fournit (lien fourni manuellement en attendant un vrai flux de publication), l'email de sélection part ; sinon le statut passe à `APPROVED` sans envoi d'email (pas de lien à donner à l'utilisateur tant que la Main de la semaine n'existe pas). Idem pour `publishedHandId` (optionnel, à renseigner plus tard par la Phase 03). **Point à valider explicitement — c'est une hypothèse produit, pas une évidence technique.**
4. **Idempotence** : une transition de statut n'est possible que depuis l'état `PENDING` (hand_submission) ou `isApproved = false` (comment). Réapprouver/rejeter un élément déjà traité renvoie `409 Conflict` plutôt que de ré-exécuter l'action (évite un double envoi d'email).
5. **Liste des éléments en attente** : comme il n'y a pas d'UI, l'admin a besoin d'un moyen de lister les commentaires en attente (le `GET /api/comments` existant ne renvoie que les approuvés et exige un `postSlug`). J'ajoute un `GET /api/comments/moderation` séparé (admin only, toutes les valeurs de `postSlug` confondues) plutôt que de modifier le contrat de la route publique existante. Pour les soumissions de main, `GET /api/hand-submissions` renvoie déjà tout pour un admin (tous statuts) — aucun changement nécessaire côté lecture.
6. Aucune écriture Sanity. Aucune migration Drizzle (tous les champs existent déjà).

## Fichiers à créer/modifier

- `app/api/comments/moderation/route.ts` **(nouveau)** — `GET`, admin only : liste les commentaires `isApproved = false`, triés par `createdAt` croissant (file d'attente), avec `user` (id/name/image) et `postSlug`.
- `app/api/comments/[id]/route.ts` **(modifié)** — ajout `PATCH`, admin only : body `{ isApproved: true }` (validé par un nouveau schéma Zod), passe le commentaire à approuvé ; `409` si déjà approuvé.
- `app/api/hand-submissions/[id]/route.ts` **(nouveau)** — `PATCH`, admin only : body discriminé par `status`:
  - `{ status: 'APPROVED', publishUrl?: string, publishedHandId?: string }` → met à jour `status`/`publishedHandId`, envoie `sendHandSelectedEmail` seulement si `publishUrl` est fourni (hypothèse 3).
  - `{ status: 'REJECTED', rejectionNote?: string }` → met à jour `status`/`rejectionNote`, envoie toujours `sendHandRejectedEmail`.
  - `409` si le statut courant n'est pas `PENDING`.
- `lib/validators.ts` **(modifié)** — ajout `moderateCommentSchema` et `moderateHandSubmissionSchema` (union discriminée sur `status`).

## Critères d'acceptation

- `PATCH /api/comments/[id]` : 401 sans session, 403 si non-admin, 404 si commentaire introuvable, 409 si déjà approuvé, 200 + commentaire mis à jour sinon.
- `GET /api/comments/moderation` : 401 sans session, 403 si non-admin, 200 + liste triée sinon (vide si aucun commentaire en attente).
- `PATCH /api/hand-submissions/[id]` : 401 sans session, 403 si non-admin, 404 si introuvable, 422 si body invalide, 409 si statut déjà `APPROVED`/`REJECTED`, 200 sinon.
- Approbation d'une main avec `publishUrl` → `sendHandSelectedEmail` appelé avec les bons paramètres (name/email de l'auteur de la soumission, pas de l'admin).
- Approbation d'une main sans `publishUrl` → statut mis à jour, **aucun** email envoyé.
- Rejet d'une main → `sendHandRejectedEmail` toujours appelé.
- Aucune régression sur les routes existantes (`GET`/`POST /api/comments`, `POST`/`GET /api/hand-submissions`, `DELETE /api/comments/[id]`).
- Aucune migration de schéma introduite (vérifié : `db:generate` ne produit aucun fichier).
- `npx tsc --noEmit`, `npm run lint`, `npm run build` passent sans nouvelle erreur.

## Comment tester

- `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- Scénarios manuels via un client HTTP (curl/httpie), avec une session admin et une session non-admin obtenues via l'app en local :
  - Créer un commentaire (`POST /api/comments`), vérifier qu'il n'apparaît pas via `GET /api/comments?postSlug=...` tant qu'il n'est pas approuvé, le voir apparaître dans `GET /api/comments/moderation`, l'approuver (`PATCH`), vérifier qu'il apparaît désormais dans la liste publique et que le second `PATCH` renvoie 409.
  - Soumettre une main (`POST /api/hand-submissions`), l'approuver avec puis sans `publishUrl` (vérifier dans les logs Resend/dev que l'email part uniquement dans le premier cas), la rejeter (vérifier l'email de rejet), vérifier le 409 sur une seconde tentative.
  - Vérifier les 401/403 avec une session non-admin ou sans session.
- Pas de captures d'écran (aucune UI livrée dans ce prompt).

## Périmètre explicitement exclu

- Toute UI de modération (`/dashboard`, `/admin`) — Phase 04, scope pas confirmé (point ouvert #1 d'AGENTS.md).
- Le flux réel de publication d'une main sélectionnée (page `handOfWeek`, génération de `publishUrl`) — Phase 03, pas commencée.
- Rate limiting — ces routes sont admin-only, pas des écritures publiques anonymes ; la dette de rate limiting reste documentée pour les routes publiques concernées (soumission de main côté utilisateur, vote, newsletter, commentaire côté utilisateur), pas ajoutée ici.
