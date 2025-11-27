import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Follow from '@/src/app/models/Follow'
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

    const followerId = payload.userId
    const followingId = params.id

    if (followerId === followingId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    })

    if (existingFollow) {
      // Unfollow
      await Follow.deleteOne({ _id: existingFollow._id })
      const count = await Follow.countDocuments({ following: followingId })
      return NextResponse.json({ following: false, count })
    } else {
      // Follow
      await Follow.create({
        follower: followerId,
        following: followingId,
      })
      const count = await Follow.countDocuments({ following: followingId })
      return NextResponse.json({ following: true, count })
    }
  } catch (error: any) {
    console.error('Follow error:', error)
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

    const count = await Follow.countDocuments({ following: params.id })
    const isFollowing = userId
      ? !!(await Follow.findOne({ follower: userId, following: params.id }))
      : false

    return NextResponse.json({ count, isFollowing })
  } catch (error: any) {
    console.error('Get follow status error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

