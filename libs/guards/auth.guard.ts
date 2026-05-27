
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from 'libs/common/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private JwtService: JwtService,
    ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.JwtService.verify(token);
      request.user = decoded; // Attach decoded token to request object
      return true;
    } catch (err) {
      return false;
    }
  }
}
