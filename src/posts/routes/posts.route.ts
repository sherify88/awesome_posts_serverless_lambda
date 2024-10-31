import { Router } from 'express';
import {
  createPost,
  getPostsForUser,
  updatePost,
  deletePost
} from '../controllers/posts.controller';
import { validateDto } from '../../middlewares/validate-dto'; 
import { CreatePostDto } from '../dto/create-post.dto';

const router = Router();

router.post('/', validateDto(CreatePostDto), createPost); 
router.get('/user/:userId', getPostsForUser); 
router.patch('/:id', updatePost); 
router.delete('/:id', deletePost); 

export default router;
