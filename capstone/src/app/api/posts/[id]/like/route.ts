import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Like from '@/src/app/models/Like'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

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

    const existingLike = await Like.findOne({
      post: params.id,
      user: payload.userId,
    })

    if (existingLike) {
      // Unlike
      await Like.deleteOne({ _id: existingLike._id })
      const count = await Like.countDocuments({ post: params.id })
      return NextResponse.json({ liked: false, count })
    } else {
      // Like
      await Like.create({
        post: params.id,
        user: payload.userId,
      })
      const count = await Like.countDocuments({ post: params.id })
      return NextResponse.json({ liked: true, count })
    }
  } catch (error: any) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const token = getTokenFromRequest(request.headers)
    const userId = token ? verifyToken(token)?.userId : null

    const count = await Like.countDocuments({ post: params.id })
    const isLiked = userId
      ? !!(await Like.findOne({ post: params.id, user: userId }))
      : false

    return NextResponse.json({ count, isLiked })
  } catch (error: any) {
    console.error('Get likes error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

