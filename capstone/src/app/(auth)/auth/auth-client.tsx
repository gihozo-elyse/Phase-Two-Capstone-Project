'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiPost } from '@/lib/api-client'
import { Button } from '@/components/ui/Button'

interface AuthResponse {
  user: {
    id: string
    email: string
    full_name?: string
    username?: string
    avatar_url?: string
    bio?: string
  }
  token: string
}

export default function AuthPageClient() {
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

  useEffect(() => {
    const urlMode = searchParams.get('mode')
    if (urlMode) setMode(urlMode as 'signin' | 'signup')
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let response: AuthResponse

      if (mode === 'signup') {
        response = await apiPost<AuthResponse>('/auth/signup', {
          email,
          password,
          full_name: fullName || null,
          username: username || null,
        })
      } else {
        response = await apiPost<AuthResponse>('/auth/signin', { email, password })
      }

      
      if (response?.token) {
        localStorage.setItem('token', response.token)
        window.dispatchEvent(new Event('token-updated'))
        router.push(redirectTo)
      } else {
        setError('Invalid response from server')
      }
    } catch (err: any) {
      
      if (err?.error) setError(err.error)
      else if (err?.message) setError(err.message)
      else setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <h2 className="text-3xl text-gray-200 font-bold mb-4">
          {mode === 'signup' ? 'Sign Up' : 'Sign In'}
        </h2>
        {error && (
          <div className="text-red-400 bg-red-500/10 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white outline-none"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white outline-none"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
          />
          <Button
            type="submit"
            variant="golden"
            className="w-full py-3"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        <p className="text-gray-400 mt-4 text-center text-sm">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-yellow-500 font-medium"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-yellow-500 font-medium"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
