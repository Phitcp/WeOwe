import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { grpcToHttp } from './grpc-to-http-error.converter';

interface GrpcError {
  code: number;
  details?: string;
}
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: GrpcError, host: ArgumentsHost) {
    const httpStatus = grpcToHttp[exception.code] ?? 500;

    host.switchToHttp().getResponse().status(httpStatus).json({
      statusCode: httpStatus,
      message: exception.details,
    });
  }
}
