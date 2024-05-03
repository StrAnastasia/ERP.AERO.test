import { QueryProps } from '@lib/domain/query.base';
import { FileListQuery, FileListResponseDto } from './file-list.query';
import { Injectable } from '@nestjs/common';
import { TokenRepository, bearerPrefix } from '@core/domain/repository/token.repository';
import { FileRepository } from '@core/domain/repository/file.repository';

@Injectable()
export class FileListUseCase {
  constructor(
    private fileRepo: FileRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: QueryProps<FileListQuery>,
  ): Promise<FileListResponseDto[]> {
    try {
      const query = new FileListQuery(request);
      await query.validate();

      const bearer = query.authorization.replace(bearerPrefix, '');
      await this.tokenRepo.checkIfBTValid(bearer);

      const res = await this.fileRepo.findMany(query);
      return res;
    } catch (err) {
      throw err;
    }
  }
}
