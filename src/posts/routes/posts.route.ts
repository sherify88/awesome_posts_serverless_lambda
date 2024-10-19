import { Router } from 'express';
import {
  createPost,
  getPostsForUser,
  updatePost,
  deletePost
} from '../controllers/posts.controller';
import { validateDto } from '../../middlewares/validate-dto'; // Import the validation middleware
import { CreatePostDto } from '../dto/create-post.dto'; // Import the DTO for post creation

const router = Router();

// Apply DTO validation to the create post route
router.post('/', validateDto(CreatePostDto), createPost); // Create a post for a user
router.get('/user/:userId', getPostsForUser); // Get all posts for a specific user
router.patch('/:id', updatePost); // Update a post
router.delete('/:id', deletePost); // Delete a post

export default router;
