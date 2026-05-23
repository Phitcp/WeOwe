import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { envValidationSchema } from './config.validation';
import { AppConfigService } from './config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), 'apps', 'we-owe', '.env'),
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
  ],
  providers: [
    AppConfigService,
  ],
  exports: [
    AppConfigService,
  ]
})
export class AppConfigModule {}
