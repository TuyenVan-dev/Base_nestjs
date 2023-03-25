import { IUser } from '../user/user.interface';

export interface ILogin {
  username: string;
  password: string;
}

export interface ILoginReponse {
  user: IUser;
  token: string;
}
