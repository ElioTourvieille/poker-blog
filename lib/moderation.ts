import { NextResponse } from 'next/server'

/**
 * Après un UPDATE conditionnel (WHERE id = ? AND <état "en attente">) qui n'a
 * rien mis à jour, détermine si c'est parce que la ligne n'existe pas (404) ou
 * parce qu'elle a déjà été traitée par une requête concurrente (409). Centralisé
 * pour ne pas dupliquer le pattern race-safe entre les endpoints de modération
 * (comments, hand-submissions) — voir prompts/04-moderation-endpoints.md.
 */
export function moderationNotFoundOrConflict(existing: unknown, conflictMessage: string) {
  if (!existing) {
    return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  }
  return NextResponse.json({ error: conflictMessage }, { status: 409 })
}
