import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import Tag from '@/models/Tag'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
import { isValidObjectId } from 'mongoose'

async function serializePost(post: any) {
  const Like = (await import('@/models/Like')).default
  const Comment = (await import('@/models/Comment')).default

  const [likeCount, commentCount] = await Promise.all([
    Like.countDocuments({ post: post._id }),
    Comment.countDocuments({ post: post._id }),
  ])

  return {
    ...post,
    id: post._id.toString(),
    _id: undefined,
    author_id: post.author._id?.toString?.() || post.author.toString(),
    author:
      typeof post.author === 'object'
        ? {
            ...post.author,
            id: post.author._id?.toString?.(),
            _id: undefined,
          }
        : undefined,
    tags: post.tags?.map((tag: any) => ({
      id: tag._id.toString(),
      name: tag.name,
      slug: tag.slug,
    })),
    _count: {
      likes: likeCount,
      comments: commentCount,
    },
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })
    }

    await connectDB()

    const post = await Post.findById(params.id)
      .populate('author', 'full_name username avatar_url email')
      .populate('tags', 'name slug')
      .lean()

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const serialized = await serializePost(post)
    return NextResponse.json(serialized)
  } catch (error: any) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: 'Invalid post id' }, { status: 400 })
    }

    await connectDB()

    const token = getTokenFromRequest(request.headers)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const post = await Post.findById(params.id)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.author.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, excerpt, cover_image, tags, published } = body

    if (title !== undefined) post.title = title
    if (content !== undefined) post.content = content
    if (excerpt !== undefined) post.excerpt = excerpt
    if (cover_image !== undefined) post.cover_image = cover_image

    if (Array.isArray(tags)) {
      const tagIds = []
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().trim().replace(/[^\w\s-]/g, '-')
        let tag = await Tag.findOne({ slug: tagSlug })
        if (!tag) {
          tag = await Tag.create({ name: tagName, slug: tagSlug })
        }
        tagIds.push(tag._id)
      }
      post.tags = tagIds
    }

    if (typeof published === 'boolean') {
      post.published = published
      post.published_at = published ? new Date() : null
    }

    await post.save()
    await post.populate('author', 'full_name username avatar_url email')
    await post.populate('tags', 'name slug')

    const serialized = await serializePost(post.toObject())
    return NextResponse.json(serialized)
  } catch (error: any) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

