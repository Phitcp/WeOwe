import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import crypto, { createHash } from 'crypto';
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

  hashToken(token: string): string {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    return tokenHash;
  }

  generateFamilyId(): string {
    return crypto.randomBytes(16).toString('hex'); // Generate a random 32-character hexadecimal string
  }
}
