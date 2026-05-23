import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { buildProtoOptions } from 'libs/proto/utils';
import { ConfigService } from '@nestjs/config';
import { OperationContextService } from 'libs/decorators/operation-context.service';
import { GrpcContextInterceptor } from 'libs/interceptors/grpc-context.interceptor';

async function bootstrap() {
  const packageRoot = buildProtoOptions();
  const configService = new ConfigService();
  const port = configService.get<string>('PORT') ?? '0.0.0.0:3001';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: port,
        package: packageRoot.package,
        protoPath: packageRoot.protoPath,
      },
    },
  );

  app.useGlobalInterceptors(
    new GrpcContextInterceptor(app.get(OperationContextService)),
  );
  await app.listen();
  console.log(`we-owe gRPC service listening on ${port}`);
}
bootstrap();
