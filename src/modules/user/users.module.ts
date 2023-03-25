/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userFactory } from './middlewares/user.middlewares';
import { User } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: userFactory,
      },
    ]),
  ],

  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule],
})
export class UsersModule {}
