# Revue de code & sécurité repo — CodeRabbit + protections GitHub natives

## Objectif

Combler le gap identifié dans AGENTS.md ("Revue de code / sécurité — À confirmer"). **CodeRabbit est déjà installé et connecté sur le repo `poker-blog` (fait par l'utilisateur, 05/09/2026)** — reste à committer sa config (`.coderabbit.yaml`), et à combler ce qu'il ne couvre pas nativement (secret scanning, push protection, Dependabot) avec les protections GitHub natives, conformément à la section Sécurité du skill `origin-studio-workflow` qui exige scan de secrets + dépendances vulnérables en continu, pas seulement une revue de qualité de code.

## Fichiers inspectés / skills lus

- `AGENTS.md` (stack technique — Revue de code/sécurité : CodeRabbit pressenti, pas encore branché)
- Skill `origin-studio-workflow` (sections Revue de code et Sécurité)
- Confirmé par inspection : aucun répertoire `.github/` n'existe dans le repo à ce jour (pas de workflow CI, pas de config Dependabot).

## Hypothèses prises

1. **CodeRabbit ne fait pas de scan de secrets ni de dépendances vulnérables** — c'est un reviewer IA de diff (qualité, logique, patterns). Le besoin exprimé par le skill ("scan de secrets exposés + dépendances vulnérables en continu sur chaque PR") est comblé séparément par les fonctionnalités natives GitHub (gratuites sur repo public ou privé avec GitHub Advanced Security selon le plan de l'org) : Secret Scanning + Push Protection, et Dependabot (alerts + security updates + version updates programmées).
2. **Installation de la GitHub App CodeRabbit : faite** (confirmé par l'utilisateur). Il reste seulement à committer un `.coderabbit.yaml` pour affiner son comportement (langue des reviews, chemins ignorés) et à activer les toggles Settings → Code security (secret scanning, push protection, Dependabot) — ça reste une action manuelle admin GitHub, hors de portée de l'agent depuis ce sandbox.
3. **Pas de pipeline CI complet (typecheck/lint/build) ajouté dans ce prompt** — hors scope demandé ; CodeRabbit fonctionne directement sur le diff de la PR sans dépendre d'un CI. À proposer comme feature séparée si souhaité.
4. **`/code-review ultra` (Claude Code) vient en complément, pas en remplacement** de CodeRabbit — réservé aux deep scans avant les jalons (mise en prod, feature sensible endpoint public + écriture/paiement), pas à automatiser sur chaque PR (coûteux).

## Fichiers à créer/modifier

- `.coderabbit.yaml` (nouveau, racine du repo) : config de base — langue des reviews (FR), niveau de profondeur, chemins ignorés (`.next/`, `node_modules/`, contenu généré type `sanity.types.ts`)
- `.github/dependabot.yml` (nouveau) : alerts + security updates activés, version updates programmées (npm/pnpm, hebdomadaire) pour ce repo
- `AGENTS.md` : mettre à jour la ligne "Revue de code / sécurité" du tableau Stack technique de "À confirmer (CodeRabbit pressenti)" à "En place" une fois vérifié fonctionnel, et retirer la mention correspondante de la section "Ce que l'agent doit signaler activement"

## Étapes manuelles restantes (hors code, à faire par un humain admin du repo GitHub)

- ~~Installer la GitHub App CodeRabbit~~ — fait.
- Activer dans Settings → Code security : Secret scanning, Push protection, Dependabot alerts, Dependabot security updates.

## Critères d'acceptation

- La prochaine PR ouverte reçoit un commentaire de revue automatique de CodeRabbit (à confirmer, premier test réel depuis l'installation).
- Secret scanning + push protection + Dependabot alerts apparaissent actifs dans Settings → Code security.
- `dependabot.yml` est valide (schema GitHub) et une première vérification de dépendances tourne sans erreur de config.
- AGENTS.md reflète l'état réel une fois vérifié.

## Comment tester

- Ouvrir une PR de test avec un changement trivial (ex. typo dans un commentaire) → vérifier le commentaire CodeRabbit.
- Vérifier dans Settings → Code security que les 4 toggles sont actifs.
- Committer volontairement un faux secret dans une branche de test (jamais pushé sur `main`) pour confirmer que push protection bloque bien le push — puis le retirer.
