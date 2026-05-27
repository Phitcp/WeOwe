import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();

      this.appLogger.error(
        `Gateway HttpException - Status: ${statusCode}, Response: ${JSON.stringify(errorResponse)}`,
      );

      response.status(statusCode).json({
        statusCode,
        message: errorResponse,
        path: request?.url,
      });
      return;
    }

    if (this.isGrpcError(exception)) {
      const httpStatus = grpcToHttp[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
      const message = exception.details ?? 'Internal server error';

      this.appLogger.error(
        `gRPC Error - Code: ${exception.code}, Details: ${message}`,
      );

      response.status(httpStatus).json({
        statusCode: httpStatus,
        message,
        path: request?.url,
      });
      return;
    }

    const message = exception instanceof Error
      ? exception.message
      : 'Internal server error';

    this.appLogger.error(
      `Gateway Error - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      path: request?.url,
    });
  }

  private isGrpcError(exception: unknown): exception is GrpcError {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      'code' in exception &&
      typeof (exception as { code: unknown }).code === 'number'
    );
  }
}
