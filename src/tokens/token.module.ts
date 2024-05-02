import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensEntity } from './tokens.entity';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([TokensEntity])],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
