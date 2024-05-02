import { HttpStatus } from '@nestjs/common';

export const errorMessages = {
  NoHeaders: 'Tokens for auth not provided, try to signin or signup',
  RefreshTokenExpired: 'refresh token expired, refresh it',
  ///////// user /////////
  InvalidEmail: 'invalid email',
  InvalidPhone: 'invalid phone',
  InvalidPassword: 'invalid password',
  UserAlreadyExists: 'user already exists',
  UserNotFound: 'user not found',
  ///////// file /////////
  FileNotFound: "file doesn't exist",
};

export const errorCodes = {
  [errorMessages.NoHeaders]: HttpStatus.BAD_REQUEST,
  [errorMessages.RefreshTokenExpired]: HttpStatus.BAD_REQUEST,
  ///////// user /////////
  [errorMessages.UserNotFound]: HttpStatus.NOT_FOUND,
  [errorMessages.UserAlreadyExists]: HttpStatus.BAD_REQUEST,
  [errorMessages.InvalidPassword]: HttpStatus.BAD_REQUEST,
  [errorMessages.InvalidEmail]: HttpStatus.BAD_REQUEST,
  [errorMessages.InvalidPhone]: HttpStatus.BAD_REQUEST,

  ///////// file /////////
  [errorMessages.FileNotFound]: HttpStatus.NOT_FOUND,
};
