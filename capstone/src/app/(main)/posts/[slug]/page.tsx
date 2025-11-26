import { notFound } from 'next/navigation'
import PostContent from '@/components/post/PostContent'
import CommentsSection from '@/components/post/CommentsSection'
import LikeButton from '@/components/post/LikeButton'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'

async function getPost(slug: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const res = await fetch(`${baseUrl}/api/posts/by-slug/${slug}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || 'Read this post on Medium Clone',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.cover_image ? [post.cover_image] : [],
    },
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const author = post.author
  const authorName = author?.full_name || author?.username || 'Anonymous'
  const likeCount = post._count?.likes || 0

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-4 mb-6">
          {author?.avatar_url && (
            <Image
              src={author.avatar_url}
              alt={authorName}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <div className="font-medium">{authorName}</div>
            <div className="text-sm text-gray-500">
              {formatDate(post.published_at || post.createdAt)}
            </div>
          </div>
        </div>

        {post.cover_image && (
          <div className="relative w-full h-96 mb-8">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex items-center gap-4 mb-8">
          <LikeButton postId={post.id} initialLikeCount={likeCount} />
          <div className="flex gap-2 flex-wrap">
            {post.tags?.map((tag: any) => (
              <a
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
              >
                #{tag.name}
              </a>
            ))}
          </div>
        </div>
      </header>

      <PostContent content={post.content} />

      <div className="mt-12">
        <CommentsSection postId={post.id} />
      </div>
    </article>
  )
}

