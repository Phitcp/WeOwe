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
import { LoggerModule } from 'libs/common/logger';

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
    AppConfigModule,
    LoggerModule,
  ],
  providers: [
    AuthService,
    AuthBaseServiceDependencies,
    AuthControllerBaseDependencies,
    RefreshTokenRepository,
    UserRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
