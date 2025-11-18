import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  content: string
  excerpt?: string
  cover_image?: string
  author: Types.ObjectId
  published: boolean
  published_at?: Date
  tags: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,  // Added index here instead of separate index call
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    cover_image: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    published_at: {
      type: Date,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Indexes
PostSchema.index({ author: 1 })
PostSchema.index({ published: 1, published_at: -1 })  // For sorting published posts

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)

