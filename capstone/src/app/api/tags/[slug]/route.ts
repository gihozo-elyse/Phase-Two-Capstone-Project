import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Tag from '@/models/Tag'
import Post from '@/models/Post'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const tag = await Tag.findOne({ slug: params.slug }).lean()
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    
    const posts = await Post.find({
      tags: tag._id,
      published: true,
    })
      .populate('author', 'full_name username avatar_url email')
      .populate('tags', 'name slug')
      .sort({ published_at: -1 })
      .lean()

    
    const Like = (await import('@/models/Like')).default
    const Comment = (await import('@/models/Comment')).default

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

    return NextResponse.json({
      ...tag,
      id: tag._id.toString(),
      _id: undefined,
      posts: postsWithCounts,
    })
  } catch (error: any) {
    console.error('Get tag error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

