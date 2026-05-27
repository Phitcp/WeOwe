import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export interface AuthServiceClient {
  register(
    data: GrpcRegisterRequest,
    metaData: Metadata,
  ): Observable<GrpcRegisterResponse>;

  login(
    data: GrpcLoginRequest,
    metaData: Metadata,
  ): Observable<GrpcLoginResponse>;

  logout(
    data: GrpcLogoutRequest,
    metaData: Metadata,
  ): Observable<GrpcLogoutResponse>;

  rotateToken(
    data: GrpcRotateTokenRequest,
    metaData: Metadata,
  ): Observable<GrpcRotateTokenResponse>;
  
  changePassword(
    data: GrpcChangePasswordRequest,
    metaData: Metadata,
  ): Observable<GrpcChangePasswordResponse>;
}

export class GrpcRegisterRequest {
  email: string;
  password: string;
}

export class GrpcRegisterResponse {
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;
  familyId: string;
}

export class GrpcLoginRequest {
  email: string;
  password: string;
}

export class GrpcLoginResponse {
  email: string;
  accessToken: string;
  refreshToken: string;
  familyId: string;
}

export class GrpcLogoutRequest {
  userId: string;
  familyId: string;
}

export class GrpcLogoutResponse {
  success: boolean;
}

export class GrpcRotateTokenRequest {
  userId: string;
  refreshToken: string;
  familyId: string;
}

export class GrpcRotateTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class GrpcChangePasswordRequest {
  userId: string;
  newPassword: string;
  isForceLogout?: boolean;
}

export class GrpcChangePasswordResponse {
  success: boolean;
}
