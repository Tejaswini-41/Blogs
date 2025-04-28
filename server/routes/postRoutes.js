import express from 'express';
import { getPosts, getPostById, addComment } from '../controllers/postController.js';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get all posts
router.get('/', getPosts);

// Route to get by ID
router.get('/:id', getPostById);
router.post('/:id/comments', ensureAuthenticated, addComment);

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