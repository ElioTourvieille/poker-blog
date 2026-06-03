import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db, handSubmission } from '@/lib/db'
import { createHandSubmissionSchema } from '@/lib/validators'

// POST /api/hand-submissions — soumettre une main (authentifié)
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createHandSubmissionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 })
  }

  const [submission] = await db
    .insert(handSubmission)
    .values({ ...parsed.data, userId: session.user.id })
    .returning()

  return NextResponse.json(submission, { status: 201 })
}

// GET /api/hand-submissions — liste des soumissions de l'user (ou toutes si admin)
export async function GET(_request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const whereClause = session.user.role === 'admin'
    ? undefined
    : eq(handSubmission.userId, session.user.id)

  const submissions = await db
    .select()
    .from(handSubmission)
    .where(whereClause)
    .orderBy(desc(handSubmission.createdAt))

  return NextResponse.json(submissions)
}
