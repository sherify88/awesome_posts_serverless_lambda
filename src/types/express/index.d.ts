import { User } from '../../users/models/user.model';  // Adjust path to your User model

declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;  // Add other properties from your User model as needed
    }

    interface Request {
      user?: User;  // Add the `user` object to the Express Request type
    }
  }
}
