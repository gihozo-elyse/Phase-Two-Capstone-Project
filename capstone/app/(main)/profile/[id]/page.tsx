'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PostCard from '@/components/post/PostCard'
import FollowButton from '@/components/user/FollowButton'
import Image from 'next/image'

export default function ProfilePage() {
  const params = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) {
      fetchProfile()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400">The profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const posts = profile.posts || []
  const followersCount = profile._count?.followers || 0
  const followingCount = profile._count?.following || 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            {profile.avatar_url && (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || 'Profile'}
                width={120}
                height={120}
                className="rounded-full"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {profile.full_name || profile.username || 'Anonymous'}
              </h1>
              {profile.bio && (
                <p className="text-gray-600 mb-4">{profile.bio}</p>
              )}
              <div className="flex items-center gap-6 mb-4">
                <div>
                  <span className="font-semibold">{followersCount || 0}</span>{' '}
                  <span className="text-gray-600">Followers</span>
                </div>
                <div>
                  <span className="font-semibold">{followingCount || 0}</span>{' '}
                  <span className="text-gray-600">Following</span>
                </div>
              </div>
              <FollowButton userId={params.id as string} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Published Posts</h2>
          <div className="space-y-8">
            {posts && posts.length > 0 ? (
              posts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))
            ) : (
              <p className="text-gray-500">No posts yet!!!!!!.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

