import Post from "../models/Post.js"; 

// Get all posts
export const getPosts = async (req, res) => {
    try {
        // Get posts and sort by createdAt in descending order (newest first)
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .populate('author', 'displayName profileImage');
            
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

// Edit a comment
export const editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to edit a comment' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own comments' });
    }

    // Update the comment
    comment.text = text;
    await post.save();

    // Return the updated post with populated author info
    const updatedPost = await Post.findById(postId)
      .populate('author', 'displayName profileImage')
      .populate('comments.author', 'displayName profileImage');

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error editing comment', error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to delete a comment' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    // Remove the comment
    comment.deleteOne();
    await post.save();

    // Return the updated post with populated author info
    const updatedPost = await Post.findById(postId)
      .populate('author', 'displayName profileImage')
      .populate('comments.author', 'displayName profileImage');

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, imageUrl } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Create new post with optional image URL
    const newPost = new Post({
      title,
      content,
      imageUrl, // Add the image URL if provided
      author: req.user._id,
      comments: []
    });

    await newPost.save();
    
    const populatedPost = await Post.findById(newPost._id)
      .populate('author', 'displayName profileImage');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};