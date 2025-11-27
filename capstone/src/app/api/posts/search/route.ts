import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0
import connectDB from '@/lib/mongodb'
import Post from '@/src/app/models/Post'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json([])
    }

    
    const posts = await Post.find({
      published: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('author', 'full_name username avatar_url email')
      .populate('tags', 'name slug')
      .sort({ published_at: -1 })
      .limit(20)
      .lean()

    
    const Like = (await import('@/src/app/models/Like')).default
    const Comment = (await import('@/src/app/models/Comment')).default

    const postsWithCounts = await Promise.all(
      posts.map(async (post: any) => {
        const [likeCount, commentCount] = await Promise.all([
          Like.countDocuments({ post: post._id }),
          Comment.countDocuments({ post: post._id }),
        ])

        return {
          ...post,
          id: post._id.toString(),
          _id: undefined,
          author_id: post.author._id.toString(),
          author: {
            id: post.author._id.toString(),
            ...post.author,
            _id: undefined,
          },
          tags: post.tags.map((tag: any) => ({
            id: tag._id.toString(),
            name: tag.name,
            slug: tag.slug,
          })),
          _count: {
            likes: likeCount,
            comments: commentCount,
          },
        }
      })
    )

    return NextResponse.json(postsWithCounts)
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

