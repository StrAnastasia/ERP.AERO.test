import { HttpStatus } from '@nestjs/common';

export const FileMessages = {
  RefreshTokenExpired: 'refresh token expired, refresh it',
  CantRefreshBearer:
    "can't automatically refresh the access token, reauth at first please",
  FileNotFound: "file doesn't exist",
  NoHeaders: 'Tokens for auth not provided, try to signin or signup',
};

export const FileErrors = {
  [FileMessages.RefreshTokenExpired]: HttpStatus.BAD_REQUEST,
  [FileMessages.FileNotFound]: HttpStatus.NOT_FOUND,
  [FileMessages.CantRefreshBearer]: HttpStatus.UNAUTHORIZED,
  [FileMessages.NoHeaders]: HttpStatus.BAD_REQUEST,
};
