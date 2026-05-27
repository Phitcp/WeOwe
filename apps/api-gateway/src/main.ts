import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../libs/filters';
import { AppConfigService } from './config/config.service';
import { ExtractTokenInterceptor } from 'libs/interceptors/http/extract-token.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips non-decorated properties
    forbidNonWhitelisted: true, // Throws error if non-whitelisted properties are present
    transform: true, // Automatically transforms payloads to DTO instances
  }));
  app.useGlobalFilters(app.get(HttpExceptionFilter));
  app.useGlobalInterceptors(app.get(ExtractTokenInterceptor));
  const configService = app.get(AppConfigService);
  const port = configService.port;
  await app.listen(port);
  console.log(`Gateway ready on port ${port}`);
}
bootstrap();
