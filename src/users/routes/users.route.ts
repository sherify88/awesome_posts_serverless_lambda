import { Router } from 'express';
import {
  createUserWithPosts,
  getUsersWithPosts,
  updateUserWithLock,
  deleteUser,
  getUserWithPosts,
  getTopBloggersWithPosts,
} from '../controllers/users.controller';
import { validateDto } from '../../middlewares/validate-dto'; // Import your validation middleware
import { CreateUserDto } from '../dto/create-user.dto'; // Import the DTO
import { GetUsersDto } from '../dto/get-users.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { authorize, jwtAuth } from '../../middlewares/authMiddleware';
import { UserRole } from '../../enums/roles.enum';

const router = Router();


router.post('/', jwtAuth, authorize([UserRole.ADMIN]), validateDto(CreateUserDto), createUserWithPosts); // Apply DTO validation middleware
router.get('/', jwtAuth, authorize([UserRole.ADMIN, UserRole.BLOGGER]), validateDto(GetUsersDto), getUsersWithPosts);
router.get('/top-users', jwtAuth, authorize([UserRole.ADMIN]), getTopBloggersWithPosts);
router.get('/:id', getUserWithPosts);
router.patch('/:id', validateDto(UpdateUserDto), updateUserWithLock);
router.delete('/:id', deleteUser);

export default router;
