import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, newsletterSubscriber } from '@/lib/db'
import { verifyToken } from '@/lib/tokens'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/newsletter?error=missing_token`)
  }

  const payload = verifyToken<{ email: string; action: string }>(token)
  if (!payload || payload.action !== 'newsletter-confirm') {
    return NextResponse.redirect(`${SITE_URL}/newsletter?error=invalid_token`)
  }

  const [subscriber] = await db
    .select()
    .from(newsletterSubscriber)
    .where(eq(newsletterSubscriber.email, payload.email))
    .limit(1)

  if (!subscriber) {
    return NextResponse.redirect(`${SITE_URL}/newsletter?error=not_found`)
  }

  if (!subscriber.isConfirmed) {
    await db
      .update(newsletterSubscriber)
      .set({ isConfirmed: true, confirmedAt: new Date() })
      .where(eq(newsletterSubscriber.email, payload.email))
  }

  return NextResponse.redirect(`${SITE_URL}/newsletter?confirmed=true`)
}
