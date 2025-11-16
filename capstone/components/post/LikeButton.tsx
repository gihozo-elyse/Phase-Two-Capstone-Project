'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiGet, apiPost } from '@/lib/api-client'
import { Heart } from 'lucide-react'

interface LikeButtonProps {
  postId: string
  initialLikeCount: number
}

export default function LikeButton({
  postId,
  initialLikeCount,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      checkLiked()
    }
  }, [user, postId])

  const checkLiked = async () => {
    if (!user) return

    try {
      const data = await apiGet<{ count: number; isLiked: boolean }>(
        `/posts/${postId}/like`
      )
      setLiked(data.isLiked)
      setLikeCount(data.count)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      alert('Please sign in to like posts')
      return
    }

    setLoading(true)

    try {
      const data = await apiPost<{ liked: boolean; count: number }>(
        `/posts/${postId}/like`,
        {}
      )
      setLiked(data.liked)
      setLikeCount(data.count)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading || !user}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
        liked
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
      <span>{likeCount}</span>
    </button>
  )
}

