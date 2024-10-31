import { Post } from '../../posts/models/post.model';
import { User, UserCreationAttributes } from '../models/user.model';
import sequelize from '../../config/sequelize.config';
import { OptimisticLockError, Transaction } from 'sequelize';
import { UserRole } from '../../enums/roles.enum';
import createError from 'http-errors';
import { CreateUserDto } from '../dto/create-user.dto';
import { GetUsersDto } from '../dto/get-users.dto';
import { Group } from '../../groups/models/group.model';


export const createUserWithPostsAndGroups = async (dto: CreateUserDto) => {
  const { posts = [], groups = [] } = dto;
  const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ });

  try {
    console.log({ posts, groups, dto });

    const existingUser = await User.findOne({ where: { email: dto.email }, transaction });
    if (existingUser) {
      throw new createError.Conflict('User already exists');
    }

    const newUser = await User.create(dto, { transaction });

    if (posts.length > 0) {
      const postPromises = posts.map((post) =>
        Post.create({ title: post.title, content: post.content, userId: newUser.id }, { transaction })
      );
      await Promise.all(postPromises);
    }

    if (groups.length > 0) {
      const groupPromises = groups.map(async (group) => {
        const [createdGroup] = await Group.findOrCreate({
          where: { name: group.name },
          defaults: { name: group.name },
          transaction,
        });
        return createdGroup;
      });

      const createdGroups = await Promise.all(groupPromises);
      await newUser.addGroups(createdGroups, { transaction });
    }

    await transaction.commit();
    return newUser;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
export const getUsersWithPostsAndGroups = async (pagination: GetUsersDto) => {
  const { limit, page } = pagination;
  const offset = (page??1 - 1) * (limit??10);

  return User.findAndCountAll({
    include: [Post, Group],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
};

export const getUserWithPosts = async (id: string) => {
  const user = await User.findByPk(id, { include: [Post] });
  if (!user) {
    throw new createError.NotFound('User not found');
  }
  return user;
};

export const getTopBloggersWithPosts = async () => {
  return User.findAll({
    attributes: {
      include: [[sequelize.fn('COUNT', sequelize.col('posts.id')), 'postCount']],
    },
    include: [{ model: Post, attributes: [] }],
    where: { role: UserRole.BLOGGER },
    having: sequelize.literal('COUNT(posts.id) > 0'),
    group: ['User.id'],
    order: [[sequelize.literal('"postCount"'), 'DESC']],
    limit: 10,
    subQuery: false,
  });
};

export const updateUserWithLock = async (id: string, dto: Partial<UserCreationAttributes>) => {
  const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ });

  try {
    const user = await User.findOne({
      where: { id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!user) {
      throw new createError.NotFound('User not found');
    }

    await user.update(dto, { transaction });
    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateUserWithOptimisticLocking = async (id: string, dto: Partial<UserCreationAttributes>) => {
  const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ });

  try {
    const user = await User.findOne({ where: { id }, transaction });
    
    if (!user) {
      throw new createError.NotFound('User not found');
    }

    await user.update(dto, { transaction });
    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof OptimisticLockError) {
      throw new createError.Conflict('Update failed due to a version conflict. Please retry with the latest data.');
    }
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new createError.NotFound('User not found');
  }
  await user.destroy();
};
