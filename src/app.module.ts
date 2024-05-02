import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { FileModule } from './files';
import { UserModule } from './user';
import { TokenModule } from './tokens/token.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: Boolean(config.get('ENVIRONMENT') === 'DEV'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({ dest: './uploads' }),
    FileModule,
    UserModule,
    TokenModule,
  ],
})
export class AppModule {}
