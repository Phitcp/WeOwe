import { Module } from '@nestjs/common';
import { AppController, AppControllerBaseDependencies } from './app.controller';
import { AppService, BaseAppServiceDependencies } from './app.service';
import { UtilModule } from '@app/util';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from 'libs/database/mongo.module';

@Module({
  imports: [UtilModule, AppConfigModule, DatabaseModule],
  controllers: [AppController],
  providers: [
    AppService,
    BaseAppServiceDependencies,
    AppControllerBaseDependencies,
  ],
})
export class AppModule {}
