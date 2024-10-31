import { Router } from 'express';
import {
  createUserWithPosts,
  getUsersWithPosts,
  updateUserWithLock,
  deleteUser,
  getUserWithPosts,
  getTopBloggersWithPosts,
  updateUserWithOptimisticLocking,
} from '../controllers/users.controller';
import { validateDto } from '../../middlewares/validate-dto'; 
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { authorize, jwtAuth } from '../../middlewares/authMiddleware';
import { UserRole } from '../../enums/roles.enum';
import { createUserRules } from '../rules/create-user-rules';
import { validateRules } from '../../middlewares/validate-rules';

const router = Router();

router.post('/withValidationRules', jwtAuth, authorize([UserRole.ADMIN]), validateRules(createUserRules), createUserWithPosts);
router.post('/', jwtAuth, authorize([UserRole.ADMIN]), validateDto(CreateUserDto), createUserWithPosts); 
router.get('/', jwtAuth, validateDto(GetUsersDto), getUsersWithPosts);
router.get('/top-users', jwtAuth, authorize([UserRole.ADMIN]), getTopBloggersWithPosts);
router.get('/:id', getUserWithPosts);
router.patch('/:id', validateDto(UpdateUserDto), updateUserWithLock);
router.patch('/optimisticLock/:id', validateDto(UpdateUserDto), updateUserWithOptimisticLocking);
router.delete('/:id', deleteUser);

export default router;
