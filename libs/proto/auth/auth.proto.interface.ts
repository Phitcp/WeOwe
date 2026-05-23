import { Observable } from 'rxjs';
import { GrpcMetaData } from '../utils';

export interface AuthServiceClient {
  register(
    data: GrpcRegisterRequest,
    metaData: GrpcMetaData,
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
