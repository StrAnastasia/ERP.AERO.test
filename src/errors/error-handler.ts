import { HttpException, HttpStatus } from '@nestjs/common';
import { errorCodes, errorMessages } from './messages-and-codes';

export function handleError(err: Error) {
  let error = err.message;

  if (error?.includes('properties of undefined'))
    error = errorMessages.NoHeaders;
  const status = errorCodes[error] || HttpStatus.BAD_REQUEST;

  return new HttpException({ status, error }, status);
}
