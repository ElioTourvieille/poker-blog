import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, and, desc } from 'drizzle-orm'
import { auth } from '@/auth'
import { db, comment, user } from '@/lib/db'
import { createCommentSchema } from '@/lib/validators'

// GET /api/comments?postSlug=xxx — commentaires approuvés d'un post
export async function GET(request: NextRequest) {
  const postSlug = request.nextUrl.searchParams.get('postSlug')
  if (!postSlug) {
    return NextResponse.json({ error: 'postSlug requis' }, { status: 400 })
  }

  const comments = await db
    .select({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: { id: user.id, name: user.name, image: user.image },
    })
    .from(comment)
    .innerJoin(user, eq(comment.userId, user.id))
    .where(and(eq(comment.postSlug, postSlug), eq(comment.isApproved, true)))
    .orderBy(desc(comment.createdAt))

  return NextResponse.json(comments)
}

// POST /api/comments — créer un commentaire (authentifié)
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createCommentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const [newComment] = await db
    .insert(comment)
    .values({
      content: parsed.data.content,
      postSlug: parsed.data.postSlug,
      userId: session.user.id,
      isApproved: false, // modération manuelle
    })
    .returning()

  return NextResponse.json(newComment, { status: 201 })
}
