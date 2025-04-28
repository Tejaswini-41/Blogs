import express from 'express';
import { getPosts, getPostById, addComment, editComment, deleteComment } from '../controllers/postController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get posts
router.get('/', getPosts);
router.get('/:id', getPostById);

// Comment routes
router.post('/:id/comments', ensureAuthenticated, addComment);
router.put('/:postId/comments/:commentId', ensureAuthenticated, editComment);
router.delete('/:postId/comments/:commentId', ensureAuthenticated, deleteComment);

// Protected routes
router.post('/', ensureAuthenticated, (req, res) => {
    // Logic to create a new post
  });
  
router.put('/:id', ensureAuthenticated, (req, res) => {
  // Logic to update a post
});
  
router.delete('/:id', ensureAuthenticated, (req, res) => {
  // Logic to delete a post
});

export default router;