import { CommandProps } from '@lib/domain/command.base';
import {
  TokenRepository,
  bearerPrefix,
} from '@core/domain/repository/token.repository';
import {
  UpdateFileCommand,
  UpdateFileResponseDto,
} from './update-file.command';
import { Injectable } from '@nestjs/common';
import { FileRepository } from '@core/domain/repository/file.repository';
import * as fs from 'fs';

@Injectable()
export class UpdateFileUseCase {
  constructor(
    private fileRepo: FileRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async execute(
    request: CommandProps<UpdateFileCommand>,
  ): Promise<UpdateFileResponseDto> {
    try {
      const command = new UpdateFileCommand(request);
      await command.validate();

      const bearer = command.authorization.replace(bearerPrefix, '');
      await this.tokenRepo.checkIfBTValid(bearer);

      const oldFile = await this.fileRepo.findOneFile(command.id);

      const fileName = command.file.originalname;
      const extension = fileName.split('.')[fileName.split('.').length - 1];
      const name = fileName.replace('.' + extension, '');

      const fileForDB = {
        name,
        extension,
        mimeType: command.file.mimetype,
        size: command.file.size,
        fileForDownload: command.file.filename,
      };

      const res = await this.fileRepo.updateFile(command.id, fileForDB);
      fs.unlinkSync(`./uploads/${oldFile.fileForDownload}`);
      return res;
    } catch (err) {
      throw err;
    }
  }
}
