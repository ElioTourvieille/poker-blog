import { defineQuery } from 'next-sanity'

export const authorsQuery = defineQuery(`
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug,
    image,
    bio,
    socialLinks
  }
`)

export const authorBySlugQuery = defineQuery(`
  *[_type == "author" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    image,
    bio,
    socialLinks
  }
`)

export const authorPathsQuery = defineQuery(`
  *[_type == "author" && defined(slug.current)][].slug.current
`)
