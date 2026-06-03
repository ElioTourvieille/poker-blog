import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, bookmark } from '@/lib/db'
import { toggleBookmarkSchema } from '@/lib/validators'

// POST /api/bookmarks — toggle bookmark (authentifié)
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = toggleBookmarkSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 })
  }

  const { postSlug } = parsed.data
  const userId = session.user.id

  const existing = await db
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.userId, userId), eq(bookmark.postSlug, postSlug)))
    .limit(1)

  if (existing.length > 0) {
    await db.delete(bookmark).where(and(eq(bookmark.userId, userId), eq(bookmark.postSlug, postSlug)))
  } else {
    await db.insert(bookmark).values({ userId, postSlug })
  }

  return NextResponse.json({ bookmarked: existing.length === 0 })
}

// GET /api/bookmarks — liste des bookmarks de l'user connecté
export async function GET(_request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const bookmarks = await db
    .select({ postSlug: bookmark.postSlug, createdAt: bookmark.createdAt })
    .from(bookmark)
    .where(eq(bookmark.userId, session.user.id))
    .orderBy(desc(bookmark.createdAt))

  return NextResponse.json(bookmarks)
}
