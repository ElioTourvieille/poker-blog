import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, and, count } from 'drizzle-orm'
import { auth } from '@/auth'
import { db, like } from '@/lib/db'
import { toggleLikeSchema } from '@/lib/validators'

// POST /api/likes — toggle like (authentifié)
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = toggleLikeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { postSlug } = parsed.data
  const userId = session.user.id

  const existing = await db
    .select()
    .from(like)
    .where(and(eq(like.userId, userId), eq(like.postSlug, postSlug)))
    .limit(1)

  if (existing.length > 0) {
    await db.delete(like).where(and(eq(like.userId, userId), eq(like.postSlug, postSlug)))
  } else {
    await db.insert(like).values({ userId, postSlug })
  }

  const [{ total }] = await db
    .select({ total: count() })
    .from(like)
    .where(eq(like.postSlug, postSlug))

  return NextResponse.json({ liked: existing.length === 0, count: Number(total) })
}

// GET /api/likes?postSlug=xxx — compte + état pour l'user courant
export async function GET(request: NextRequest) {
  const postSlug = request.nextUrl.searchParams.get('postSlug')
  if (!postSlug) {
    return NextResponse.json({ error: 'postSlug requis' }, { status: 400 })
  }

  const session = await auth.api.getSession({ headers: await headers() })

  const [{ total }] = await db
    .select({ total: count() })
    .from(like)
    .where(eq(like.postSlug, postSlug))

  let liked = false
  if (session) {
    const existing = await db
      .select()
      .from(like)
      .where(and(eq(like.userId, session.user.id), eq(like.postSlug, postSlug)))
      .limit(1)
    liked = existing.length > 0
  }

  return NextResponse.json({ liked, count: Number(total) })
}
