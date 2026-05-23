import { IsEmail, IsString, MinLength } from "class-validator";

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
}