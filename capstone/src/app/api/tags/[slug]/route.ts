import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Tag from '@/models/Tag'
import Post from '@/models/Post'
import { Types } from 'mongoose'

interface TagLean {
  _id: Types.ObjectId
  name: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

interface AuthorLean {
  _id: Types.ObjectId
  full_name?: string
  username?: string
  avatar_url?: string
  email?: string
}

interface PostLean {
  _id: Types.ObjectId
  title: string
  slug: string
  content: string
  excerpt?: string | null
  cover_image?: string | null
  author: AuthorLean
  tags: { _id: Types.ObjectId; name: string; slug: string }[]
  published: boolean
  published_at?: Date | null
  created_at: Date
  updated_at: Date
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()

    const tag = await Tag.findOne({ slug: params.slug }).lean<TagLean>()
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    const posts = await Post.find({ tags: tag._id, published: true })
      .populate('author', 'full_name username avatar_url email')
      .populate('tags', 'name slug')
      .sort({ published_at: -1 })
      .lean<PostLean[]>()

    const Like = (await import('@/models/Like')).default
    const Comment = (await import('@/models/Comment')).default

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
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
          tags: post.tags.map((tag) => ({
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
