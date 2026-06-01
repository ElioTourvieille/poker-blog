import { sanityFetch } from '@/sanity/lib/live'
import type { PostCard, CategoryCard } from '@/types/blog'
import type {
  AuthorsQueryResult,
  AuthorBySlugQueryResult,
  AuthorPathsQueryResult,
  PageBySlugQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity.types'
import {
  postsQuery,
  postsCountQuery,
  featuredPostsQuery,
  postPathsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
  postsByCategoryCountQuery,
  postsByTagQuery,
  postsByAuthorQuery,
  relatedPostsQuery,
} from '@/sanity/queries/posts'
import { categoriesQuery, categoryBySlugQuery, categoryPathsQuery } from '@/sanity/queries/categories'
import { authorsQuery, authorBySlugQuery, authorPathsQuery } from '@/sanity/queries/authors'
import { siteSettingsQuery } from '@/sanity/queries/settings'
import { pageBySlugQuery } from '@/sanity/queries/pages'

export const POSTS_PER_PAGE = 12

// TypeGen failed for posts/categories queries (pagination + complex GROQ not statically analyzable).
// We use explicit return types with safe casts.
function asPostCards(data: unknown): PostCard[] {
  return (Array.isArray(data) ? data : []) as PostCard[]
}

function asCategoryCards(data: unknown): CategoryCard[] {
  return (Array.isArray(data) ? data : []) as CategoryCard[]
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(page = 1): Promise<{ posts: PostCard[]; total: number; pageCount: number }> {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  const [{ data: postsData }, { data: totalData }] = await Promise.all([
    sanityFetch({ query: postsQuery, params: { start, end } }),
    sanityFetch({ query: postsCountQuery }),
  ])
  const count = Number(totalData ?? 0)
  return { posts: asPostCards(postsData), total: count, pageCount: Math.ceil(count / POSTS_PER_PAGE) }
}

export async function getFeaturedPosts(): Promise<PostCard[]> {
  const { data } = await sanityFetch({ query: featuredPostsQuery })
  return asPostCards(data)
}

export async function getPostBySlug(slug: string): Promise<PostCard & {
  body: { fr?: unknown; en?: unknown } | null
  seo: { metaTitle?: string; metaDescription?: string; ogImage?: unknown } | null
  author: PostCard['author'] & {
    bio?: { fr?: unknown; en?: unknown } | null
    socialLinks?: { twitter?: string; instagram?: string; linkedin?: string } | null
  } | null
} | null> {
  const { data } = await sanityFetch({ query: postBySlugQuery, params: { slug } })
  return data as unknown as Awaited<ReturnType<typeof getPostBySlug>>
}

export async function getPostPaths(): Promise<string[]> {
  const { data } = await sanityFetch({ query: postPathsQuery })
  return ((Array.isArray(data) ? data : []) as (string | null)[]).filter(Boolean) as string[]
}

export async function getPostsByCategory(categorySlug: string, page = 1): Promise<{ posts: PostCard[]; total: number; pageCount: number }> {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  const [{ data: postsData }, { data: totalData }] = await Promise.all([
    sanityFetch({ query: postsByCategoryQuery, params: { categorySlug, start, end } }),
    sanityFetch({ query: postsByCategoryCountQuery, params: { categorySlug } }),
  ])
  const count = Number(totalData ?? 0)
  return { posts: asPostCards(postsData), total: count, pageCount: Math.ceil(count / POSTS_PER_PAGE) }
}

export async function getPostsByTag(tagSlug: string, page = 1): Promise<PostCard[]> {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  const { data } = await sanityFetch({ query: postsByTagQuery, params: { tagSlug, start, end } })
  return asPostCards(data)
}

export async function getPostsByAuthor(authorSlug: string): Promise<PostCard[]> {
  const { data } = await sanityFetch({ query: postsByAuthorQuery, params: { authorSlug } })
  return asPostCards(data)
}

export async function getRelatedPosts(currentId: string, categoryIds: string[]): Promise<PostCard[]> {
  const { data } = await sanityFetch({ query: relatedPostsQuery, params: { currentId, categoryIds } })
  return asPostCards(data)
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<CategoryCard[]> {
  const { data } = await sanityFetch({ query: categoriesQuery })
  return asCategoryCards(data)
}

export async function getCategoryBySlug(slug: string): Promise<CategoryCard | null> {
  const { data } = await sanityFetch({ query: categoryBySlugQuery, params: { slug } })
  return (data ?? null) as CategoryCard | null
}

export async function getCategoryPaths(): Promise<string[]> {
  const { data } = await sanityFetch({ query: categoryPathsQuery })
  return ((Array.isArray(data) ? data : []) as (string | null)[]).filter(Boolean) as string[]
}

// ─── Authors ──────────────────────────────────────────────────────────────────

export async function getAuthors(): Promise<AuthorsQueryResult> {
  const { data } = await sanityFetch({ query: authorsQuery })
  return (data ?? []) as AuthorsQueryResult
}

export async function getAuthorBySlug(slug: string): Promise<AuthorBySlugQueryResult> {
  const { data } = await sanityFetch({ query: authorBySlugQuery, params: { slug } })
  return data as AuthorBySlugQueryResult
}

export async function getAuthorPaths(): Promise<string[]> {
  const { data } = await sanityFetch({ query: authorPathsQuery })
  return ((data ?? []) as AuthorPathsQueryResult).filter(Boolean) as string[]
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export async function getPageBySlug(slug: string): Promise<PageBySlugQueryResult> {
  const { data } = await sanityFetch({ query: pageBySlugQuery, params: { slug } })
  return data as PageBySlugQueryResult
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettingsQueryResult> {
  const { data } = await sanityFetch({ query: siteSettingsQuery })
  return data as SiteSettingsQueryResult
}
