import { QueryProps } from '@lib/domain/query.base';
import { DownloadFileQuery } from './download-file.query';
import { Injectable } from '@nestjs/common';
import {
  TokenRepository,
  bearerPrefix,
} from '@core/domain/repository/token.repository';
import { FileRepository } from '@core/domain/repository/file.repository';
import { FileEntity } from '@core/domain/entity/file.entity';

@Injectable()
export class DownloadFileUseCase {
  constructor(
    private fileRepo: FileRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(request: QueryProps<DownloadFileQuery>): Promise<FileEntity> {
    try {
      const query = new DownloadFileQuery(request);
      await query.validate();

      const bearer = query.authorization.replace(bearerPrefix, '');
      await this.tokenRepo.checkIfBTValid(bearer);
      const data = await this.fileRepo.findOneFile(query.id);

      if (data.fileForDownload === '') throw Error('no file to download');

      return data;
    } catch (err) {
      throw err;
    }
  }
}
