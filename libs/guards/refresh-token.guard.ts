// libs/common/src/decorators/refresh-token.decorator.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from 'libs/common/jwt';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private JwtService: JwtService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-refresh-token'];

    if (!token) {
      return false;
    }
    try {
      const decoded = this.JwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (err) {
      return false;
    }
  }
}
