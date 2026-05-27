import { Body, Controller, Injectable, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordRequestDto, LoginRequestDto, LogoutRequestDto, RegisterDto, RegisterVO, RotateTokenRequestDto } from './auth.dto';
import { RefreshTokenGuard } from 'libs/guards/refresh-token.guard';
import { AuthGuard } from 'libs/guards/auth.guard';
import { RefreshTokenInterceptor } from 'libs/interceptors/http/refresh-token.interceptor';

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

  @Post('/login')
  async login(
    @Body() payload: LoginRequestDto,
  ) {
    return await this.authService.login(payload);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(
    @Body() payload: LogoutRequestDto,
  ) {
    return await this.authService.logout(payload);
  }
  
  @UseGuards(AuthGuard)
  @Post('/change-password')
  async changePassword(
    @Body() payload: ChangePasswordRequestDto,
  ) {
    return await this.authService.changePassword(payload);
  }

  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(RefreshTokenInterceptor)
  @Post('/rotate-token')
  async rotateToken(
    @Body() payload: RotateTokenRequestDto,
  ) {
    return await this.authService.rotateToken(payload);
  }

}
