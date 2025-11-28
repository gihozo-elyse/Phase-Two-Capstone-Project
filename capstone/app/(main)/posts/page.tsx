'use client'

import { useState, useEffect } from 'react'
import PostCard from '@/components/post/PostCard';

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts?published=true&limit=20')
        if (res.ok) {
          const data = await res.json()
          setPosts(data)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">
            Explore Stories
          </h1>

          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Loading posts...</p>
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No posts yet. Be the first to write something!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
