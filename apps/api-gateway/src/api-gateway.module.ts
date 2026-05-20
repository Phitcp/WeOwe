import { Module } from '@nestjs/common';
import { ApiGatewayController, ApiGatewayControllerBaseDependencies } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { buildProtoOptions } from 'libs/proto/utils';
import { UtilModule } from '@app/util';
import { AppConfigModule } from './config/config.module';

@Module({
  imports: [
    UtilModule,
    ClientsModule.registerAsync([
      {
        name: 'WE_OWE_SERVICE',
        useFactory: () => {
          const proto = buildProtoOptions();
          return {
            transport: Transport.GRPC,
            options: {
              url: `localhost:${process.env.WE_OWE_PORT ?? 3001}`,
              package: proto.package,
              protoPath: proto.protoPath,
            },
          };
        },
      },
    ]),
    AppConfigModule
  ],
  controllers: [ApiGatewayController],
  providers: [
    ApiGatewayService,
    ApiGatewayControllerBaseDependencies
  ],
  exports: [ApiGatewayService],
})
export class ApiGatewayModule {}
