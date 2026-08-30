# PLO — Design Tokens Reference
## Poker · Life · Obsession

Document de référence pour tous les tokens de design.
À consulter avant de créer n'importe quel composant.

Statut : intégré dans `app/globals.css` (palette, fonts, composants de base).
Reste à appliquer composant par composant — voir le suivi dans la conversation.

---

## Couleurs

| Token Tailwind         | Hex       | Usage                                        |
|-------------------------|-----------|-----------------------------------------------|
| `plo-black`             | `#000000` | Footer, overlay hero maximum                  |
| `plo-void`               | `#0A0A0A` | **Fond principal du site**                    |
| `plo-deep`               | `#111111` | Surfaces cards, sections sombres              |
| `plo-surface`           | `#1A1A1A` | Hover states, inputs, sous-surfaces           |
| `plo-felt`               | `#0D1A0D` | Fond section Main de la Semaine uniquement    |
| `plo-border`             | `#222222` | Borders par défaut                            |
| `plo-muted`             | `#333333` | Borders hover, séparateurs                    |
| `plo-white`             | `#FFFFFF` | Texte principal, éléments clés                |
| `plo-off`                 | `#F5F5F5` | Fond sections lumineuses                      |
| `plo-gray`               | `#888888` | Metadata, dates, texte secondaire             |
| `plo-subtle`             | `#555555` | Texte tertiaire, placeholders                 |
| `plo-red`                 | `#C8102E` | **Accent unique — CTAs, badge Stratégie**     |
| `plo-red-hover`         | `#A50D25` | Hover du rouge                                |

### Règle d'or : 90% noir/blanc — 10% rouge
Le rouge ne touche que :
- Boutons CTA primaires (1 par section maximum)
- Badge STRATÉGIE
- "LIFE." dans le hero principal
- Barres de vote Main de la Semaine
- Hover sur les liens de navigation
- Borders au hover des cards
- Ligne de séparation décorative sous "LE CERCLE"

---

## Typographie

### Familles

| Rôle        | Font           | Variable CSS          | Classe Tailwind |
|-------------|----------------|------------------------|------------------|
| Display/UI  | Bebas Neue     | `--font-bebas`         | `font-display`   |
| Éditorial   | Source Serif 4 | `--font-source-serif`  | `font-editorial` |
| Utilitaire  | Inter          | `--font-inter`         | `font-sans`      |

### Règles typographiques

**Display (Bebas Neue)**
- Toujours uppercase
- letter-spacing: 0.01em par défaut
- Utilisé pour : tous les titres de page, nav, boutons, badges, watermarks
- JAMAIS pour le corps de texte ou les longs paragraphes

**Éditorial (Source Serif 4)**
- Corps des articles uniquement
- 18px / line-height 1.8 minimum
- Styles disponibles : normal, italic
- Weights : 300 (light), 400 (regular), 600 (semibold)

**Utilitaire (Inter)**
- Tout ce qui est UI : dates, tags, métadonnées, labels
- Toujours en uppercase + letter-spacing 0.12em pour les labels
- 10-13px pour les métadonnées

### Classes utilitaires custom

```
.text-poster      — Bebas Neue, clamp(64px – 120px), hero principal
.text-display     — Bebas Neue, clamp(36px – 64px), titres de sections
.text-label       — Inter 11px uppercase letter-spacing 0.12em
.text-label-lg    — Inter 10px uppercase letter-spacing 0.18em
.text-editorial   — Source Serif 18px line-height 30px
.text-watermark   — Bebas Neue, clamp(100px – 200px), opacity 4%
```

---

## Espacement & Layout

### Conteneurs
```
max-w-site     — 1280px  (contenu standard)
max-w-content  — 720px   (articles longform)
max-w-wide     — 1440px  (hero full-width)
```

### Padding vertical des sections
```
py-section-sm  — 48px   (sections compactes, footer)
py-section     — 80px   (sections standard)
py-section-lg  — 120px  (sections importantes)
py-section-xl  — 160px  (hero, sections signatures)
```

### Hauteurs fixes
```
h-nav          — 56px   (barre de navigation)
h-ticker       — 36px   (barre de news défilante)
h-hero         — 90vh   (hero principal)
h-hero-sm      — 60vh   (hero de sous-pages)
```

---

## Composants

### Badges de catégorie
```jsx
<span className="badge badge-strategie">Stratégie</span>  // fond rouge
<span className="badge badge-obsession">Obsession</span>  // fond noir bordure
<span className="badge badge-drops">Drops</span>          // fond sombre gris
```

### Boutons
```jsx
// Primaire — fond rouge (1 par section max)
<button className="btn-primary">Lire le blog</button>

// Secondaire — outline blanc sur fond sombre
<button className="btn-secondary">Rejoindre Discord</button>

// Outline — contour noir sur fond blanc
<button className="btn-outline-dark">Voir l'analyse</button>
```

### Cards
```jsx
// Sur fond sombre
<div className="card-article">...</div>

// Sur fond blanc (section "Dernières Publications")
<div className="card-article-light">...</div>
```

### Input newsletter
```jsx
// Sur fond blanc
<input className="input-newsletter" placeholder="Votre adresse email" />

// Sur fond sombre
<input className="input-newsletter input-newsletter-dark" placeholder="Votre adresse email" />
```

---

## Border radius

**Maximum 4px.** Pas de rounded-lg, rounded-xl etc.
```
rounded-none  — 0px    (boutons, badges, cards — valeur par défaut PLO)
rounded-sm    — 2px    (cartes de jeu)
rounded       — 4px    (maximum autorisé)
rounded-full  — 9999px (avatars uniquement)
```

---

## Sections — Structure type

```
Fond sombre standard  — bg-plo-void ou bg-plo-deep
Fond feutré (main)    — bg-plo-felt + classe .grain
Fond blanc            — bg-plo-white + classe .section-light
Footer                — bg-plo-black
```

### Rythme de la homepage
```
Hero               — bg-plo-void (avec photo)
Publications       — bg-plo-white (section-light)
Main de la semaine — bg-plo-felt (grain)
Newsletter         — bg-plo-white (section-light)
Discord            — bg-plo-deep
Footer             — bg-plo-black
```

---

## Animations

| Classe                 | Effet                                     | Usage             |
|-------------------------|--------------------------------------------|--------------------|
| `animate-ticker`       | Défilement horizontal infini (40s)         | Barre de news      |
| `animate-ticker-slow`  | Défilement horizontal lent (50s)           | Watermark animé    |
| `animate-fade-up`      | Apparition avec translation verticale       | Reveal au scroll   |
| `animate-bar-fill`     | Remplissage horizontal (via CSS var)        | Barres de vote     |
| `animate-pulse-subtle` | Pulse discret                                | Compteur live      |

---

## Éléments de marque distinctifs

### Symboles cartes utilisés comme ponctuation
- `♠` — séparateur dans le ticker de news, bullets Stratégie
- `♦` — séparateur footer, accent section Obsession
- `♣` — accent section Drops
- `♥` — rare, réservé au contexte communauté/humain

### Numérotation éditoriale
- Les mains de la semaine ont un numéro : `N°12`
- Le volume/édition du site : `VOL.01 — 2024`
- Ces éléments sont en `text-label` uppercase

### Texture grain
Ajouter la classe `.grain` sur les sections `bg-plo-felt` et certains heroes.
Crée une profondeur printed feel sans alourdir visuellement.

---

## Ce qu'on n'utilise PAS

- Gradients (sauf dark-to-darker sur les overlays de photo)
- Ombres portées lourdes (box-shadow préféré : 0 0 0 1px border)
- Border radius > 4px (sauf avatars)
- Animations décoratives multiples (un seul effet animé par section)
- Couleurs intermédiaires (pas de bleu, vert, violet, orange — uniquement le carmin)
- Icônes filled (line icons uniquement, Lucide React)
- Texte centré sur desktop (sauf hero et sections signatures)
