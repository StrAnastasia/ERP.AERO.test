import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateOrLoginUserDto, HeaderWithTokens } from './user.dto';
import { UserErrors, UserMessages } from './user.errors';
import { bearerPrefix } from 'src/tokens/token.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  idToLogin(dto: CreateOrLoginUserDto) {
    return { login: dto.id, password: dto.password };
  }

  @Post('signup')
  async signup(@Body() dto: CreateOrLoginUserDto) {
    try {
      const res = await this.userService.create(this.idToLogin(dto));
      return res;
    } catch (err) {
      const error = (err as Error)?.message;
      const status = UserErrors[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Post('signin')
  async signin(@Body() dto: CreateOrLoginUserDto) {
    try {
      const res = await this.userService.login(this.idToLogin(dto));
      return res;
    } catch (err) {
      const error = (err as Error)?.message;
      const status = UserErrors[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Post('signin/new_token')
  async newToken(
    @Request() req: HeaderWithTokens,
    @Body() dto: CreateOrLoginUserDto,
  ) {
    try {
      const bearer = req.headers['authorization'];
      const refresh = req.headers['refresh_token'];
      bearer.replaceAll(bearerPrefix, '');
      const res = await this.userService.refreshAuthToken({
        ...this.idToLogin(dto),
        refresh,
        bearer,
      });
      return res;
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = UserMessages.NoHeaders;
      const status = UserErrors[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Get('info')
  async info(@Request() req: HeaderWithTokens) {
    try {
      const res = await this.userService.findOne({
        bearerToken: req.headers['authorization'],
        refreshToken: req.headers['refresh_token'],
      });
      return res;
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = UserMessages.NoHeaders;
      const status = UserErrors[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Get('logout')
  async logout(@Request() req: HeaderWithTokens) {
    try {
      const res = await this.userService.logout({
        bearerToken: req.headers['authorization'],
        refreshToken: req.headers['refresh_token'],
      });
      return res;
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = UserMessages.NoHeaders;
      const status = UserErrors[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }
}
