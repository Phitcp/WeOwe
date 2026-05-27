import { UtilService } from '@app/util';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserRepository } from './schemas/user/user.repository';
import { RefreshTokenRepository } from './schemas/refresh-token/refresh-token.repository';
import {
  GrpcChangePasswordRequest,
  GrpcChangePasswordResponse,
  GrpcLoginRequest,
  GrpcLoginResponse,
  GrpcLogoutRequest,
  GrpcLogoutResponse,
  GrpcRegisterRequest,
  GrpcRegisterResponse,
  GrpcRotateTokenRequest,
  GrpcRotateTokenResponse,
} from 'libs/proto/auth/auth.proto.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from 'libs/common/jwt';
import { AppConfigService } from '../config/config.service';
import { AppLogger, LogContext } from 'libs/common/logger';

@Injectable()
export class AuthBaseServiceDependencies {
  constructor(
    protected appLogger: AppLogger,
    protected userRepository: UserRepository,
    protected refreshTokenRepository: RefreshTokenRepository,
    protected utilService: UtilService,
    protected jwtService: JwtService,
    protected appConfig: AppConfigService,
  ) {}
}

@Injectable()
export class AuthService extends AuthBaseServiceDependencies {
  @LogContext('AuthService.register')
  async register(payload: GrpcRegisterRequest): Promise<GrpcRegisterResponse> {
    const { email, password } = payload;
    const isExisted = await this.userRepository.count({ email: payload.email });

    if (isExisted) {
      this.appLogger.warn(`Registration attempt with existing email: ${email}`);
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
    const newRfToken = await this.refreshTokenRepository.create({
      userId: newUser._id.toString(),
      tokenHash: this.jwtService.hashToken(refreshToken),
      familyId: this.jwtService.generateFamilyId(),
      expiresAt: this.utilService.addDaysToDate(
        new Date(),
        this.appConfig.jwt.refreshTokenExpiration / msInDay || 7,
      ),
    });
    this.appLogger.log('Register success for user: ' + newUser.id);

    return {
      email: newUser.email,
      password: newUser.passwordHash,
      accessToken,
      refreshToken,
      familyId: newRfToken.familyId,
    };
  }

  @LogContext('AuthService.login')
  async login(payload: GrpcLoginRequest): Promise<GrpcLoginResponse> {
    const { email, password } = payload;
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      this.appLogger.warn(`Login attempt with non-existing email: ${email}`);
      throw new RpcException({
        code: 5,
        message: 'Invalid credentials',
      });
    }

    // todo: Implement account lockout after multiple failed attempts to prevent brute-force attacks
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.appLogger.warn(`Invalid password attempt for email: ${email}`);
      throw new RpcException({
        code: 5,
        message: 'Invalid credentials',
      });
    }
    const { accessToken, refreshToken } = this.jwtService.generateTokenPair({
      userId: user._id,
      role: user.globalRole,
    });
    const msInDay = 1000 * 60 * 60 * 24;
    const rfTokenRecord = await this.refreshTokenRepository.create({
      userId: user._id.toString(),
      tokenHash: this.jwtService.hashToken(refreshToken),
      familyId: this.jwtService.generateFamilyId(),
      expiresAt: this.utilService.addDaysToDate(
        new Date(),
        this.appConfig.jwt.refreshTokenExpiration / msInDay || 7,
      ),
    });
    this.appLogger.log('Login success for user: ' + user.id);
    return {
      email,
      accessToken,
      refreshToken,
      familyId: rfTokenRecord.familyId,
    };
  }

  @LogContext('AuthService.logout')
  async logout({
    userId,
    familyId,
  }: GrpcLogoutRequest): Promise<GrpcLogoutResponse> {
    await this.refreshTokenRepository.updateMany(
      { userId, familyId },
      { isRevoked: true },
    );
    // todo: Add userId:familyId to redis blacklist with ttl is the remaining time of the access token to immediately invalidate existing access tokens without waiting for their expiration
    this.appLogger.log(
      `Logout success for user: ${userId}, familyId: ${familyId}`,
    );
    return { success: true };
  }

  @LogContext('AuthService.rotateToken')
  async rotateToken({
    userId,
    familyId,
    refreshToken,
  }: GrpcRotateTokenRequest): Promise<GrpcRotateTokenResponse> {
    const tokenHash = this.jwtService.hashToken(refreshToken);

    const isExpiredRefreshToken = await this.refreshTokenRepository.findOne({
      userId,
      tokenHash,
      isRevoked: true,
    });

    if (isExpiredRefreshToken) {
      this.appLogger.warn(
        `Detected reuse of revoked refresh token for user: ${userId}, familyId: ${familyId}`,
      );
      await this.forceLogoutAllDevice(userId);
      throw new RpcException({
        code: 5,
        message: 'Invalid refresh token',
      });
    }

    const currentRfToken = await this.refreshTokenRepository.findOne({
      userId,
      familyId,
      tokenHash,
      isRevoked: false,
    });

    if (!currentRfToken) {
      throw new RpcException({
        code: 5,
        message: 'Invalid refresh token',
      });
    }
    const msIn6Hours = 1000 * 60 * 60 * 6;
    const { accessToken, refreshToken: newRefreshToken } =
      this.jwtService.generateTokenPair({
        userId,
      });
    if (currentRfToken.expiresAt.getTime() - Date.now() < msIn6Hours) {
      const newTokenHash = this.jwtService.hashToken(newRefreshToken);
      await this.refreshTokenRepository.create({
        userId,
        tokenHash: newTokenHash,
        familyId,
      });
      await this.refreshTokenRepository.updateById(
        currentRfToken._id.toString(),
        {
          isRevoked: true,
        },
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    }
    return {
      accessToken,
      refreshToken,
    };
  }

  @LogContext('AuthService.changePassword')
  async changePassword({
    userId,
    newPassword,
    isForceLogout = false,
  }: GrpcChangePasswordRequest): Promise<GrpcChangePasswordResponse> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await this.userRepository.updateById(userId, { passwordHash });
    if (isForceLogout) {
      await this.forceLogoutAllDevice(userId);
    }
    return { success: true };
  }

  @LogContext('AuthService.forceLogoutUser')
  private async forceLogoutAllDevice(userId: string) {
    await this.refreshTokenRepository.updateMany(
      { userId },
      { isRevoked: true },
    );
    // todo: Add userId:passwordChangeAt to redis blacklist to immediately invalidate existing access tokens without waiting for their expiration
    this.appLogger.log(`Force logout success for user: ${userId}`);
  }
}
