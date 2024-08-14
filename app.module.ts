import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { mongooseConnectUri } from '@Config/database.config';
import * as dotenv from 'dotenv';
import * as process from 'process';

import { modules } from '@Modules/index';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(mongooseConnectUri, {
      dbName: process.env.DATABASE_NAME,
    }),
    ...modules,
    ScheduleModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {
  constructor() {}
}
