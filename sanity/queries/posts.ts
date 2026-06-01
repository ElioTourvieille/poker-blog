import { defineQuery } from 'next-sanity'

// Projection partagée pour la liste (sans body)
const postCardFields = /* groq */`
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  readingTime,
  featured,
  "author": author->{ name, image, slug },
  "categories": categories[]->{ _id, title, slug, color, icon },
  "tags": tags[]->{ _id, name, slug }
`

// Liste paginée
export const postsQuery = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) [$start...$end] {
    ${postCardFields}
  }
`)

export const postsCountQuery = defineQuery(`
  count(*[_type == "post"])
`)

// Posts featured (homepage)
export const featuredPostsQuery = defineQuery(`
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
    ${postCardFields}
  }
`)

// Slugs pour generateStaticParams
export const postPathsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`)

// Détail complet d'un post
export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    body,
    mainImage,
    readingTime,
    featured,
    seo,
    "author": author->{ name, image, bio, slug, socialLinks },
    "categories": categories[]->{ _id, title, slug, color, icon },
    "tags": tags[]->{ _id, name, slug }
  }
`)

// Posts par catégorie (slug de catégorie)
export const postsByCategoryQuery = defineQuery(`
  *[_type == "post" && $categorySlug in categories[]->slug.current]
    | order(publishedAt desc) [$start...$end] {
    ${postCardFields}
  }
`)

export const postsByCategoryCountQuery = defineQuery(`
  count(*[_type == "post" && $categorySlug in categories[]->slug.current])
`)

// Posts par tag
export const postsByTagQuery = defineQuery(`
  *[_type == "post" && $tagSlug in tags[]->slug.current]
    | order(publishedAt desc) [$start...$end] {
    ${postCardFields}
  }
`)

// Posts liés (même catégorie, hors post courant)
export const relatedPostsQuery = defineQuery(`
  *[
    _type == "post"
    && _id != $currentId
    && count(categories[@._ref in $categoryIds]) > 0
  ] | order(publishedAt desc) [0...3] {
    ${postCardFields}
  }
`)
