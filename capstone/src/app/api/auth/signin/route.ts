import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/src/app/models/User'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('Signin API: Starting signin request')
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI)
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)
    
    // Connect to database
    try {
      await connectDB()
      console.log('Signin API: Database connected successfully')
    } catch (dbError: any) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please check your MONGODB_URI environment variable.' },
        { status: 500 }
      )
    }

    const { email, password } = await request.json()
    console.log('Signin API: Received email:', email)

    if (!email || !password) {
      console.log('Signin API: Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Signin API: Looking for user with email:', email.toLowerCase().trim())
    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      console.log('Signin API: User not found')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    console.log('Signin API: User found:', user.email)

    // Check password
    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    })

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        avatar_url: user.avatar_url,
        bio: user.bio,
      },
      token,
    })
  } catch (error: any) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

