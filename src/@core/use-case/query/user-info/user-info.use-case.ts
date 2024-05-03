import { QueryProps } from '@lib/domain/query.base';
import { UserRepository } from '../../../domain/repository/user.repository';
import { handleError } from 'src/errors/error-handler';
import { UserInfoQuery, UserInfoResponseDto } from './user-info.query';
import { Injectable } from '@nestjs/common';
import { TokenRepository } from '@core/domain/repository/token.repository';

@Injectable()
export class UserInfoUseCase {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: QueryProps<UserInfoQuery>,
  ): Promise<UserInfoResponseDto> {
    try {
      const query = new UserInfoQuery(request);
      await query.validate();

      const tokens = this.userRepo.reqToTokens(query);

      const { userId } = await this.tokenRepo.checkIfBTValid(
        tokens.bearerToken,
      );

      const res = await this.userRepo.findUserPseudoId(userId);
      return res;
    } catch (err) {
      throw err;
    }
  }
}
