import { Controller, Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { GrpcChangePasswordRequest, GrpcLoginRequest, GrpcLogoutRequest, GrpcRegisterRequest, GrpcRotateTokenRequest } from 'libs/proto/auth/auth.proto.interface';

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

  @GrpcMethod('Auth', 'Login')
  async login(payload: GrpcLoginRequest) {
    return await this.authService.login(payload);
  }

  @GrpcMethod('Auth', 'Logout')
  async logOut(payload: GrpcLogoutRequest) {
    return await this.authService.logout(payload);
  }

  @GrpcMethod('Auth', 'RotateToken')
  async rotateToken(payload: GrpcRotateTokenRequest) { 
    return await this.authService.rotateToken(payload);
  }

  @GrpcMethod('Auth', 'ChangePassword')
  async changePassword(payload: GrpcChangePasswordRequest) {
    return await this.authService.changePassword(payload);
  }
}
