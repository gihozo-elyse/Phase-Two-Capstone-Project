import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    try {
      await connectDB()
    } catch (dbError: any) {
      console.error('Database connection error:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed. Please check your MONGODB_URI environment variable.' },
        { status: 500 }
      )
    }

    const { email, password, full_name, username } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Normalize email and username
    const normalizedEmail = email.toLowerCase().trim()
    const normalizedUsername = username ? username.toLowerCase().trim() : null

    // Check if user exists
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Check username if provided
    if (normalizedUsername) {
      const existingUsername = await User.findOne({ username: normalizedUsername })
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      full_name: full_name || null,
      username: normalizedUsername,
    })

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    })

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          email: user.email,
          full_name: user.full_name,
          username: user.username,
        },
        token,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

