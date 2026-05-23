import { UtilService } from '@app/util';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserRepository } from './schemas/user/user.repository';
import { RefreshTokenRepository } from './schemas/refresh-token/refresh-token.repository';
import {
  GrpcRegisterRequest,
  GrpcRegisterResponse,
} from 'libs/proto/auth/auth.proto.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'libs/common/jwt';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class AuthBaseServiceDependencies {
  constructor(
    protected userRepository: UserRepository,
    protected refreshTokenRepository: RefreshTokenRepository,
    protected utilService: UtilService,
    protected jwtService: JwtService,
    protected appConfig: AppConfigService,
  ) {}
}

@Injectable()
export class AuthService extends AuthBaseServiceDependencies {
  async register(payload: GrpcRegisterRequest): Promise<GrpcRegisterResponse> {
    const { email, password } = payload;
    const isExisted = await this.userRepository.count({ email: payload.email });
    if (isExisted) {
      throw new RpcException({
        code: 6,
        message: 'User already exists',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await this.userRepository.create({
      email,
      passwordHash,
    });

    const { accessToken, refreshToken } = this.jwtService.generateTokenPair({
      userId: newUser._id,
      role: newUser.globalRole,
    });

    const msInDay = 1000 * 60 * 60 * 24;
    await this.refreshTokenRepository.create({
      userId: newUser._id.toString(),
      tokenHash: await this.jwtService.hashToken(refreshToken),
      familyId: this.jwtService.generateFamilyId(),
      expiresAt: this.utilService.addDaysToDate(
        new Date(),
        this.appConfig.jwt.refreshTokenExpiration / msInDay || 7,
      ),
    });

    return {
      email: newUser.email,
      password: newUser.passwordHash,
      accessToken,
      refreshToken,
    };
  }
}
