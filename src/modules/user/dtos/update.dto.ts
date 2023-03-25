import { IsBoolean, IsDefined, IsString } from 'class-validator';
import { IUpdateUser } from '../user.interface';

export class UpdateUserDto implements IUpdateUser {
  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  name: string;

  @IsBoolean()
  @IsDefined()
  isActive?: boolean;
}
