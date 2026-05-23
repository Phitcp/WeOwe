import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config.validation';
import { join } from 'path';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), 'apps', 'api-gateway', '.env'),
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
  ],
  providers: [
    AppConfigService,
  ],
  exports: [AppConfigService],
})
export class AppConfigModule {}
