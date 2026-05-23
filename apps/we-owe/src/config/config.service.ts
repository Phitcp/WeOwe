import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get mongoUri(): string {
    return this.config.get<string>('MONGODB_URI')!;
  }

  get port(): number {
    return this.config.get<number>('PORT')!;
  }

  get weOwePort(): string {
    return this.config.get<string>('WE_OWE_PORT')!;
  }
  
  get jwt() {
    return {
      secret: this.config.get<string>('JWT_SECRET')!,
      accessTokenExpiration: this.config.get<number>(
        'JWT_ACCESS_TOKEN_EXPIRATION',
      )!,
      refreshTokenExpiration: this.config.get<number>(
        'JWT_REFRESH_TOKEN_EXPIRATION',
      )!,
    };
  }
}
