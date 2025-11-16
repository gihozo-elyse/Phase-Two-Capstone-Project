import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Comment from '@/models/Comment'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const comments = await Comment.find({ post: params.id, parent: null })
      .populate('author', 'full_name username avatar_url')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(
      comments.map((comment: any) => ({
        ...comment,
        id: comment._id.toString(),
        post_id: comment.post.toString(),
        author_id: comment.author._id.toString(),
        author: {
          id: comment.author._id.toString(),
          ...comment.author,
          _id: undefined,
        },
        parent_id: comment.parent?.toString() || null,
      }))
    )
  } catch (error: any) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { content, parent_id } = await request.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const comment = await Comment.create({
      content: content.trim(),
      post: params.id,
      author: payload.userId,
      parent: parent_id || null,
    })

    await comment.populate('author', 'full_name username avatar_url')

    return NextResponse.json(
      {
        ...comment.toObject(),
        id: comment._id.toString(),
        post_id: comment.post.toString(),
        author_id: comment.author._id.toString(),
        author: {
          id: comment.author._id.toString(),
          ...comment.author,
          _id: undefined,
        },
        parent_id: comment.parent?.toString() || null,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

