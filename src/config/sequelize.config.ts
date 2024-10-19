// sequelize.config.ts
import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import { User } from '../users/models/user.model';
import { Post } from '../posts/models/post.model';

config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Post],  // Register your models explicitly
  logging: false,
});

// Function to initialize the connection
export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;
