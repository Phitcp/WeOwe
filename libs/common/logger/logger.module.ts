import { Module } from '@nestjs/common';
import { AppLogger } from './custom-logger.service';
import { OperationContextService } from 'libs/decorators/operation-context.service';

@Module({
  providers: [AppLogger, OperationContextService],
  exports: [AppLogger],
})
export class LoggerModule {}
