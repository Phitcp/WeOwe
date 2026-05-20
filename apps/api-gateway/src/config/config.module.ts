import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config.validation';
import { join } from 'path';

console.log(join(process.cwd(), 'apps', 'api-gateway', '.env'))
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), 'apps', 'api-gateway', '.env'),
      validationSchema: envValidationSchema,
      isGlobal: true
    }),
  ],
})
export class AppConfigModule {}
