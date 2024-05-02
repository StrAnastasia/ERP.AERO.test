import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateOrLoginUserDto, HeaderWithTokens } from './user.dto';
import { handleError } from 'src/errors/error-handler';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  idToLogin(dto: CreateOrLoginUserDto) {
    return { login: dto.id, password: dto.password };
  }

  reqToTokens(req: HeaderWithTokens) {
    try {
      return {
        bearerToken: req.headers['authorization'],
        refreshToken: req.headers['refresh_token'],
      };
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Post('signup')
  async signup(@Body() dto: CreateOrLoginUserDto) {
    try {
      const res = await this.userService.create(this.idToLogin(dto));
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Post('signin')
  async signin(@Body() dto: CreateOrLoginUserDto) {
    try {
      const res = await this.userService.login(this.idToLogin(dto));
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Post('signin/new_token')
  async newToken(
    @Request() req: HeaderWithTokens,
    @Body() dto: CreateOrLoginUserDto,
  ) {
    try {
      const res = await this.userService.refreshAuthToken({
        ...this.idToLogin(dto),
        ...this.reqToTokens(req),
      });
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  // TODO: Field 'refreshToken' doesn't have a default value

  @Get('info')
  async info(@Request() req: HeaderWithTokens) {
    try {
      const res = await this.userService.findOne(this.reqToTokens(req));
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Get('logout')
  async logout(@Request() req: HeaderWithTokens) {
    try {
      const res = await this.userService.logout(this.reqToTokens(req));
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }
}
