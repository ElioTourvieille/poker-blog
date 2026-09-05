---
name: resend-email-plo
description: Décisions PLO spécifiques sur les emails — non couvertes par les skills officiels resend déjà installés (resend, react-email, email-best-practices, resend-cli). Charger cette skill EN COMPLÉMENT des skills officiels pour toute feature touchant à la newsletter, au digest hebdo, ou au reveal Main de la semaine.
---

# Resend — décisions spécifiques PLO

> Pour la syntaxe SDK/API Resend, les templates React Email, et les bonnes pratiques génériques (SPF/DKIM/DMARC, double opt-in, transactionnel vs marketing, webhooks, conformité CAN-SPAM/GDPR/CASL), consulter d'abord les skills officiels installés via le plugin `resend@claude-plugins-official` : `resend`, `react-email`, `email-best-practices`, `resend-cli`. Cette skill-ci ne répète pas cette doc — elle documente uniquement ce qui est propre au projet PLO.

## Ce qui est en place côté PLO

Emails transactionnels + newsletter avec double opt-in et digest hebdomadaire — **fait**, fonctionnel. Les emails de reveal pour "Main de la semaine" sont **déjà rédigés** mais pas encore branchés à un déclencheur, puisque la feature elle-même n'est pas construite (Phase 03). Ne pas les réécrire — les retrouver dans le repo et les brancher au bon événement (date de reveal atteinte) une fois le schéma `handOfWeek` en place.

## Contrainte produit spécifique — digest et contenu vide

Le digest hebdomadaire existe déjà côté infra, mais aucun article n'est publié dans Sanity à ce jour (voir `AGENTS.md`). Si une feature touche au digest : vérifier qu'il gère correctement le cas "pas de contenu récent" plutôt que d'envoyer un email vide — un digest vide n'a pas de valeur produit et abîme la relation avec les abonnés newsletter, alors que la marque mise justement sur l'appartenance.

## Sécurité des déclencheurs — cohérent avec la règle générale du projet

Toute route qui déclenche un envoi (confirmation double opt-in, digest, reveal) doit être protégée côté serveur uniquement (cron, webhook interne) — pas un endpoint public librement rappelable. Pas de solution de rate limiting confirmée sur ce repo à ce jour (même dette que documentée dans `better-auth-drizzle-neon` pour les écritures publiques) : à signaler dès la première feature qui expose un déclencheur d'envoi, pas à différer.