import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterVO } from './auth.dto';

@Injectable()
export class AuthControllerBaseDependencies {
  constructor(
    protected readonly authService: AuthService,
  ) {}
}

@Controller('/api/v1/auth')
export class AuthController extends AuthControllerBaseDependencies {
  @Post('/register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterVO> {
    return await this.authService.register(registerDto);
  }
}
