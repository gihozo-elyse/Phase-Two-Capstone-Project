import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IComment extends Document {
  content: string
  post: Types.ObjectId
  author: Types.ObjectId
  parent?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
  }
)

CommentSchema.index({ post: 1 })
CommentSchema.index({ author: 1 })

export default mongoose.models.Comment ||
  mongoose.model<IComment>('Comment', CommentSchema)

