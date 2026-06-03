import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, newsletterSubscriber } from '@/lib/db'
import { newsletterSubscribeSchema } from '@/lib/validators'

// POST /api/newsletter — inscription newsletter (public)
export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = newsletterSubscribeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { email, locale, lists } = parsed.data

  // Upsert : mise à jour si déjà inscrit
  const existing = await db
    .select()
    .from(newsletterSubscriber)
    .where(eq(newsletterSubscriber.email, email))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(newsletterSubscriber)
      .set({ locale, lists })
      .where(eq(newsletterSubscriber.email, email))
    return NextResponse.json({ status: 'updated' })
  }

  await db.insert(newsletterSubscriber).values({ email, locale, lists })

  // TODO: envoyer un email de confirmation via Resend
  // await sendConfirmationEmail({ email, locale })

  return NextResponse.json({ status: 'subscribed' }, { status: 201 })
}
