import { createHmac } from 'crypto'

function secret() {
  return process.env.BETTER_AUTH_SECRET ?? 'dev-fallback-secret-change-in-prod'
}

// ─── Signed tokens (avec expiry) ─────────────────────────────────────────────
// Format: base64url(JSON.stringify(payload)).hmac_signature

export function signToken(
  payload: Record<string, unknown>,
  expiresInMs = 7 * 24 * 60 * 60 * 1000,
): string {
  const data = { ...payload, exp: Date.now() + expiresInMs }
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64url')
  const sig = createHmac('sha256', secret()).update(encoded).digest('base64url')
  return `${encoded}.${sig}`
}

export function verifyToken<T extends Record<string, unknown>>(token: string): T | null {
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return null
  const encoded = token.slice(0, dotIndex)
  const sig = token.slice(dotIndex + 1)
  const expectedSig = createHmac('sha256', secret()).update(encoded).digest('base64url')
  if (sig !== expectedSig) return null
  try {
    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString())
    if (typeof data.exp === 'number' && data.exp < Date.now()) return null
    return data as T
  } catch {
    return null
  }
}

// ─── Unsubscribe token (déterministe, sans expiry) ────────────────────────────
// Même email → même token, lien valide indéfiniment

export function getUnsubscribeToken(email: string): string {
  return createHmac('sha256', secret()).update(`unsubscribe:${email}`).digest('base64url')
}
