import express from 'express';
import { 
  getPosts, 
  getPostById, 
  addComment, 
  editComment, 
  deleteComment,
  createPost,
  updatePost,
  deletePost,
  toggleUpvote // Add this import
} from '../controllers/postController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get posts
router.get('/', getPosts);
router.get('/:id', getPostById);

// Comment routes
router.post('/:id/comments', ensureAuthenticated, addComment);
router.put('/:postId/comments/:commentId', ensureAuthenticated, editComment);
router.delete('/:postId/comments/:commentId', ensureAuthenticated, deleteComment);

// Post CRUD routes
router.post('/', ensureAuthenticated, createPost);
router.put('/:id', ensureAuthenticated, updatePost);
router.delete('/:id', ensureAuthenticated, deletePost);

// Upvote route
router.post('/:id/upvote', ensureAuthenticated, toggleUpvote);

export default router;