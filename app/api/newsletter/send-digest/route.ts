import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, newsletterSubscriber } from '@/lib/db'
import { serverClient } from '@/sanity/lib/client'
import { sendWeeklyDigestEmail } from '@/lib/mailer'
import { getUnsubscribeToken } from '@/lib/tokens'
import type { DigestPost } from '@/emails/digest/WeeklyDigestEmail'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

// POST /api/newsletter/send-digest
// Déclenché par le cron Vercel chaque lundi à 8h (vercel.json)
// Sécurisé par Authorization: Bearer <CRON_SECRET>
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const posts = await serverClient.fetch<(DigestPost & { _id: string })[]>(
    `*[_type == "post" && publishedAt >= $since && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "category": categories[0]->title
    }`,
    { since },
  )

  if (posts.length === 0) {
    return NextResponse.json({ status: 'skipped', reason: 'no_posts_this_week' })
  }

  const allConfirmed = await db
    .select()
    .from(newsletterSubscriber)
    .where(eq(newsletterSubscriber.isConfirmed, true))

  const targets = allConfirmed.filter((s) => s.lists.includes('GENERAL'))

  const weekLabel = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  let sent = 0
  const failed: string[] = []

  for (const sub of targets) {
    const unsubscribeToken = getUnsubscribeToken(sub.email)
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${unsubscribeToken}`
    try {
      await sendWeeklyDigestEmail({
        name: sub.email,
        email: sub.email,
        posts,
        weekLabel,
        unsubscribeUrl,
      })
      sent++
    } catch {
      failed.push(sub.email)
    }
  }

  return NextResponse.json({
    status: 'sent',
    sent,
    total: targets.length,
    ...(failed.length > 0 && { failed }),
  })
}
