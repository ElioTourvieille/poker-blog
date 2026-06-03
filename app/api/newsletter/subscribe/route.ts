import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, newsletterSubscriber } from '@/lib/db'
import { newsletterSubscribeSchema } from '@/lib/validators'
import { signToken } from '@/lib/tokens'
import { sendNewsletterConfirmEmail } from '@/lib/mailer'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = newsletterSubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 })
  }

  const { email, locale, lists } = parsed.data

  const [existing] = await db
    .select()
    .from(newsletterSubscriber)
    .where(eq(newsletterSubscriber.email, email))
    .limit(1)

  if (existing?.isConfirmed) {
    await db
      .update(newsletterSubscriber)
      .set({ locale, lists })
      .where(eq(newsletterSubscriber.email, email))
    return NextResponse.json({ status: 'already_confirmed' })
  }

  if (existing) {
    await db
      .update(newsletterSubscriber)
      .set({ locale, lists })
      .where(eq(newsletterSubscriber.email, email))
  } else {
    await db.insert(newsletterSubscriber).values({ email, locale, lists })
  }

  const token = signToken({ email, action: 'newsletter-confirm' })
  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${encodeURIComponent(token)}`
  await sendNewsletterConfirmEmail({ email, confirmUrl, locale })

  return NextResponse.json({ status: 'confirmation_sent' }, { status: 201 })
}
