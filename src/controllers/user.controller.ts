import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { handleError } from 'src/errors/error-handler';
import {
  LoginUserUseCase,
  LogoutUseCase,
  RefreshTokensUseCase,
  RegisterUserUseCase,
} from '@core/use-case/command';
import { UserInfoUseCase } from '@core/use-case/query';
import {
  CreateOrLoginUserDto,
  HeaderWithTokens,
} from '@core/domain/entity/user.types';

@Controller()
export class UserController {
  constructor(
    private readonly registerUC: RegisterUserUseCase,
    private readonly loginUC: LoginUserUseCase,
    private readonly refreshTokensUC: RefreshTokensUseCase,
    private readonly userInfoUC: UserInfoUseCase,
    private readonly logoutUC: LogoutUseCase,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateOrLoginUserDto) {
    try {
      const res = await this.registerUC.execute(dto);
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Post('signin')
  async signin(@Body() dto: CreateOrLoginUserDto) {
    try {
      const res = await this.loginUC.execute(dto);
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Post('signin/new_token')
  async newToken(
    @Request() { headers }: { headers: HeaderWithTokens },
    @Body() dto: CreateOrLoginUserDto,
  ) {
    try {
      const res = await this.refreshTokensUC.execute({ ...dto, ...headers });
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Get('info')
  async info(@Request() { headers }: { headers: HeaderWithTokens }) {
    try {
      const res = await this.userInfoUC.execute(headers);
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Get('logout')
  async logout(@Request() { headers }: { headers: HeaderWithTokens }) {
    try {
      const res = await this.logoutUC.execute(headers);
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }
}
