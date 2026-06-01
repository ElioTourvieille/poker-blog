import { defineLive } from 'next-sanity/live'
import { client } from './client'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  // Token serveur pour accéder aux drafts en draft mode
  serverToken: process.env.SANITY_API_READ_TOKEN,
  // Token navigateur pour le live preview dans le Studio (optionnel)
  browserToken: process.env.NEXT_PUBLIC_SANITY_TOKEN,
})
