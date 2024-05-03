import { CommandProps } from '@lib/domain/command.base';
import { UserRepository } from '../../../domain/repository/user.repository';
import { TokenRepository } from '@core/domain/repository/token.repository';
import { handleError } from 'src/errors/error-handler';
import { LoginUserCommand, LoginUserResponseDto } from './login-user.command';
import { Injectable } from '@nestjs/common';
import { errorMessages } from 'src/errors/messages-and-codes';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: CommandProps<LoginUserCommand>,
  ): Promise<LoginUserResponseDto> {
    try {
      const command = new LoginUserCommand(request);
      await command.validate();

      const { login, password } = this.userRepo.idToLogin(command);

      const user = await this.userRepo.findOne({ where: { login } });
      if (user === null) throw new Error(errorMessages.UserNotFound);

      if (bcrypt.compareSync(password, user.password)) {
        return this.tokenRepo.createTokenPair(user.id);
      } else {
        throw Error(errorMessages.InvalidPassword);
      }
    } catch (err) {
      throw err;
    }
  }
}
