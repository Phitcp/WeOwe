import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {

        const expires = configService.get('JWT_ACCESS_TOKEN_EXPIRATION')
        return {
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRATION', '15m'),
        },
      }
      },
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
