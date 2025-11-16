'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { apiGet, apiPost } from '@/lib/api-client'
import { Button } from '@/components/ui/Button'
import { formatRelativeTime } from '@/lib/utils'
import Image from 'next/image'

interface Comment {
  id: string
  content: string
  post_id: string
  author_id: string
  author: {
    id: string
    full_name?: string
    username?: string
    avatar_url?: string
  }
  created_at: string
}

interface CommentsSectionProps {
  postId: string
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [content, setContent] = useState('')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const data = await apiGet<Comment[]>(`/posts/${postId}/comments`)
      return data
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: async (commentContent: string) => {
      if (!user) throw new Error('Must be logged in')

      const data = await apiPost<Comment>(`/posts/${postId}/comments`, {
        content: commentContent,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setContent('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return
    addCommentMutation.mutate(content)
  }

  if (isLoading) {
    return <div className="mt-8">Loading comments...</div>
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
          />
          <Button type="submit" disabled={!content.trim() || addCommentMutation.isPending}>
            {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <p className="mb-8 text-gray-600">
          <a href="/login" className="text-green-600 hover:underline">
            Sign in
          </a>{' '}
          to leave a comment
        </p>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              <div className="flex gap-3">
                {comment.author?.avatar_url && (
                  <Image
                    src={comment.author.avatar_url}
                    alt={comment.author.full_name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {comment.author?.full_name || comment.author?.username || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

