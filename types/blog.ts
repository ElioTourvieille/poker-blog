// Shared types for blog data — used by both fetch functions and components.
// These mirror the GROQ projections in sanity/queries/posts.ts and categories.ts.

export type LocalizedString = { fr?: string; en?: string } | null

export type SanityImageRef = {
  asset?: { _ref: string; _type?: string }
  alt?: string
  _type?: string
} | null

export type SanitySlug = { current?: string | null } | null

export type PostCategory = {
  _id: string
  title: LocalizedString
  slug: SanitySlug
  color: string | null
  icon: string | null
}

export type PostTag = {
  _id: string
  name: string | null
  slug: SanitySlug
}

export type PostCard = {
  _id: string
  title: LocalizedString
  slug: SanitySlug
  publishedAt: string | null
  excerpt: LocalizedString
  mainImage: SanityImageRef
  readingTime: number | null
  featured?: boolean | null
  author: {
    name: string | null
    image: SanityImageRef
    slug: SanitySlug
  } | null
  categories: PostCategory[] | null
  tags: PostTag[] | null
}

export type CategoryCard = {
  _id: string
  title: LocalizedString
  slug: SanitySlug
  description: LocalizedString
  color: string | null
  icon: string | null
}
