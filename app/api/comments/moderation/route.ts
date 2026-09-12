import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, asc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, comment, user } from '@/lib/db'

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 200

// GET /api/comments/moderation?limit=50 — commentaires en attente d'approbation
// (admin only), les plus anciens d'abord. `limit` borné : aucun rate limiting
// n'existe encore sur POST /api/comments (dette documentée dans AGENTS.md), donc
// la file d'attente peut grossir sans plafond — cette route ne doit jamais
// renvoyer un JSON de taille non bornée.
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  // `null` (paramètre absent) → défaut ; distingué de "0" explicite, qui doit
  // renvoyer une page vide plutôt que de retomber silencieusement sur le défaut.
  const limitParam = request.nextUrl.searchParams.get('limit')
  const requestedLimit = limitParam === null ? null : Number(limitParam)
  const limit = requestedLimit !== null && Number.isInteger(requestedLimit) && requestedLimit >= 0
    ? Math.min(requestedLimit, MAX_LIMIT)
    : DEFAULT_LIMIT

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
    .limit(limit)

  return NextResponse.json(pending)
}
