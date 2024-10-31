// sequelize.config.ts
import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import { User } from '../users/models/user.model';
import { Post } from '../posts/models/post.model';
import { UserGroup } from '../groups/models/userGroup.model';
import { Group } from '../groups/models/group.model';

config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Post,Group,UserGroup],  
  logging: false,
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;
