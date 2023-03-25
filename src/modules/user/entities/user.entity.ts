import { Exclude } from 'class-transformer';
import { EAccountType, ERoleUser } from '../user.interface';

export class UserEntity {
  id: string;
  username: string;
  name: string;
  level: ERoleUser;
  expiredAt: number;
  ref: string;
  credit: number;
  parentTree: string;
  accountType: EAccountType;
  isActive: boolean;
  parentIsActive: boolean;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;

  @Exclude()
  keywords: string[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
