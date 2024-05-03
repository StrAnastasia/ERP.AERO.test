import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { TokenRepository } from './repository/token.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { TokensEntity } from './entity/tokens.entity';
import { FileEntity } from './entity/file.entity';
import { FileRepository } from './repository/file.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([TokensEntity]),
    TypeOrmModule.forFeature([FileEntity]),
  ],
  providers: [UserRepository, TokenRepository, FileRepository],
  exports: [UserRepository, TokenRepository, FileRepository],
})
export class RepositoryModule {}
