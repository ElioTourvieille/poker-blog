import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/auth'
import { db, comment } from '@/lib/db'

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
