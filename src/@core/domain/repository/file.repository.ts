import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../entity/file.entity';
import { Repository } from 'typeorm';
import {
  CreateFileDto,
  FindFilesDto,
  UpdateFileDto,
} from '../entity/file.types';
import { errorMessages } from '../../../errors/messages-and-codes';

@Injectable()
export class FileRepository extends Repository<FileEntity> {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    super(
      fileRepository.target,
      fileRepository.manager,
      fileRepository.queryRunner,
    );
  }

  async createFile(dto: CreateFileDto) {
    const file = this.fileRepository.create(dto);
    return await this.fileRepository.save(file);
  }

  async updateFile(id: number, dto: UpdateFileDto) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new Error(errorMessages.FileNotFound);

    return await this.fileRepository.save({ ...file, ...dto });
  }

  async deleteFile(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new Error(errorMessages.FileNotFound);

    return await this.fileRepository.remove(file);
  }

  async findMany({ list_size = 10, page = 1 }: FindFilesDto) {
    const files = await this.fileRepository.find({
      take: list_size,
      skip: (page - 1) * list_size,
    });
    return files.map((file) => this.toResponse(file));
  }

  async findOneFile(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw Error(errorMessages.FileNotFound);
    return file;
  }

  toResponse(fileObj: FileEntity) {
    return {
      name: fileObj.name,
      extension: fileObj.extension,
      mimeType: fileObj.mimeType,
      size: fileObj.size,
      dateUploaded: fileObj.dateCreated,
    };
  }
}
