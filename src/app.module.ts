import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';
import { CoreModule } from '@core/core.module';
import { UserController } from './controllers/user.controller';
import { FileController } from './controllers/file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';

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
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'uploads') }),

    CoreModule,
  ],
  controllers: [UserController, FileController],
})
export class AppModule {}
