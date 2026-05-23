import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { buildProtoOptions } from 'libs/proto/utils';
import { AppConfigService } from './config/config.service';
import { AppConfigModule } from './config/config.module';
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'WE_OWE_SERVICE',
        imports: [AppConfigModule],
        inject: [AppConfigService],
        useFactory: (config: AppConfigService) => {
          const proto = buildProtoOptions();
          return {
            transport: Transport.GRPC,
            options: {
              url: config.weOwePort,
              package: proto.package,
              protoPath: proto.protoPath,
            },
          };
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class WeOweGrpcClientModule {}
