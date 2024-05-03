import { CommandProps } from '@lib/domain/command.base';
import { UserRepository } from '../../../domain/repository/user.repository';
import { TokenRepository } from '@core/domain/repository/token.repository';
import { handleError } from 'src/errors/error-handler';
import {
  CreateUserCommand,
  CreateUserResponseDto,
} from './register-user.command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: CommandProps<CreateUserCommand>,
  ): Promise<CreateUserResponseDto> {
    try {
      const command = new CreateUserCommand(request);
      await command.validate();

      const data = this.userRepo.idToLogin(command);

      if (data.login.includes('@')) {
        this.userRepo.isEmailValid(data.login);
      } else {
        this.userRepo.isPhonenumberValid(data.login);
      }

      const user = await this.userRepo.createUser(data);

      return this.tokenRepo.createTokenPair(user.id);
    } catch (err) {
      throw err;
    }
  }
}
