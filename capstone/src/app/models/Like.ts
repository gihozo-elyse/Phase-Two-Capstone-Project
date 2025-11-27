import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ILike extends Document {
  post: Types.ObjectId
  user: Types.ObjectId
  createdAt: Date
}

const LikeSchema = new Schema<ILike>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

LikeSchema.index({ post: 1, user: 1 }, { unique: true })

export default mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema)

