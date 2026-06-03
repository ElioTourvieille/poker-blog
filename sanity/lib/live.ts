import { defineLive } from 'next-sanity/live'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Si le token n'est pas défini, on passe false pour supprimer le warning.
  // Les drafts ne seront pas accessibles sans token, mais le contenu publié fonctionne.
  serverToken: process.env.SANITY_API_READ_TOKEN || false,
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN || false,
})
