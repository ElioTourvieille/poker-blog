import type { MetadataRoute } from 'next'
import { getPostPaths, getCategoryPaths, getAuthorPaths } from '@/lib/sanity/fetch'
import { routing } from '@/i18n/routing'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://poker-blog.com'
const locales = routing.locales

function buildUrl(path: string) {
  return `${BASE_URL}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, categorySlugs, authorSlugs] = await Promise.all([
    getPostPaths(),
    getCategoryPaths(),
    getAuthorPaths(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: buildUrl(`/${locale}`), changeFrequency: 'daily', priority: 1 },
    { url: buildUrl(`/${locale}/blog`), changeFrequency: 'daily', priority: 0.9 },
    { url: buildUrl(`/${locale}/a-propos`), changeFrequency: 'monthly', priority: 0.5 },
    { url: buildUrl(`/${locale}/contact`), changeFrequency: 'monthly', priority: 0.5 },
  ])

  const postRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    postSlugs.map((slug) => ({
      url: buildUrl(`/${locale}/blog/${slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  const categoryRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    categorySlugs.map((slug) => ({
      url: buildUrl(`/${locale}/categories/${slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  const authorRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    authorSlugs.map((slug) => ({
      url: buildUrl(`/${locale}/auteurs/${slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...authorRoutes]
}
