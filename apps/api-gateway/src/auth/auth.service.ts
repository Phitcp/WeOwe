import {
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import {
  ChangePasswordRequestDto,
  LoginRequestDto,
  LogoutRequestDto,
  RegisterDto,
  RotateTokenRequestDto,
} from './auth.dto';
import {
  AuthServiceClient,
  GrpcChangePasswordRequest,
  GrpcLogoutRequest,
  GrpcRotateTokenRequest,
} from 'libs/proto/auth/auth.proto.interface';
import { firstValueFrom } from 'rxjs';
import { buildMetadata } from 'libs/proto/utils';

import { OperationContextService } from 'libs/decorators/operation-context.service';
import { OperationContext } from 'libs/decorators/operation-context';
@Injectable()
export class AuthServiceBaseDependencies implements OnModuleInit {
  protected authService!: AuthServiceClient;
  constructor(
    @Inject('WE_OWE_SERVICE') private client: ClientGrpc,
    protected readonly operationContextService: OperationContextService,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>('Auth');
  }
  protected buildPayloadAndMetaData<T>(payload: Omit<T, 'userId'>) {
    const context = this.operationContextService.getContext();
    if (!context.user) {
      throw new UnauthorizedException('Invalid credential');
    }
    const metaData = buildMetadata(context);
    return { payload: { ...payload, userId: context.user.userId }, metaData };
  }
}

@Injectable()
export class AuthService extends AuthServiceBaseDependencies {
  async register(user: RegisterDto) {
    const context = this.operationContextService.getContext();
    const metaData = buildMetadata(context);
    return await firstValueFrom(this.authService.register(user, metaData));
  }

  async login(payload: LoginRequestDto) {
    const context = this.operationContextService.getContext();
    const metaData = buildMetadata(context);
    return await firstValueFrom(this.authService.login(payload, metaData));
  }

  async logout(payload: LogoutRequestDto) {
    const { payload: grpcPayload, metaData } =
      this.buildPayloadAndMetaData<GrpcLogoutRequest>(payload);

    return await firstValueFrom(this.authService.logout(grpcPayload, metaData));
  }

  async rotateToken(payload: RotateTokenRequestDto) {
    const context = this.operationContextService.getContext();
    const refreshToken = context.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const { payload: grpcPayload, metaData } =
      this.buildPayloadAndMetaData<GrpcRotateTokenRequest>({ ...payload, refreshToken });
    return await firstValueFrom(
      this.authService.rotateToken(grpcPayload, metaData),
    );
  }

  async changePassword(payload: ChangePasswordRequestDto) {
    const { payload: grpcPayload, metaData } =
      this.buildPayloadAndMetaData<GrpcChangePasswordRequest>(payload);
    return await firstValueFrom(
      this.authService.changePassword(grpcPayload, metaData),
    );
  }
}
