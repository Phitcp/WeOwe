import { ExceptionFilter, Catch, ArgumentsHost, Injectable } from '@nestjs/common';
import { grpcToHttp } from './grpc-to-http-error.converter';
import { AppLogger } from 'libs/common/logger';

interface GrpcError {
  code: number;
  details?: string;
}

@Injectable()
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly appLogger: AppLogger,
  ) {}
  catch(exception: GrpcError, host: ArgumentsHost) {
    const httpStatus = grpcToHttp[exception.code] ?? 500;

    this.appLogger.error(
      `gRPC Error - Code: ${exception.code}, Details: ${exception.details}`,
    );
    host.switchToHttp().getResponse().status(httpStatus).json({
      statusCode: httpStatus,
      message: exception.details,
    });
  }
}
