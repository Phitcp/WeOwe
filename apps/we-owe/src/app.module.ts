import { Module } from '@nestjs/common';
import { AppController, AppControllerBaseDependencies } from './app.controller';
import { AppService, BaseAppServiceDependencies } from './app.service';
import { UtilModule } from '@app/util';

@Module({
  imports: [UtilModule],
  controllers: [AppController],
  providers: [
    AppService,
    BaseAppServiceDependencies,
    AppControllerBaseDependencies,
  ],
})
export class AppModule {}
