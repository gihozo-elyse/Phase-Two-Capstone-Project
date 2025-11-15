'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiPost } from '@/lib/api-client'
import { Button } from '@/components/ui/Button'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') || 'signin'
  const [mode, setMode] = useState<'signin' | 'signup'>(
    initialMode === 'signup' ? 'signup' : 'signin'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const redirectTo = searchParams.get('redirect') || '/write'

  // Update mode when URL params change
  useEffect(() => {
    const urlMode = searchParams.get('mode')
    if (urlMode === 'signup') {
      setMode('signup')
    } else if (urlMode === 'signin') {
      setMode('signin')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        // Sign up user
        const response = await apiPost<{ user: any; token: string }>('/auth/signup', {
          email,
          password,
          full_name: fullName || null,
          username: username || null,
        })

        // Store token
        localStorage.setItem('token', response.token)

        // Trigger a custom event so useAuth can refetch
        window.dispatchEvent(new Event('token-updated'))

        // Small delay to ensure token is stored
        await new Promise(resolve => setTimeout(resolve, 100))

        // After signup, redirect to write page
        router.push(redirectTo)
        router.refresh()
      } else {
        // Sign in
        const response = await apiPost<{ user: any; token: string }>('/auth/signin', {
          email,
          password,
        })

        // Store token
        localStorage.setItem('token', response.token)

        // Trigger a custom event so useAuth can refetch
        window.dispatchEvent(new Event('token-updated'))

        // Small delay to ensure token is stored
        await new Promise(resolve => setTimeout(resolve, 100))

        // After login, redirect to write page (or wherever they came from)
        router.push(redirectTo)
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 mb-3">
            Welcome to Luminary
          </h1>
          <p className="text-xl text-gray-300">
            Share your brilliant ideas with the world
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-200 mb-2">Get Started</h2>
            <p className="text-gray-400 text-sm">
              Create an account or sign in to continue
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 bg-gray-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMode('signin')
                setError(null)
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup')
                setError(null)
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                    placeholder="johndoe"
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none placeholder-gray-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none placeholder-gray-500"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="golden"
              className="w-full py-3 text-lg font-semibold"
              disabled={loading}
            >
              {loading
                ? mode === 'signup'
                  ? 'Creating account...'
                  : 'Signing in...'
                : mode === 'signup'
                  ? 'Sign Up'
                  : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin')
                    setError(null)
                  }}
                  className="text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup')
                    setError(null)
                  }}
                  className="text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

