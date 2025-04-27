import Post from "../models/Post.js"; 

// const posts = [
//   { id: 1, title: 'First Blog Post', content: 'This is the first post.' },
//   { id: 2, title: 'Second Blog Post', content: 'This is the second post.' },
// ];

// const comments = {
//   1: [
//     { id: 1, text: 'Great post!', author: 'tejuu' },
//     { id: 2, text: 'Very informative.', author: 'arya' },
//   ],
//   2: [
//     { id: 3, text: 'Thanks for sharing!', author: 'Charlie' },
//   ],
// };

// Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Fetch the post by ID from MongoDB
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};