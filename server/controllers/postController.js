import mongoose from 'mongoose';
import Post from "../models/Post.js"; 

// Get all posts with comment counts using aggregation
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
      // Joins the post document with user document based on author ID
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      { $unwind: "$authorDetails" },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          imageUrl: 1,
          createdAt: 1,
          updatedAt: 1,
          commentCount: { $size: "$comments" },
          upvotes: 1, // Include upvotes array
          author: {
            _id: "$authorDetails._id",
            displayName: "$authorDetails.displayName",
            profileImage: "$authorDetails.profileImage"
          }
        }
      }
    ]);
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get a single post by ID using aggregation pipeline
export const getPostById = async (req, res) => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.id);
    
    const result = await Post.aggregate([
      {
        // Similar to a WHERE clause in SQL
        $match: { _id: postId }
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails"
        }
      },
      { $unwind: "$authorDetails" },
      {
        $addFields: {
          "comments": {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                text: "$$comment.text",
                createdAt: "$$comment.createdAt",
                updatedAt: "$$comment.updatedAt",
                author: "$$comment.author"
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.author",
          foreignField: "_id",
          as: "commentAuthors"
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          imageUrl: 1,
          createdAt: 1,
          updatedAt: 1,
          upvotes: 1, // Include upvotes array
          author: {
            _id: "$authorDetails._id",
            displayName: "$authorDetails.displayName",
            profileImage: "$authorDetails.profileImage"
          },
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                text: "$$comment.text",
                createdAt: "$$comment.createdAt",
                updatedAt: "$$comment.updatedAt",
                author: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$commentAuthors",
                        cond: { $eq: ["$$this._id", "$$comment.author"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      }
    ]);
    
    if (!result.length) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    // extracted id and text from request body
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

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;
    
    // Find the post
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own posts' });
    }
    
    // Update post fields
    post.title = title || post.title;
    post.content = content || post.content;
    
    // Only update imageUrl if it's provided
    if (imageUrl !== undefined) {
      post.imageUrl = imageUrl;
    }
    
    await post.save();
    
    const updatedPost = await Post.findById(id)
      .populate('author', 'displayName profileImage')
      .populate('comments.author', 'displayName profileImage');
    
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the post
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }
    
    // Delete the post
    await Post.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Post deleted successfully', postId: id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Toggle upvote on a post
export const toggleUpvote = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'You must be logged in to upvote' });
    }

    const { id } = req.params;
    const userId = req.user._id;
    
    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user has already upvoted
    const upvoteIndex = post.upvotes.indexOf(userId);
    
    if (upvoteIndex === -1) {
      // User hasn't upvoted yet, add upvote
      post.upvotes.push(userId);
    } else {
      // User already upvoted, remove upvote
      post.upvotes.splice(upvoteIndex, 1);
    }
    
    await post.save();
    
    res.status(200).json({ 
      postId: post._id, 
      upvotes: post.upvotes, 
      upvoteCount: post.upvotes.length,
      userUpvoted: upvoteIndex === -1 // true if the user just upvoted, false if removed
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling upvote', error: error.message });
  }
};