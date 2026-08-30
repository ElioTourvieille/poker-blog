/**
 * PLO — Chargement des polices
 *
 * Les 3 polices de la marque, chargées via next/font/google (self-hosting +
 * optimisation automatique). Les variables CSS générées ici sont consommées
 * dans app/globals.css (@theme inline) sous --font-serif / --font-ui / --font-sans.
 */

import { Bebas_Neue, Source_Serif_4, Inter } from 'next/font/google'

// ─── Display — titres, nav, boutons, badges, hero ─────────────────────────────
// Bebas Neue n'a qu'un seul weight (400 = visuellement bold)
export const bebasNeue = Bebas_Neue({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
  preload: true, // critique — utilisée above the fold (logo, nav)
})

// ─── Éditorial — corps des articles, citations, longform ──────────────────────
export const sourceSerif = Source_Serif_4({
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-serif',
})

// ─── Utilitaire — metadata, tags, dates, labels UI, navigation ────────────────
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
})

// ─── Export combiné pour le layout racine ──────────────────────────────────────
export const fonts = {
  variables: [bebasNeue.variable, sourceSerif.variable, inter.variable].join(' '),
}
