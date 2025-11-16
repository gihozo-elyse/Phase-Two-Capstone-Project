'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { apiGet } from '@/lib/api-client'

export interface AuthUser {
  id: string
  email: string
  full_name?: string
  username?: string
  avatar_url?: string
  bio?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        setUser(null)
        return
      }

      const response = await apiGet<{ user: AuthUser }>('/auth/me')
      setUser(response.user)
    } catch (error) {
      console.error('Error fetching user:', error)
      // Token might be invalid, remove it
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()

    // Listen for storage changes (when token is set/removed)
    const handleStorageChange = () => {
      fetchUser()
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom storage events (for same-window updates)
    window.addEventListener('token-updated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('token-updated', handleStorageChange)
    }
  }, [fetchUser])

  const signOut = async () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return {
    user,
    profile: user, // For backward compatibility
    loading,
    signOut,
  }
}

