'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Feather } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <Feather className="w-6 h-6" />
            <span>Luminary</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`hover:text-yellow-500 transition-colors ${
                pathname === '/' ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/search"
              className={`hover:text-yellow-500 transition-colors ${
                pathname === '/search' ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              Search
            </Link>
            {user && (
              <>
                <Link
                  href="/write"
                  className={`hover:text-yellow-500 transition-colors ${
                    pathname === '/write' ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  Write
                </Link>
                <Link
                  href={`/profile/${user.id}`}
                  className={`hover:text-yellow-500 transition-colors ${
                    pathname?.startsWith('/profile')
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  Profile
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-300 hidden sm:block">
                  {user.full_name || user.email}
                </span>
                <Button
                  onClick={signOut}
                  variant="outline-golden"
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth?mode=signin">
                  <Button variant="ghost-dark" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?mode=signup">
                  <Button variant="golden" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

