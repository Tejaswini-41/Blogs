import mongoose from 'mongoose';

const commentSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: String, required: true },
  },
  { timestamps: true }
);

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [commentSchema], //comments
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;