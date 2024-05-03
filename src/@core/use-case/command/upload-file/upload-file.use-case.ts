import { CommandProps } from '@lib/domain/command.base';
import {
  TokenRepository,
  bearerPrefix,
} from '@core/domain/repository/token.repository';
import {
  UploadFileCommand,
  UploadFileResponseDto,
} from './upload-file.command';
import { Injectable } from '@nestjs/common';
import { FileRepository } from '@core/domain/repository/file.repository';

@Injectable()
export class UploadFileUseCase {
  constructor(
    private fileRepo: FileRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: CommandProps<UploadFileCommand>,
  ): Promise<UploadFileResponseDto> {
    try {
      const command = new UploadFileCommand(request);
      await command.validate();

      const bearer = command.authorization.replace(bearerPrefix, '');
      await this.tokenRepo.checkIfBTValid(bearer);

      const res = await this.fileRepo.createFile(command.file);

      return res;
    } catch (err) {
      throw err;
    }
  }
}
