import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, comment } from '@/lib/db'
import { moderateCommentSchema } from '@/lib/validators'

// PATCH /api/comments/[id] — approuver (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = moderateCommentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 })
  }

  const { id } = await params

  const [existing] = await db.select().from(comment).where(eq(comment.id, id))
  if (!existing) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }
  if (existing.isApproved) {
    return NextResponse.json({ error: 'Déjà approuvé' }, { status: 409 })
  }

  const [updated] = await db
    .update(comment)
    .set({ isApproved: true, updatedAt: new Date() })
    .where(eq(comment.id, id))
    .returning()

  return NextResponse.json(updated)
}

// DELETE /api/comments/[id] — supprimer (proprio ou admin)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const { id } = await params

  // Admin peut tout supprimer, sinon seulement le sien
  const whereClause = session.user.role === 'admin'
    ? eq(comment.id, id)
    : and(eq(comment.id, id), eq(comment.userId, session.user.id))

  const [deleted] = await db.delete(comment).where(whereClause).returning()

  if (!deleted) {
    return NextResponse.json({ error: 'Introuvable ou non autorisé' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
