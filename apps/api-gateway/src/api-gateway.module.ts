import { MiddlewareConsumer, Module } from '@nestjs/common';
import {
  ApiGatewayController,
  ApiGatewayControllerBaseDependencies,
} from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { UtilModule } from '@app/util';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from 'libs/middlewares/request-log.middleware';
import { WeOweGrpcClientModule } from './grpc-client.module';
import { OperationContextService } from 'libs/decorators/operation-context.service';

import { HttpExceptionFilter } from 'libs/filters';
import { LoggerModule } from 'libs/common/logger';

@Module({
  imports: [UtilModule, WeOweGrpcClientModule, AppConfigModule, AuthModule, LoggerModule],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayService,
    ApiGatewayControllerBaseDependencies,
    OperationContextService,
    HttpExceptionFilter,
  ],
  exports: [ApiGatewayService],
})

export class ApiGatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
