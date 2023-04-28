export type User = {
  username: string;
  expiredAt: number;
  accessToken: string;
  avatar?: string;
  id: string;
};

export type UserSignup = {
  username: string;
  name: string;
  email: string;
  password: string;
}

export enum Role {
  USER = 'Users',
  ADMIN = 'Administrators',
  MANAGERS = 'Managers',
  INVESTORS = 'Investors',
  SUBSCRIBERS = 'Subscribers'
}

export interface GenericResponse {
  status: string;
  message: string;
}

export interface ILoginResponse {
  status: string;
  access_token: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: User;
  }
}