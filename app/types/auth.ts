export interface IVerifyTokenData {
  userId: string;
  iat: number;
  exp: number;
}

export enum ERole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface IUserSchema {
  email: string
  password: string
  firstName: string
  lastName: string
  role: string
}

export interface ISignUpRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface ISignInRequest {
  email: string
  password: string
}