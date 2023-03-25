import { IsString } from 'class-validator';
import { ILogin } from '../auth.interface';

export class LoginDto implements ILogin {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
