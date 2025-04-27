import express from 'express';
import { getPosts, getPostById } from '../controllers/postController.js';

const router = express.Router();

// Route to get all posts
router.get('/', getPosts);

// Route to get a single post by ID
router.get('/:id', getPostById);

export default router;