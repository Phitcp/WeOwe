import { join } from 'path';

const PROTO_ARRAY = [
  {
    package: 'grpc.health.v1',
    protoPath: 'libs/proto/health/health.proto',
  },
  {
    package: 'grpc.auth.v1',
    protoPath: 'libs/proto/auth/auth.proto',
  },
];

export const buildProtoOptions = (): {
  package: string[];
  protoPath: string[];
} => {
  return {
    package: PROTO_ARRAY.map((p) => p.package),
    protoPath: PROTO_ARRAY.map((p) => join(process.cwd(), p.protoPath)),
  };
};

export class GrpcMetaData {
  traceId: string;
  userId?: string;
}

export const buildMetadata = (context) => {
  const metaData = {
    traceId: context.traceId || 'unknown-trace-id',
    userId: context.userId || 'unknown-user-id',
  };
  return metaData;
};
