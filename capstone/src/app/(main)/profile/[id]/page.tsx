import { notFound } from 'next/navigation'
import PostCard from '@/components/post/PostCard'
import FollowButton from '@/components/user/FollowButton'
import Image from 'next/image'

async function getProfile(id: string) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const profile = await getProfile(params.id)

  if (!profile) {
    notFound()
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
              <FollowButton userId={params.id} />
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
              <p className="text-gray-500">No posts yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

