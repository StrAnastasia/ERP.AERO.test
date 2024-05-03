import { CommandProps } from '@lib/domain/command.base';
import { TokenRepository } from '@core/domain/repository/token.repository';
import { handleError } from 'src/errors/error-handler';
import { LogoutCommand, LogoutResponseDto } from './logout.command';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@core/domain/repository/user.repository';

@Injectable()
export class LogoutUseCase {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: CommandProps<LogoutCommand>,
  ): Promise<LogoutResponseDto> {
    try {
      const command = new LogoutCommand(request);
      await command.validate();
      const tokens = this.userRepo.reqToTokens(command);

      await this.tokenRepo.checkIfBTValid(tokens.bearerToken);

      await this.tokenRepo.deleteTokenPair(tokens);

      return { success: true };
    } catch (err) {
      throw err;
    }
  }
}
