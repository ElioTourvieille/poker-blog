import { defineQuery } from 'next-sanity'

export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    seo
  }
`)
