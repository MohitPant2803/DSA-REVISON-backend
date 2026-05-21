import { IUser } from './src/models/user.model';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
    }
  }
}
export {};