import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, newsletterSubscriber } from '@/lib/db'
import { getUnsubscribeToken } from '@/lib/tokens'

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')
  const token = request.nextUrl.searchParams.get('token')

  if (!email || !token) {
    return NextResponse.redirect(`${SITE_URL}/newsletter?error=missing_params`)
  }

  const expectedToken = getUnsubscribeToken(email)
  if (token !== expectedToken) {
    return NextResponse.redirect(`${SITE_URL}/newsletter?error=invalid_token`)
  }

  await db
    .delete(newsletterSubscriber)
    .where(eq(newsletterSubscriber.email, email))

  return NextResponse.redirect(`${SITE_URL}/newsletter?unsubscribed=true`)
}
