export enum ERoleUser {
  ADMIN = 'admin',
  MASTER = 'master',
  AGENT = 'agent',
  MEMBER = 'member',
}

export enum ERoleRefUser {
  admin = 'master',
  master = 'agent',
  agent = 'member',
}

export enum EAccountType {
  PREMIUM = 'premium',
  FREE = 'free',
  TRIAL = 'trial',
}

export interface IUser {
  id?: string;
  username?: string;
  name?: string;
  level?: ERoleUser;
  expiredAt?: number;
  ref?: string;
  keywords?: string[];
  credit?: number;
  creditOrigin?: number;
  parentTree?: string;
  accountType?: EAccountType;
  isActive?: boolean;
  parentIsActive?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface ICreateUser {
  username: string;
  name: string;
  password: string;
  credit?: number;
}
export interface IUpdateUser {
  name: string;
  password: string;
  isActive?: boolean;
}

export enum ETypeEditCredit {
  increase = 'increase',
  decrease = 'decrease',
}
