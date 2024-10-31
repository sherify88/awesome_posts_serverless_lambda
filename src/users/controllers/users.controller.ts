import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/users.services';
import { GetUsersDto } from '../dto/get-users.dto';

export const createUserWithPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newUser = await userService.createUserWithPostsAndGroups(req.body);  
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const getUsersWithPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto= req.query as unknown as GetUsersDto;
    const users = await userService.getUsersWithPostsAndGroups(dto);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserWithPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getUserWithPosts(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getTopBloggersWithPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const topUsers = await userService.getTopBloggersWithPosts();
    res.status(200).json(topUsers);
  } catch (error) {
    next(error);
  }
};

export const updateUserWithLock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateUserWithLock(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserWithOptimisticLocking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.updateUserWithOptimisticLocking(req.params.id, req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
