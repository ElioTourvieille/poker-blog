'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signOut } from '@/lib/auth-client'
import { useLocale } from 'next-intl'
import Link from 'next/link'

export function UserMenu() {
  const { data: session, isPending } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const locale = useLocale()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (isPending) {
    return <div className="w-8 h-8 rounded-full bg-surface-container-high animate-pulse" />
  }

  if (!session) return null

  const user = session.user
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email?.[0].toUpperCase() ?? '?'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full focus:outline-none"
        aria-label="Menu utilisateur"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? ''}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-ui text-xs font-medium flex items-center justify-center">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-outline-variant">
            <p className="font-ui text-xs font-medium text-on-surface truncate">{user.name}</p>
            <p className="font-ui text-xs text-outline truncate">{user.email}</p>
          </div>

          <Link
            href={`/${locale}/dashboard`}
            onClick={() => setOpen(false)}
            className="block px-4 py-2 font-ui text-sm text-on-surface hover:bg-surface-container transition-colors"
          >
            Mon espace
          </Link>

          <button
            onClick={() => {
              setOpen(false)
              signOut({ fetchOptions: { onSuccess: () => { window.location.href = `/${locale}` } } })
            }}
            className="w-full text-left px-4 py-2 font-ui text-sm text-secondary hover:bg-surface-container transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}
