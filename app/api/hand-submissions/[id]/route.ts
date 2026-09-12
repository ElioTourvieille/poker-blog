import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
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

  const body = await request.json()
  const parsed = moderateHandSubmissionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 })
  }

  const { id } = await params

  const [row] = await db
    .select({ submission: handSubmission, author: user })
    .from(handSubmission)
    .innerJoin(user, eq(handSubmission.userId, user.id))
    .where(eq(handSubmission.id, id))

  if (!row) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }
  const { submission: existing, author } = row
  if (existing.status !== 'PENDING') {
    return NextResponse.json({ error: 'Déjà traité' }, { status: 409 })
  }

  if (parsed.data.status === 'APPROVED') {
    const [updated] = await db
      .update(handSubmission)
      .set({
        status: 'APPROVED',
        publishedHandId: parsed.data.publishedHandId ?? existing.publishedHandId,
        updatedAt: new Date(),
      })
      .where(eq(handSubmission.id, id))
      .returning()

    // Pas de page "Main de la semaine" tant que la Phase 03 n'existe pas —
    // on n'envoie l'email que si un lien réel a été fourni (voir prompts/04-moderation-endpoints.md).
    if (parsed.data.publishUrl) {
      await sendHandSelectedEmail({
        name: author.name,
        email: author.email,
        publishUrl: parsed.data.publishUrl,
        board: existing.board,
        situation: existing.situation,
      })
    }

    return NextResponse.json(updated)
  }

  const [updated] = await db
    .update(handSubmission)
    .set({
      status: 'REJECTED',
      rejectionNote: parsed.data.rejectionNote,
      updatedAt: new Date(),
    })
    .where(eq(handSubmission.id, id))
    .returning()

  await sendHandRejectedEmail({
    name: author.name,
    email: author.email,
    rejectionNote: parsed.data.rejectionNote,
  })

  return NextResponse.json(updated)
}
