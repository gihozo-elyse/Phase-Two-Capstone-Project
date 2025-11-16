import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e: any) {
    cached.promise = null
    // Provide more helpful error messages
    if (e.message?.includes('authentication failed')) {
      throw new Error('MongoDB authentication failed. Please check your username and password in MONGODB_URI.')
    } else if (e.message?.includes('ENOTFOUND') || e.message?.includes('getaddrinfo')) {
      throw new Error('Cannot reach MongoDB server. Please check your connection string and network access settings.')
    } else if (e.message?.includes('IP not whitelisted')) {
      throw new Error('Your IP address is not whitelisted in MongoDB Atlas. Please add your IP in Network Access settings.')
    } else {
      throw new Error(`MongoDB connection failed: ${e.message || 'Unknown error'}. Please check your MONGODB_URI environment variable.`)
    }
  }

  return cached.conn
}

export default connectDB

