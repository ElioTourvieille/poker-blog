import { groq } from 'next-sanity'

// Récupérer tous les posts
export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    readingTime,
    featured,
    "author": author->{
      name,
      image,
      slug
    },
    "categories": categories[]->{
      title,
      slug,
      color
    }
  }
`

// Récupérer un post par slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    body,
    mainImage,
    readingTime,
    excerpt,
    "author": author->{
      name,
      image,
      bio,
      slug,
      socialLinks
    },
    "categories": categories[]->{
      title,
      slug,
      color
    }
  }
`

// Récupérer les slugs de tous les posts (pour generateStaticParams)
export const postPathsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`

// Récupérer les posts featured
export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    readingTime,
    "author": author->{
      name,
      image,
      slug
    },
    "categories": categories[]->{
      title,
      slug,
      color
    }
  }
`

// Récupérer toutes les catégories
export const categoriesQuery = groq`
  *[_type == "category"] | order(title.fr asc) {
    _id,
    title,
    slug,
    description,
    color
  }
`