import { defineQuery } from 'next-sanity'

export const postsQuery = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) [$start...$end] {
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
  }
`)

export const postsCountQuery = defineQuery(`
  count(*[_type == "post"])
`)

export const featuredPostsQuery = defineQuery(`
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
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
  }
`)

export const postPathsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`)

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

export const postsByCategoryQuery = defineQuery(`
  *[_type == "post" && $categorySlug in categories[]->slug.current]
    | order(publishedAt desc) [$start...$end] {
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
  }
`)

export const postsByCategoryCountQuery = defineQuery(`
  count(*[_type == "post" && $categorySlug in categories[]->slug.current])
`)

export const postsByTagQuery = defineQuery(`
  *[_type == "post" && $tagSlug in tags[]->slug.current]
    | order(publishedAt desc) [$start...$end] {
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
  }
`)

export const postsByAuthorQuery = defineQuery(`
  *[_type == "post" && author->slug.current == $authorSlug]
    | order(publishedAt desc) {
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
  }
`)

export const relatedPostsQuery = defineQuery(`
  *[
    _type == "post"
    && _id != $currentId
    && count(categories[@._ref in $categoryIds]) > 0
  ] | order(publishedAt desc) [0...3] {
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
  }
`)
