import { defineQuery } from 'next-sanity'

export const categoriesQuery = defineQuery(`
  *[_type == "category"] | order(title.fr asc) {
    _id,
    title,
    slug,
    description,
    color,
    icon
  }
`)

export const categoryBySlugQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    color,
    icon
  }
`)

export const categoryPathsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)][].slug.current
`)
