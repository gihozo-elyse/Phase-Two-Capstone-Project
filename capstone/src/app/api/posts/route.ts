import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import Tag from '@/models/Tag'
import User from '@/models/User'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('API: Starting posts fetch')
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    
    await connectDB()
    console.log('API: Database connected')

    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') !== 'false'
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = parseInt(searchParams.get('skip') || '0')

    const query: any = {}
    if (published) {
      query.published = true
    }

    const totalPosts = await Post.countDocuments({})
    const publishedPosts = await Post.countDocuments({ published: true })
    console.log('API: Total posts in DB:', totalPosts)
    console.log('API: Published posts in DB:', publishedPosts)
    console.log('API: Querying posts with:', query)
    const posts = await Post.find(query)
      .populate('author', 'full_name username avatar_url email')
      .populate('tags', 'name slug')
      .sort({ published_at: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    console.log('API: Found posts:', posts.length)
    console.log('API: Sample post:', posts[0] ? { id: posts[0]._id, title: posts[0].title, published: posts[0].published } : 'No posts')

    // Get like and comment counts
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

    console.log('API: Returning posts:', postsWithCounts.length)
    return NextResponse.json(postsWithCounts)
  } catch (error: any) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request.headers)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await request.json()
    const { title, content, excerpt, cover_image, tags, published } = data

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    let baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    let slug = baseSlug
    let counter = 1
    
    // Check if slug exists and make it unique
    while (await Post.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Handle tags
    const tagIds = []
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tagSlug = tagName.toLowerCase().trim().replace(/[^\w\s-]/g, '-')
        let tag = await Tag.findOne({ slug: tagSlug })
        if (!tag) {
          tag = await Tag.create({ name: tagName, slug: tagSlug })
        }
        tagIds.push(tag._id)
      }
    }

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      cover_image,
      author: payload.userId,
      published: published || false,
      published_at: published ? new Date() : null,
      tags: tagIds,
    })

    await post.populate('author', 'full_name username avatar_url')
    await post.populate('tags', 'name slug')

    return NextResponse.json(
      {
        ...post.toObject(),
        id: post._id.toString(),
        author_id: post.author._id.toString(),
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

