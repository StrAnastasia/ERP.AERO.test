import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  FindFilesDto,
  HeaderWithTokens,
} from '../@core/domain/entity/file.types';

import { handleError } from 'src/errors/error-handler';
import {
  DownloadFileUseCase,
  FileListUseCase,
  GetFileDataUseCase,
} from '@core/use-case/query';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  DeleteFileUseCase,
  UpdateFileUseCase,
  UploadFileUseCase,
} from '@core/use-case/command';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileListUC: FileListUseCase,
    private readonly uploadUC: UploadFileUseCase,
    private readonly downloadFileUC: DownloadFileUseCase,
    private readonly updateFileUC: UpdateFileUseCase,
    private readonly deleteFileUC: DeleteFileUseCase,
    private readonly getFileDataUC: GetFileDataUseCase,
  ) {}

  @Get('list')
  async findMany(
    @Query() dto: FindFilesDto,
    @Request() { headers }: { headers: HeaderWithTokens },
  ) {
    try {
      const res = await this.fileListUC.execute({ ...dto, ...headers });
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() { headers }: { headers: HeaderWithTokens },
  ) {
    try {
      const fileName = file.originalname;
      const extension = fileName.split('.')[fileName.split('.').length - 1];
      const name = fileName.replace('.' + extension, '');

      const fileForDB = {
        name,
        extension,
        mimeType: file.mimetype,
        size: file.size,
        fileForDownload: file.filename,
      };

      const res = await this.uploadUC.execute({ file: fileForDB, ...headers });

      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Get('download/:id')
  async download(
    @Param('id') id: number,
    @Request() { headers }: { headers: HeaderWithTokens },
    @Res() res: Response,
  ) {
    try {
      const file = await this.downloadFileUC.execute({ id, ...headers });

      return res.sendFile(file.fileForDownload, { root: 'uploads/' });
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() { headers }: { headers: HeaderWithTokens },
  ) {
    try {
      const res = await this.updateFileUC.execute({ id, file, ...headers });
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Delete('delete/:id')
  async delete(
    @Param('id') id: number,
    @Request() { headers }: { headers: HeaderWithTokens },
  ) {
    try {
      const res = await this.deleteFileUC.execute({ id, ...headers });
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Request() { headers }: { headers: HeaderWithTokens },
  ) {
    try {
      const res = await this.getFileDataUC.execute({ id, ...headers });
      return res;
    } catch (err) {
      throw handleError(err as Error);
    }
  }
}
