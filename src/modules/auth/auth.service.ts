/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ILogin, ILoginReponse } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { EErrorMessage } from 'src/common/interfaces/message.interface';
import { ERoleUser } from '../user/user.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, @InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async login(payload: ILogin): Promise<ILoginReponse> {
    const user = await this.UserModel.findOne({ username: payload.username });
    if (!user) throw new UnauthorizedException(EErrorMessage.PASSWORD_INCORRECT);
    if (user.level === ERoleUser.MEMBER) throw new UnauthorizedException(EErrorMessage.PERMISSION_DENIED);

    const isAuth = await user.comparePasswords(payload.password);
    if (!isAuth) {
      throw new UnauthorizedException(EErrorMessage.PASSWORD_INCORRECT);
    }

    const userInfo = user.view();
    const token = this.jwtService.sign({
      id: userInfo.id,
      username: userInfo.username,
      ref: userInfo.ref ?? null,
      parentTree: userInfo.parentTree ?? null,
      accountType: userInfo.accountType,
    });

    return {
      token,
      user: userInfo,
    };
  }
}
