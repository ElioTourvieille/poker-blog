import { Heading, Hr, Link, Section, Text } from 'react-email'
import * as React from 'react'
import { EmailLayout } from '../_components/EmailLayout'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export interface DigestPost {
  title: string
  slug: string
  excerpt: string
  category?: string
}

export interface WeeklyDigestEmailProps {
  name: string
  posts: DigestPost[]
  weekLabel?: string
}

export function WeeklyDigestEmail({
  name,
  posts,
  weekLabel,
}: WeeklyDigestEmailProps) {
  const firstName = name.split(' ')[0]

  return (
    <EmailLayout preview={`Votre résumé poker de la semaine — ${posts.length} nouveaux articles`}>
      <Text style={s.label}>Résumé hebdomadaire</Text>
      <Heading style={s.heading}>
        Bonjour {firstName}, voici vos articles de la semaine
        {weekLabel ? ` (${weekLabel})` : ''}.
      </Heading>

      {posts.map((post, i) => (
        <Section key={post.slug}>
          {i > 0 && <Hr style={s.hr} />}
          {post.category && <Text style={s.category}>{post.category}</Text>}
          <Text style={s.postTitle}>
            <Link
              href={`${SITE_URL}/blog/${post.slug}`}
              style={s.postTitleLink}
            >
              {post.title}
            </Link>
          </Text>
          <Text style={s.excerpt}>{post.excerpt}</Text>
          <Text style={s.readMore}>
            <Link
              href={`${SITE_URL}/blog/${post.slug}`}
              style={s.readMoreLink}
            >
              Lire l'article →
            </Link>
          </Text>
        </Section>
      ))}

      <Hr style={s.hrBottom} />
      <Text style={s.footer}>
        Vous recevez cet email car vous êtes abonné(e) à la newsletter PokerBlog.
      </Text>
    </EmailLayout>
  )
}

const s = {
  label: {
    color: '#c9a84c',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '1px',
    margin: '0 0 8px',
    textTransform: 'uppercase' as const,
  },
  heading: {
    color: '#0f172a',
    fontSize: '22px',
    fontWeight: '700',
    lineHeight: '1.4',
    margin: '0 0 24px',
  },
  hr: {
    borderColor: '#e2e8f0',
    margin: '16px 0',
  },
  hrBottom: {
    borderColor: '#e2e8f0',
    margin: '24px 0 16px',
  },
  category: {
    color: '#c9a84c',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    margin: '0 0 4px',
    textTransform: 'uppercase' as const,
  },
  postTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 6px',
  },
  postTitleLink: {
    color: '#0f172a',
    textDecoration: 'none',
  },
  excerpt: {
    color: '#475569',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: '0 0 8px',
  },
  readMore: {
    margin: '0',
  },
  readMoreLink: {
    color: '#c9a84c',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  footer: {
    color: '#94a3b8',
    fontSize: '13px',
    margin: '0',
  },
}

export default function Preview() {
  return (
    <WeeklyDigestEmail
      name="Jean Dupont"
      weekLabel="2 juin 2026"
      posts={[
        {
          title: 'Comment jouer les set en position out-of-position',
          slug: 'jouer-set-oop',
          excerpt:
            'Le set est l\'une des mains les plus puissantes au poker, mais sa gestion en OOP reste délicate. Voici comment maximiser la valeur.',
          category: 'Stratégie cash game',
        },
        {
          title: 'GTO vs Exploitative : quelle approche choisir ?',
          slug: 'gto-vs-exploitative',
          excerpt:
            'Faut-il toujours jouer GTO ou adapter son jeu selon le profil des adversaires ? On analyse les deux approches.',
          category: 'Théorie',
        },
      ]}
    />
  )
}
