import { Module } from '@nestjs/common';
import { AuthService, AuthServiceBaseDependencies } from './auth.service';
import {
  AuthController,
  AuthControllerBaseDependencies,
} from './auth.controller';
import { WeOweGrpcClientModule } from '../grpc-client.module';
import { OperationContextService } from 'libs/decorators/operation-context.service';

@Module({
  imports: [WeOweGrpcClientModule],
  controllers: [AuthController],
  providers: [
    AuthControllerBaseDependencies,
    AuthService,
    AuthServiceBaseDependencies,
    OperationContextService,
  ],
})
export class AuthModule {}
