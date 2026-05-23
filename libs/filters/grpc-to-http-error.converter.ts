import { status } from "@grpc/grpc-js";
import { HttpStatus } from "@nestjs/common";

export const grpcToHttp: Record<number, number> = {
  [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
  [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [status.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
  [status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
}