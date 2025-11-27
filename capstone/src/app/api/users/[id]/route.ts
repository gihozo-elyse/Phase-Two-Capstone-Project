import { NextRequest, NextResponse } from 'next/server'
import { Document, Types } from 'mongoose'
import connectDB from '@/lib/mongodb'
import User from '../../../models/User'
import Post from '../../../models/Post'
import Follow from '../../../models/Follow'

interface UserType extends Document {
  _id: Types.ObjectId
  [key: string]: any
}

interface TagType {
  _id: Types.ObjectId
  name: string
  slug: string
}

interface PostType {
  _id: Types.ObjectId
  tags: TagType[]
  [key: string]: any
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const user = await User.findById(params.id).select('-password').lean() as UserType | null
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    
    const posts = (await Post.find({ author: params.id, published: true })
      .populate('tags', 'name slug')
      .sort({ published_at: -1 })
      .lean()) as unknown as PostType[]

    
    const [followersCount, followingCount] = await Promise.all([
      Follow.countDocuments({ following: params.id }),
      Follow.countDocuments({ follower: params.id }),
    ])

    
    const Like = (await import('../../../models/Like')).default
    const Comment = (await import('../../../models/Comment')).default

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
          author_id: post.author.toString(),
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
      ...user,
      id: user._id.toString(),
      _id: undefined,
      posts: postsWithCounts,
      _count: {
        followers: followersCount,
        following: followingCount,
      },
    })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

