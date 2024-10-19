// sequelize.config.ts
import { Sequelize } from 'sequelize-typescript';
import { config } from 'dotenv';
import { User } from '../users/models/user.model';
import { Post } from '../posts/models/post.model';

config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.ENVIRON_DB_HOST,
  port: Number(process.env.ENVIRON_DB_PORT),
  username: process.env.ENVIRON_DB_USER,
  password: process.env.ENVIRON_DB_PWD,
  database: process.env.ENVIRON_DB_NAME,
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
