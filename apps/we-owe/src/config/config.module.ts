import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { envValidationSchema } from './config.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), 'apps', 'we-owe', '.env'),
      validationSchema: envValidationSchema,
      isGlobal: true
    }),
  ],
})
export class AppConfigModule {}
