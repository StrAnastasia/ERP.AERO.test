import { QueryProps } from '@lib/domain/query.base';
import {
  GetFileDataQuery,
  GetFileDataResponseDto,
} from './get-file-data.query';
import { Injectable } from '@nestjs/common';
import {
  TokenRepository,
  bearerPrefix,
} from '@core/domain/repository/token.repository';
import { FileRepository } from '@core/domain/repository/file.repository';

@Injectable()
export class GetFileDataUseCase {
  constructor(
    private fileRepo: FileRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: QueryProps<GetFileDataQuery>,
  ): Promise<GetFileDataResponseDto> {
    try {
      const query = new GetFileDataQuery(request);
      await query.validate();

      const bearer = query.authorization.replace(bearerPrefix, '');
      await this.tokenRepo.checkIfBTValid(bearer);

      const res = await this.fileRepo.findOneFile(query.id);
      return this.fileRepo.toResponse(res);
    } catch (err) {
      throw err;
    }
  }
}
