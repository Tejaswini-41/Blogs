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
    const post = await Post.findById(req.params.id)
      .populate('author', 'displayName profileImage')  
      .populate('comments.author', 'displayName profileImage');
      
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the post and populate the author and comments.author fields
    const post = await Post.findById(id)
      .populate('author', 'displayName profileImage') // Populate post author
      .populate('comments.author', 'displayName profileImage'); // Populate comment authors

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to comment' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add comment to post
    post.comments.push({
      text,
      author: req.user._id,
    });

    await post.save();

    // Return the updated post with populated author info
    const updatedPost = await Post.findById(id)
      .populate('author', 'displayName profileImage')
      .populate('comments.author', 'displayName profileImage'); // Populate author in comments

    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};