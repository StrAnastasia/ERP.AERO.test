import { Module } from '@nestjs/common';

import { commands, queries } from './use-case';
import { RepositoryModule } from './domain/domain.module';

@Module({
  imports: [RepositoryModule],
  providers: [...commands, ...queries],
  exports: [...commands, ...queries],
})
export class CoreModule {}
