import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, handSubmission, user } from '@/lib/db'
import { moderateHandSubmissionSchema } from '@/lib/validators'
import { sendHandSelectedEmail, sendHandRejectedEmail } from '@/lib/mailer'

// PATCH /api/hand-submissions/[id] — approuver ou rejeter (admin only)
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
  const parsed = moderateHandSubmissionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 })
  }

  const { id } = await params

  // UPDATE conditionné sur status='PENDING' pour rester atomique : deux PATCH
  // concurrents sur la même soumission ne doivent pas tous les deux réussir
  // (et donc pas déclencher un double email).
  const [updated] =
    parsed.data.status === 'APPROVED'
      ? await db
          .update(handSubmission)
          .set({
            status: 'APPROVED',
            publishedHandId: parsed.data.publishedHandId,
            updatedAt: new Date(),
          })
          .where(and(eq(handSubmission.id, id), eq(handSubmission.status, 'PENDING')))
          .returning()
      : await db
          .update(handSubmission)
          .set({
            status: 'REJECTED',
            rejectionNote: parsed.data.rejectionNote,
            updatedAt: new Date(),
          })
          .where(and(eq(handSubmission.id, id), eq(handSubmission.status, 'PENDING')))
          .returning()

  if (!updated) {
    // Rien mis à jour : soit introuvable, soit déjà traité (race perdue).
    const [existing] = await db.select().from(handSubmission).where(eq(handSubmission.id, id))
    if (!existing) {
      return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Déjà traité' }, { status: 409 })
  }

  const [author] = await db.select().from(user).where(eq(user.id, updated.userId))

  if (parsed.data.status === 'APPROVED') {
    // Pas de page "Main de la semaine" tant que la Phase 03 n'existe pas —
    // on n'envoie l'email que si un lien réel a été fourni (voir prompts/04-moderation-endpoints.md).
    if (parsed.data.publishUrl && author) {
      await sendHandSelectedEmail({
        name: author.name,
        email: author.email,
        publishUrl: parsed.data.publishUrl,
        board: updated.board,
        situation: updated.situation,
      })
    }
  } else if (author) {
    await sendHandRejectedEmail({
      name: author.name,
      email: author.email,
      rejectionNote: parsed.data.rejectionNote,
    })
  }

  return NextResponse.json(updated)
}
