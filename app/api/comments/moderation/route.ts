import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, comment, user } from '@/lib/db'

// GET /api/comments/moderation — commentaires en attente d'approbation (admin only)
export async function GET(_request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const pending = await db
    .select({
      id: comment.id,
      content: comment.content,
      postSlug: comment.postSlug,
      createdAt: comment.createdAt,
      user: { id: user.id, name: user.name, image: user.image },
    })
    .from(comment)
    .innerJoin(user, eq(comment.userId, user.id))
    .where(eq(comment.isApproved, false))
    .orderBy(asc(comment.createdAt))

  return NextResponse.json(pending)
}
