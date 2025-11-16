import Link from 'next/link'
import Image from 'next/image'
import { formatRelativeTime } from '@/lib/utils'
import type { Post } from '@/types/database'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const author = post.author
  const authorName = author?.full_name || author?.username || 'Anonymous'

  return (
    <article className="border-b border-gray-800 pb-8">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {author?.avatar_url && (
              <Image
                src={author.avatar_url}
                alt={authorName}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span className="text-sm text-gray-300">{authorName}</span>
            <span className="text-gray-600">·</span>
            <span className="text-sm text-gray-400">
              {formatRelativeTime(post.published_at || post.created_at)}
            </span>
          </div>

          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-2xl font-bold mb-2 text-white hover:text-yellow-500 transition-colors">
              {post.title}
            </h2>
          </Link>

          {post.excerpt && (
            <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {post.tags?.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              {post._count?.likes || 0} likes · {post._count?.comments || 0}{' '}
              comments
            </div>
          </div>
        </div>

        {post.cover_image && (
          <div className="w-32 h-32 relative flex-shrink-0">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
      </div>
    </article>
  )
}

