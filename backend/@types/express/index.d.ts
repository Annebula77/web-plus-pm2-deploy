import { ObjectId } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    export interface Request {
      user?: string | JwtPayload | {
        _id: string | ObjectId;
      };
    }
  }
}
