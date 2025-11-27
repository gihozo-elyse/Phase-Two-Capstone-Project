import { notFound } from 'next/navigation'
import PostCard from '@/components/post/PostCard'

async function getTag(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/tags/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching tag:', error)
    return null
  }
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await getTag(params.slug)

  if (!tag) {
    notFound()
  }

  const posts = tag.posts || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">#{tag.name}</h1>
          <p className="text-gray-600">
            {posts?.length || 0} {posts?.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        <div className="space-y-8">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))
          ) : (
            <p className="text-gray-500">No posts found for this tag.</p>
          )}
        </div>
      </div>
    </div>
  )
}

