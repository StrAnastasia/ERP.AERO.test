import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FindFilesDto, HeaderWithTokens } from './file.types';
import { TokenService } from 'src/tokens/token.service';
import { FileMessages } from './file.errors';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream, unlinkSync } from 'fs';

import type { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('list')
  async findMany(@Query() dto: FindFilesDto, @Request() req: HeaderWithTokens) {
    try {
      await this.tokenService.checkIfBTValid(req.headers.authorization);
      const res = await this.fileService.findMany(dto);
      return res;
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = FileMessages.NoHeaders;
      const status = FileMessages[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: HeaderWithTokens,
  ) {
    try {
      await this.tokenService.checkIfBTValid(req.headers.authorization);

      const fileName = file.originalname;
      const extension = fileName.split('.')[fileName.split('.').length - 1];
      const name = fileName.replace('.' + extension, '');

      const fileForDB = {
        name,
        extension,
        mimeType: file.mimetype,
        size: file.size,
        path: '',
      };
      const res = await this.fileService.create(fileForDB);

      const ws = createWriteStream(
        `./uploads/${res.id}-${res.name}.${res.extension}`,
      );
      ws.write(
        file.buffer instanceof Buffer ? file.buffer : String(file.buffer),
      );

      fileForDB.path = String(ws.path);

      return res;
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = FileMessages.NoHeaders;
      const status = FileMessages[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Get('download/:id')
  async download(
    @Param('id') id: number,
    @Request() req: HeaderWithTokens,
    @Res() res: Response,
  ) {
    try {
      await this.tokenService.checkIfBTValid(req.headers.authorization);

      const file = await this.fileService.download(id);
      return res.sendFile(`${file.id}-${file.name}.${file.extension}`, {
        root: 'uploads/',
      });
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = FileMessages.NoHeaders;
      const status = FileMessages[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Put('update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: HeaderWithTokens,
  ) {
    try {
      await this.tokenService.checkIfBTValid(req.headers.authorization);

      const oldFile = await this.fileService.findOne(id);
      // if (oldFile === null) throw Error

      const fileName = file.originalname;
      const extension = fileName.split('.')[fileName.split('.').length - 1];
      const name = fileName.replace('.' + extension, '');

      const fileForDB = {
        name,
        extension,
        mimeType: file.mimetype,
        size: file.size,
      };

      const res = await this.fileService.update(id, fileForDB);

      unlinkSync(`./uploads/${id}-${oldFile.name}.${oldFile.extension}`);

      const ws = createWriteStream(
        `./uploads/${res.id}-${res.name}.${res.extension}`,
      );
      ws.write(
        file.buffer instanceof Buffer ? file.buffer : String(file.buffer),
      );
      return res;
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = FileMessages.NoHeaders;
      const status = FileMessages[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: number, @Request() req: HeaderWithTokens) {
    try {
      await this.tokenService.checkIfBTValid(req.headers.authorization);

      const res = await this.fileService.delete(id);
      unlinkSync(`./uploads/${id}-${res.name}.${res.extension}`);
      return res;
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = FileMessages.NoHeaders;
      const status = FileMessages[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req: HeaderWithTokens) {
    try {
      await this.tokenService.checkIfBTValid(req.headers.authorization);
      const res = await this.fileService.findOne(id);
      return res;
    } catch (err) {
      let error = (err as Error)?.message;
      if (error.includes('properties of undefined'))
        error = FileMessages.NoHeaders;
      const status = FileMessages[error] || HttpStatus.BAD_REQUEST;

      throw new HttpException({ status, error }, status);
    }
  }
}
