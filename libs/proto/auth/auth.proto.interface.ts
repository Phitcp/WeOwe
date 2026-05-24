import { Observable } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

export interface AuthServiceClient {
  register(
    data: GrpcRegisterRequest,
    metaData: Metadata,
  ): Observable<GrpcRegisterResponse>;
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
}
