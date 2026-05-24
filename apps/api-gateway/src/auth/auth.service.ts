import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { RegisterDto } from './auth.dto';
import { AuthServiceClient } from 'libs/proto/auth/auth.proto.interface';
import { firstValueFrom } from 'rxjs';
import { buildMetadata } from 'libs/proto/utils';

import { OperationContextService } from 'libs/decorators/operation-context.service';
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
}

@Injectable()
export class AuthService extends AuthServiceBaseDependencies {
  async register(user: RegisterDto) {
    const context = this.operationContextService.getContext();
    const metaData = buildMetadata(context);
    return await firstValueFrom(this.authService.register(user, metaData));
  }
}
