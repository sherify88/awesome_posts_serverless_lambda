import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { User } from '../../users/models/user.model';
import { Post } from '../models/post.model';

// Create a post for a user
export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId, title, content } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      // Throw a NotFound error if user is not found
      return next(new createError.NotFound('User not found'));
    }

    const newPost = await Post.create({ title, content, userId });
    res.status(201).json(newPost);
  } catch (error) {
    // Forward the error to the error handler
    return next(new createError.InternalServerError('Error creating post'));
  }
};

// Get all posts for a specific user
export const getPostsForUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userId } = req.params;

  try {
    const posts = await Post.findAll({ where: { userId } });
    res.status(200).json(posts);
  } catch (error) {
    // Forward the error to the error handler
    return next(new createError.InternalServerError('Error fetching posts for user'));
  }
};

// Update a post
export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      // Throw a NotFound error if post is not found
      return next(new createError.NotFound('Post not found'));
    }

    await post.update({ title, content });
    res.status(200).json(post);
  } catch (error) {
    // Forward the error to the error handler
    return next(new createError.InternalServerError('Error updating post'));
  }
};

// Delete a post
export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      // Throw a NotFound error if post is not found
      return next(new createError.NotFound('Post not found'));
    }

    await post.destroy();
    res.status(204).send();
  } catch (error) {
    // Forward the error to the error handler
    return next(new createError.InternalServerError('Error deleting post'));
  }
};
