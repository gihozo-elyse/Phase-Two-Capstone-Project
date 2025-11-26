'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { apiGet, apiPut } from '@/lib/api-client'
import { Button } from '@/components/ui/Button'

interface DraftPost {
  id: string
  title: string
  excerpt?: string
  updatedAt?: string
  createdAt?: string
  slug: string
}

export default function DraftsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [drafts, setDrafts] = useState<DraftPost[]>([])
  const [loadingDrafts, setLoadingDrafts] = useState(true)
  const [publishingId, setPublishingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth?mode=signin&redirect=/drafts')
    }
  }, [loading, user, router])

  useEffect(() => {
    async function fetchDrafts() {
      if (!user) return
      try {
        setLoadingDrafts(true)
        const data = await apiGet<DraftPost[]>(
          `/posts?published=false&author=${user.id}`
        )
        setDrafts(data)
      } catch (error) {
        console.error('Failed to load drafts', error)
      } finally {
        setLoadingDrafts(false)
      }
    }

    if (user) {
      fetchDrafts()
    }
  }, [user])

  const handlePublish = async (id: string) => {
    try {
      setPublishingId(id)
      const updated = await apiPut<DraftPost & { slug: string }>(
        `/posts/${id}`,
        { published: true }
      )
      setDrafts((prev) => prev.filter((draft) => draft.id !== id))
      router.push(`/posts/${updated.slug}`)
    } catch (error) {
      console.error('Failed to publish draft', error)
      alert('Failed to publish draft: ' + (error as Error).message)
    } finally {
      setPublishingId(null)
    }
  }

  if (loading || (loadingDrafts && drafts.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8 text-white">Loading...</div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Your Drafts</h1>
            <p className="text-gray-400 text-sm">
              Save ideas and publish when they are ready.
            </p>
          </div>
          <Button variant="golden" onClick={() => router.push('/write')}>
            Start Writing
          </Button>
        </div>

        {drafts.length === 0 ? (
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 text-center text-gray-400">
            <p>No drafts yet. Save a draft from the write screen to see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {draft.title || 'Untitled draft'}
                  </h2>
                  {draft.excerpt && (
                    <p className="text-gray-400 mt-1 line-clamp-2">
                      {draft.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated{' '}
                    {draft.updatedAt
                      ? formatDistanceToNow(new Date(draft.updatedAt), {
                          addSuffix: true,
                        })
                      : 'recently'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/write?draft=${draft.id}`}
                    className="inline-flex items-center justify-center rounded-lg border-2 border-yellow-500 bg-transparent text-yellow-500 hover:bg-yellow-500/10 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black px-4 py-3 font-medium"
                  >
                    Continue Editing
                  </Link>
                  <Button
                    variant="golden"
                    onClick={() => handlePublish(draft.id)}
                    disabled={publishingId === draft.id}
                  >
                    {publishingId === draft.id ? 'Publishing...' : 'Publish'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

