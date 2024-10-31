import express, { Application } from "express";
import postsRouter from './posts/routes/posts.route'; 
import usersRouter from './users/routes/users.route'; 
import authRouter from './auth/routes/auth.route';  
import { json } from "body-parser";
import { connectDatabase } from "./config/sequelize.config";
import { errorHandler } from "./middlewares/errorHandler";
import passport from "./config/passport";
import awsServerlessExpress from 'aws-serverless-express';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const app: Application = express();

// Middleware
app.use(json());

// Initialize Passport middleware
app.use(passport.initialize());



// Routes
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/auth', authRouter); 

// Connect to the database
connectDatabase();

app.use(errorHandler);

// Wrap the app in aws-serverless-express
const server = awsServerlessExpress.createServer(app);

// Lambda handler
export const handler = (event: APIGatewayProxyEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
