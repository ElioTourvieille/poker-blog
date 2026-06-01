import { redirect } from 'next/navigation'

// Middleware redirects / → /fr, this is a safety fallback
export default function RootPage() {
  redirect('/fr')
}
