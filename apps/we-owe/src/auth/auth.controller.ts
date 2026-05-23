import { Controller, Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { GrpcRegisterRequest } from 'libs/proto/auth/auth.proto.interface';

@Injectable()
export class AuthControllerBaseDependencies {
  constructor(protected readonly authService: AuthService) {}
}

@Controller()
export class AuthController extends AuthControllerBaseDependencies {
  @GrpcMethod('Auth', 'Register')
  async register(payload: GrpcRegisterRequest){
    return await this.authService.register(payload);
  }
}
