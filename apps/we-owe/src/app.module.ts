import { Module } from '@nestjs/common';
import { AppController, AppControllerBaseDependencies } from './app.controller';
import { AppService, BaseAppServiceDependencies } from './app.service';
import { UtilModule } from '@app/util';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from '../../../libs/database/mongo.module';
import { AuthModule } from './auth/auth.module';
import { GrpcContextInterceptor } from 'libs/interceptors/grpc-context.interceptor';
import { OperationContextService } from 'libs/decorators/operation-context.service';

@Module({
  imports: [
    UtilModule,
    AppConfigModule,
    DatabaseModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BaseAppServiceDependencies,
    AppControllerBaseDependencies,
    OperationContextService
  ],
})
export class AppModule {}
