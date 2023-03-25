import { IsDefined, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ICreateUser } from '../user.interface';

export class CreateUserDto implements ICreateUser {
  @IsString()
  @IsDefined()
  username: string;

  @IsString()
  @IsDefined()
  password: string;

  @IsString()
  @IsDefined()
  name: string;

  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @Min(0)
  credit: number;
}
