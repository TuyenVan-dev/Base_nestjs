/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ILogin } from './auth.interface';
import { AuthService } from './auth.service';
import { NoAuth } from 'src/common/decorators/no-auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @NoAuth()
  login(@Body() body: ILogin) {
    try {
      return this.authService.login(body);
    } catch (error) {
      throw error;
    }
  }
}
