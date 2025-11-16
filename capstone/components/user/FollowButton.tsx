'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiGet, apiPost } from '@/lib/api-client'
import { Button } from '@/components/ui/Button'

interface FollowButtonProps {
  userId: string
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.id !== userId) {
      checkFollowing()
    }
  }, [user, userId])

  const checkFollowing = async () => {
    if (!user) return

    try {
      const data = await apiGet<{ count: number; isFollowing: boolean }>(
        `/users/${userId}/follow`
      )
      setIsFollowing(data.isFollowing)
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }

  const handleFollow = async () => {
    if (!user) {
      alert('Please sign in to follow users')
      return
    }

    if (user.id === userId) {
      return // Can't follow yourself
    }

    setLoading(true)

    try {
      const data = await apiPost<{ following: boolean; count: number }>(
        `/users/${userId}/follow`,
        {}
      )
      setIsFollowing(data.following)
    } catch (error) {
      console.error('Error toggling follow:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.id === userId) {
    return null
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={isFollowing ? 'outline' : 'default'}
    >
      {loading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}

