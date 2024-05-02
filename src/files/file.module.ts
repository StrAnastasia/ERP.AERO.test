import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { TokenModule } from 'src/tokens/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), TokenModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
