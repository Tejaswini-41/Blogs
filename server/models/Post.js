import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = Schema(
  {
    text: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
  },
  { timestamps: true }
);

const postSchema = Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String }, // image URL field
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comments: [commentSchema],
    upvotes: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }]
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;