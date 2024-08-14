import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { mongooseConnectUri } from '@Config/database.config';
import mongoose from 'mongoose';

import { User, UserSchema } from '@Modules/users/schemas/user.schema';
import {
  UserSession,
  UserSessionSchema,
} from '@Modules/users/schemas/user-session.schema';

@Injectable()
export class NonAuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const connection = await mongoose.connect(mongooseConnectUri, {
      dbName: process.env.DATABASE_NAME,
    });
    const userSessionModel = connection.model('userSession', UserSessionSchema);
    const userModel = connection.model('user', UserSchema);
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['clerk-session'];

    if (sessionId) {
      const authSession: UserSession = await userSessionModel.findOne({
        sessionId,
      });
      const authUser: User = await userModel.findOne({
        _id: authSession?.userId,
      });

      if (authUser) request.user = authUser;
    }

    return true;
  }
}
