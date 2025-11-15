import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import Like from '@/models/Like'
import Comment from '@/models/Comment'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const post = await Post.findOne({ slug: params.slug, published: true })
      .populate('author', 'full_name username avatar_url bio email')
      .populate('tags', 'name slug')
      .lean()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const [likeCount, commentCount] = await Promise.all([
      Like.countDocuments({ post: post._id }),
      Comment.countDocuments({ post: post._id }),
    ])

    return NextResponse.json({
      ...post,
      id: post._id.toString(),
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
    })
  } catch (error: any) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

