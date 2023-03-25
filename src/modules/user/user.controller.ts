import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateUserDto } from './dtos/create.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { ERoleUser } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get()
  @Roles(ERoleUser.ADMIN, ERoleUser.MASTER, ERoleUser.AGENT)
  async getUser(@Req() req: Request, @Pagination() cursor, @Res() res: Response) {
    try {
      const user = await this.usersService.getUser(req, cursor);
      return res.json(user);
    } catch (error) {
      throw error;
    }
  }

  @Get('me')
  getMe(@Req() req: Request, @Res() res: Response) {
    try {
      return res.json(req.user);
    } catch (error) {
      throw error;
    }
  }

  @Get(':username')
  @Roles(ERoleUser.ADMIN, ERoleUser.MASTER, ERoleUser.AGENT)
  async getRef(@Param('username') username: string, @Req() req: Request, @Res() res: Response) {
    try {
      const user = await this.usersService.getByUsername(username, req.user);
      return res.json(user);
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(ERoleUser.ADMIN, ERoleUser.MASTER, ERoleUser.AGENT)
  async createUser(@Req() req: Request, @Body() body: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.createUser(body, req);
      return res.json(user);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(ERoleUser.ADMIN, ERoleUser.MASTER, ERoleUser.AGENT)
  async updateUser(@Req() req: Request, @Body() body: UpdateUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.updateUser(body, req);
      return res.json(user);
    } catch (error) {
      throw error;
    }
  }

  @Put('change-credit/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(ERoleUser.ADMIN, ERoleUser.MASTER, ERoleUser.AGENT)
  async changeCredit(@Req() req: Request, @Body() body: UpdateUserDto, @Res() res: Response) {
    try {
      const user = await this.usersService.changeCredit(body, req);
      return res.json(user);
    } catch (error) {
      throw error;
    }
  }

  @Post('renew-credit')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(ERoleUser.ADMIN, ERoleUser.MASTER, ERoleUser.AGENT)
  async renewCredit(@Req() req: Request, @Body() body: UpdateUserDto, @Res() res: Response) {
    try {
      await this.usersService.handleRenewCredit();
      return res.json();
    } catch (error) {
      throw error;
    }
  }
}
