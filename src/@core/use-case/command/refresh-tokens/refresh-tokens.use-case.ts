import { CommandProps } from '@lib/domain/command.base';
import { UserRepository } from '../../../domain/repository/user.repository';
import { handleError } from 'src/errors/error-handler';
import {
  RefreshTokensCommand,
  RefreshTokensResponseDto,
} from './refresh-tokens.command';
import { Injectable } from '@nestjs/common';
import { TokenRepository } from '@core/domain/repository/token.repository';
import { errorMessages } from 'src/errors/messages-and-codes';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: CommandProps<RefreshTokensCommand>,
  ): Promise<RefreshTokensResponseDto> {
    try {
      const command = new RefreshTokensCommand(request);
      await command.validate();

      const { refreshToken } = this.userRepo.reqToTokens(command);
      const { login, password } = this.userRepo.idToLogin(command);
      const token = this.tokenRepo.isTokenValid(refreshToken);

      const user = await this.userRepo.findOne({ where: { login } });

      if (user === null) throw new Error(errorMessages.UserNotFound);

      if (token?.userId === user.id) {
        if (bcrypt.compareSync(password, user.password)) {
          return this.tokenRepo.updateWithRefreshToken(refreshToken);
        } else {
          throw new Error(errorMessages.InvalidPassword);
        }
      } else {
        throw new Error(errorMessages.RefreshTokenExpired);
      }
    } catch (err) {
      throw Error((err as Error)?.message);
    }
  }
}
