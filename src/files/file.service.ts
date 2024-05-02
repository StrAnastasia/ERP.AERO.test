import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { Repository } from 'typeorm';
import { CreateFileDto, FindFilesDto, UpdateFileDto } from './file.types';
import { FileMessages } from './file.errors';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async create(dto: CreateFileDto) {
    const file = this.fileRepository.create(dto);

    return await this.fileRepository.save(file);
  }

  async update(id: number, dto: UpdateFileDto) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new Error(FileMessages.FileNotFound);

    return await this.fileRepository.save({ ...file, ...dto });
  }

  async delete(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) throw new Error(FileMessages.FileNotFound);

    return await this.fileRepository.remove(file);
  }

  async findMany({ list_size = 10, page = 1 }: FindFilesDto) {
    const files = await this.fileRepository.find({
      take: list_size,
      skip: (page - 1) * list_size,
    });
    return files.map((file) => this.toResponse(file));
  }

  async findOne(id: number) {
    const file = await this.fileRepository.findOne({ where: { id } });
    return this.toResponse(file);
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

  download(id: number) {
    return this.fileRepository.findOne({ where: { id } });
  }
}
