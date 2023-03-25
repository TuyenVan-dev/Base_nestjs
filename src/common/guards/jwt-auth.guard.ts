import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { AuthGuard } from '@nestjs/passport';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, @InjectModel(User.name) private UserModel: Model<UserDocument>) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());

    if (noAuth) return true;

    const parentCanActivate = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    if (!request?.user?.id) throw new UnauthorizedException();
    const user = await this.UserModel.findById(request.user.id);
    if (!user) throw new UnauthorizedException();

    request.user = user.view();

    return parentCanActivate;
  }
}
