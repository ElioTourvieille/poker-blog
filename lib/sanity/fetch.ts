import { sanityFetch } from '@/sanity/lib/live'
import {
  postsQuery,
  postsCountQuery,
  featuredPostsQuery,
  postPathsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
  postsByCategoryCountQuery,
  postsByTagQuery,
  relatedPostsQuery,
} from '@/sanity/queries/posts'
import { categoriesQuery, categoryBySlugQuery, categoryPathsQuery } from '@/sanity/queries/categories'
import { authorsQuery, authorBySlugQuery, authorPathsQuery } from '@/sanity/queries/authors'
import { siteSettingsQuery } from '@/sanity/queries/settings'

export const POSTS_PER_PAGE = 12

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getPosts(page = 1) {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  const [{ data: posts }, { data: total }] = await Promise.all([
    sanityFetch({ query: postsQuery, params: { start, end } }),
    sanityFetch({ query: postsCountQuery }),
  ])
  const count = Number(total ?? 0)
  return { posts: posts ?? [], total: count, pageCount: Math.ceil(count / POSTS_PER_PAGE) }
}

export async function getFeaturedPosts() {
  const { data } = await sanityFetch({ query: featuredPostsQuery })
  return data ?? []
}

export async function getPostBySlug(slug: string) {
  const { data } = await sanityFetch({ query: postBySlugQuery, params: { slug } })
  return data
}

export async function getPostPaths() {
  const { data } = await sanityFetch({ query: postPathsQuery })
  return data ?? []
}

export async function getPostsByCategory(categorySlug: string, page = 1) {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  const [{ data: posts }, { data: total }] = await Promise.all([
    sanityFetch({ query: postsByCategoryQuery, params: { categorySlug, start, end } }),
    sanityFetch({ query: postsByCategoryCountQuery, params: { categorySlug } }),
  ])
  const count = Number(total ?? 0)
  return { posts: posts ?? [], total: count, pageCount: Math.ceil(count / POSTS_PER_PAGE) }
}

export async function getPostsByTag(tagSlug: string, page = 1) {
  const start = (page - 1) * POSTS_PER_PAGE
  const end = start + POSTS_PER_PAGE
  const { data } = await sanityFetch({ query: postsByTagQuery, params: { tagSlug, start, end } })
  return data ?? []
}

export async function getRelatedPosts(currentId: string, categoryIds: string[]) {
  const { data } = await sanityFetch({ query: relatedPostsQuery, params: { currentId, categoryIds } })
  return data ?? []
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories() {
  const { data } = await sanityFetch({ query: categoriesQuery })
  return data ?? []
}

export async function getCategoryBySlug(slug: string) {
  const { data } = await sanityFetch({ query: categoryBySlugQuery, params: { slug } })
  return data
}

export async function getCategoryPaths() {
  const { data } = await sanityFetch({ query: categoryPathsQuery })
  return data ?? []
}

// ─── Authors ──────────────────────────────────────────────────────────────────

export async function getAuthors() {
  const { data } = await sanityFetch({ query: authorsQuery })
  return data ?? []
}

export async function getAuthorBySlug(slug: string) {
  const { data } = await sanityFetch({ query: authorBySlugQuery, params: { slug } })
  return data
}

export async function getAuthorPaths() {
  const { data } = await sanityFetch({ query: authorPathsQuery })
  return data ?? []
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  const { data } = await sanityFetch({ query: siteSettingsQuery })
  return data
}
