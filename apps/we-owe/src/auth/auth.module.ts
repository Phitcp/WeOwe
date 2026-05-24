import { Module } from '@nestjs/common';
import { AuthBaseServiceDependencies, AuthService } from './auth.service';
import {
  AuthController,
  AuthControllerBaseDependencies,
} from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user/user.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token/refresh-token.schema';
import { RefreshTokenRepository } from './schemas/refresh-token/refresh-token.repository';
import { UserRepository } from './schemas/user/user.repository';
import { UtilModule } from '@app/util';
import { JwtModule } from 'libs/common/jwt';
import { AppConfigModule } from '../config/config.module';
import { OperationContextService } from 'libs/decorators/operation-context.service';
import { AppLogger } from 'libs/common/logger/custom-logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
    ]),
    UtilModule,
    JwtModule,
    AppConfigModule
  ],
  providers: [
    OperationContextService,
    AuthService,
    AuthBaseServiceDependencies,
    AuthControllerBaseDependencies,
    RefreshTokenRepository,
    UserRepository,
    AppLogger,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
