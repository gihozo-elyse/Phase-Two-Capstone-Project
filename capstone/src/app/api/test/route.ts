import { NextResponse } from 'next/server'

export async function GET() {
  console.log('TEST API: This is a test log message')
  console.log('TEST API: Environment check - MONGODB_URI exists:', !!process.env.MONGODB_URI)
  
  return NextResponse.json({ 
    message: 'Test API working',
    mongodbExists: !!process.env.MONGODB_URI,
    timestamp: new Date().toISOString()
  })
}