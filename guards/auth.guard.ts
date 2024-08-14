import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { mongooseConnectUri } from '@Config/database.config';
import mongoose from 'mongoose';

import { User, UserSchema } from '@Modules/users/schemas/user.schema';
import { UserDeviceSchema } from '@Modules/users/schemas/user-devices.schema';
import {
  UserSession,
  UserSessionSchema,
} from '@Modules/users/schemas/user-session.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const connection = await mongoose.connect(mongooseConnectUri, {
      dbName: process.env.DATABASE_NAME,
    });
    const userSessionModel = connection.model('userSession', UserSessionSchema);
    const userModel = connection.model('user', UserSchema);
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['clerk-session'];

    if (!sessionId)
      throw new UnauthorizedException(
        'Unauthorized: No Clerk session ID found in headers',
      );

    const authSession: UserSession = await userSessionModel.findOne({
      sessionId,
    });
    let authUser: User = await userModel.findOne({
      _id: authSession?.userId,
    });

    if (!authUser) {
      const deviceId = request.headers['device-id'];
      const deviceToken = request.headers['device-token'];
      if (!deviceId) throw new UnauthorizedException();

      authUser = await this.syncSession(
        sessionId,
        deviceId,
        deviceToken,
        connection,
      ).catch((error) => {
        console.log(error);
        throw new UnauthorizedException();
      });
    }

    request.user = authUser;

    return true;
  }

  async syncSession(
    sessionId: string,
    deviceId: string,
    deviceToken: string,
    connection,
  ) {
    // const connection = await mongoose.connect(mongooseConnectUri, {
    //   dbName: process.env.DATABASE_NAME,
    // });
    const userSessionModel = connection.model('userSession', UserSessionSchema);
    const userDeviceModel = connection.model('userDevice', UserDeviceSchema);
    const userModel = connection.model('user', UserSchema);

    if (!(sessionId && deviceId))
      throw new BadRequestException(`Missing header properties`);

    const userDevice = await userDeviceModel.findOne({
      deviceId,
      deviceToken,
    });
    if (!userDevice)
      throw new BadRequestException(`User device id was not found.`);

    const clerkUser = await clerkClient.sessions.getSession(sessionId);
    if (!clerkUser)
      throw new UnauthorizedException(`Clerk user was not found.`);

    const user = await userModel.findOne({
      _id: userDevice.userId,
      clerkUserId: clerkUser.userId,
    });
    if (!user) throw new UnauthorizedException(`User was not found`);

    const userSession = await userSessionModel.findOne({
      userId: userDevice.userId,
      userDeviceId: userDevice.id,
    });
    if (!userSession) {
      console.log(`User session wasn't found`);
      throw new UnauthorizedException(`User session wasn't found`);
    }

    await userSessionModel.updateOne({ _id: userSession.id }, { sessionId });

    return user;
  }
}
