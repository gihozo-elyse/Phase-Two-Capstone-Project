'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Feather } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const commonLinks = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
  ]

  const authLinks = user
    ? [
        ...commonLinks,
        { label: 'Profile', href: `/profile/${user.id}` },
        { label: 'Write', href: '/write' },
      ]
    : [...commonLinks]

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <Feather className="w-6 h-6" />
            <span>Luminary</span>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <Link
                href="/write"
                className={`hidden sm:inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${
                  pathname === '/write'
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Feather className="w-4 h-4" />
                Write
              </Link>
            )}

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`flex items-center justify-center rounded-full border-2 border-yellow-500 bg-yellow-500/10 text-yellow-400 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black ${
                  user ? 'h-12 w-12 text-lg' : 'h-11 w-28 text-sm uppercase'
                }`}
                aria-label="Toggle navigation menu"
              >
                {user
                  ? (user.full_name || user.email || 'U')
                      .trim()
                      .charAt(0)
                      .toUpperCase()
                  : 'Menu'}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-gray-800 bg-gray-950/95 backdrop-blur shadow-2xl overflow-hidden z-10">
                  <div className="py-2">
                    {authLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-3 text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'text-gray-200 hover:bg-yellow-500/5 hover:text-yellow-400'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {user ? (
                      <button
                        onClick={signOut}
                        className="w-full text-left px-4 py-3 text-sm font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/auth?mode=signin"
                          className="block px-4 py-3 text-sm font-medium text-gray-200 hover:bg-yellow-500/5 hover:text-yellow-400 transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth?mode=signup"
                          className="block px-4 py-3 text-sm font-semibold text-black bg-yellow-500 hover:bg-yellow-400 transition-colors"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

