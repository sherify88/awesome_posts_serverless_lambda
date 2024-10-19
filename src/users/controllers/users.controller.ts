import { NextFunction, Request, Response } from 'express';
import { Post } from '../../posts/models/post.model';
import { User, UserCreationAttributes } from '../models/user.model';
import sequelize from '../../config/sequelize.config';
import createError from 'http-errors';
import { UserRole } from '../../enums/roles.enum';

// Create a user with posts (Transaction example)
export const createUserWithPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { firstName, lastName, email, password, role, }: UserCreationAttributes = req.body;
  const { posts }: { posts: { title: string; content: string }[] } = req.body; // Separate posts from user attributes

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      await transaction.rollback();
      return next(new createError.Conflict('User already exists'));
    }


    // Create the user inside a transaction
    const newUser = await User.create({ firstName, lastName, email, password, role }, { transaction });

    // If posts are provided, create them after the user is created
    if (posts && posts.length > 0) {
      console.log('01');
      const postPromises = posts.map((post) =>
        Post.create({ title: post.title, content: post.content, userId: newUser.id }, { transaction })
      );
      console.log('02');
      await Promise.all(postPromises);
      console.log('03');
    }
    console.log('04');
    // Commit the transaction
    await transaction.commit();
    res.status(201).json(newUser);
  } catch (error) {
    // Rollback the transaction if something fails
    await transaction.rollback();
    return next(new createError.InternalServerError('Error creating user with posts'));
  }
};

// Get paginated users with posts
export const getUsersWithPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const users = await User.findAndCountAll({
      include: [Post],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      data: users.rows,
      meta: {
        total: users.count,
        page,
        pageCount: Math.ceil(users.count / limit),
      },
    });
  } catch (error) {
    return next(new createError.InternalServerError('Error fetching users with posts'));
  }
};

// Get a user by ID with posts
export const getUserWithPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      include: [Post],
    });

    if (!user) {
      return next(new createError.NotFound('User not found'));
    }

    res.status(200).json(user);
  } catch (error) {
    return next(new createError.InternalServerError(`Error ${error}`));
  }
};



export const getTopBloggersWithPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const topUsers = await User.findAll({
      attributes: {
        include: [
          [
            // Count the number of posts per user, alias as "postCount"
            sequelize.fn('COUNT', sequelize.col('posts.id')),
            'postCount'
          ]
        ]
      },
      include: [
        {
          model: Post,
          attributes: [], // We don't need to include post attributes, only count them
        },
      ],
      where: {
        // Filter by users with the role of 'blogger'
        role: UserRole.BLOGGER,
      },
      having: sequelize.literal('COUNT(posts.id) > 0'),  // Only users with posts
      group: ['User.id'], // Group by User to count posts correctly
      order: [[sequelize.literal('"postCount"'), 'DESC']], // Order by post count in descending order
      limit: 10, // Limit to top 10 users
      subQuery: false, // Prevent unnecessary subqueries
    });

    res.status(200).json(topUsers);
  } catch (error) {
    next(error);  // Pass the error to the error handling middleware
  }
};

// Update user with row locking
export const updateUserWithLock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { firstName, lastName, email, isActive } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { id, },
      lock: {
        level: transaction.LOCK.UPDATE,  // Row-level lock for the current transaction
        of: User,  // Locking the User table
      }, transaction,
    });

    if (!user) {
      await transaction.rollback();
      return next(new createError.NotFound('User not found'));
    }
    console.log(isActive);

    await user.update({ firstName, lastName, email, isActive }, { transaction });
    await transaction.commit();

    res.status(200).json(user);
  } catch (error) {
    await transaction.rollback();
    return next(new createError.InternalServerError('Error updating user'));
  }
};
// Delete a user
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return next(new createError.NotFound('User not found'));
      return;
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    return next(new createError.InternalServerError('Error deleting user'));
  }
};
