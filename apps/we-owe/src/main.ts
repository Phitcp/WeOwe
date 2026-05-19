import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { buildProtoOptions } from 'libs/proto/utils';

async function bootstrap() {
  const packageRoot = buildProtoOptions();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${process.env.PORT ?? 3001}`,
      package: packageRoot.package,
      protoPath: packageRoot.protoPath,
    },
  });

  await app.listen();
  console.log(`we-owe gRPC service listening on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
