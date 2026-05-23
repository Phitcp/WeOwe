import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  verify(token: string) {
    return this.jwtService.verify(token);
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }

  generateTokenPair(payload: Record<string, any>): {
    accessToken: string;
    refreshToken: string;
  } {
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION') || '7d',
    });

    return { accessToken, refreshToken };
  }

  async hashToken(token: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(token, salt);
  }

  generateFamilyId(): string {
    return crypto.randomBytes(16).toString('hex'); // Generate a random 32-character hexadecimal string
  }
}
