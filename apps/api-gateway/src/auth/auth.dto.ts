import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class RegisterVO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsString()
  familyId: string;
}

export class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginResponseVO {
  @IsEmail()
  email: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsString()
  familyId: string;
}

export class LogoutRequestDto {
  @IsString()
  familyId: string;
}

export class LogoutResponseVO {
  success: boolean;
}

export class RotateTokenRequestDto {
  @IsString()
  familyId: string;
}

export class RotateTokenResponseVO {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}

export class ChangePasswordRequestDto {
  @IsString()
  newPassword: string;

  @IsBoolean()
  @IsOptional()
  isForceLogout?: boolean;
}

export class ChangePasswordResponseVO {
  success: boolean;
}
