import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, comment } from '@/lib/db'
import { moderateCommentSchema } from '@/lib/validators'
import { moderationNotFoundOrConflict } from '@/lib/moderation'

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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête JSON invalide' }, { status: 422 })
  }
  const parsed = moderateCommentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 })
  }

  const { id } = await params

  // UPDATE conditionné sur isApproved=false pour rester atomique : deux PATCH
  // concurrents sur le même commentaire ne doivent pas tous les deux réussir.
  const [updated] = await db
    .update(comment)
    .set({ isApproved: true, updatedAt: new Date() })
    .where(and(eq(comment.id, id), eq(comment.isApproved, false)))
    .returning()

  if (updated) {
    return NextResponse.json(updated)
  }

  // Rien mis à jour : soit introuvable, soit déjà approuvé (race perdue).
  const [existing] = await db.select().from(comment).where(eq(comment.id, id))
  return moderationNotFoundOrConflict(existing, 'Déjà approuvé')
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
