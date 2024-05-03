import { CommandProps } from '@lib/domain/command.base';
import {
  TokenRepository,
  bearerPrefix,
} from '@core/domain/repository/token.repository';
import {
  DeleteFileCommand,
  DeleteFileResponseDto,
} from './delete-file.command';
import { Injectable } from '@nestjs/common';
import { FileRepository } from '@core/domain/repository/file.repository';
import { unlinkSync } from 'fs';

@Injectable()
export class DeleteFileUseCase {
  constructor(
    private fileRepo: FileRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: CommandProps<DeleteFileCommand>,
  ): Promise<DeleteFileResponseDto> {
    try {
      const command = new DeleteFileCommand(request);
      await command.validate();
      const bearer = command.authorization.replace(bearerPrefix, '');
      await this.tokenRepo.checkIfBTValid(bearer);

      const res = await this.fileRepo.deleteFile(command.id);

      unlinkSync(`./uploads/${res.fileForDownload}`);
      return res;
    } catch (err) {
      throw err;
    }
  }
}
