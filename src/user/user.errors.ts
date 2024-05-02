import { HttpStatus } from '@nestjs/common';

export const UserMessages = {
  UserNotFound: 'user not found',
  UserAlreadyExists: 'user already exists',
  InvalidPassword: 'invalid password',
  InvalidEmail: 'invalid email',
  InvalidPhone: 'invalid phone',
  InvalidRefreshToken: 'invalid refresh token, login again',
  NoHeaders: 'Tokens for auth not provided, try to signin or signup',
};

export const UserErrors = {
  [UserMessages.UserNotFound]: HttpStatus.NOT_FOUND,
  [UserMessages.UserAlreadyExists]: HttpStatus.BAD_REQUEST,
  [UserMessages.InvalidPassword]: HttpStatus.BAD_REQUEST,
  [UserMessages.InvalidEmail]: HttpStatus.BAD_REQUEST,
  [UserMessages.InvalidPhone]: HttpStatus.BAD_REQUEST,
  [UserMessages.InvalidRefreshToken]: HttpStatus.BAD_REQUEST,
  [UserMessages.NoHeaders]: HttpStatus.BAD_REQUEST,
};
