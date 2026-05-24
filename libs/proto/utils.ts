import { Metadata } from '@grpc/grpc-js';
import { OperationContext } from 'libs/decorators/operation-context';
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

export const buildMetadata = (context: OperationContext) => {
  const metaData = {
    traceId: context?.traceId || 'unknown-trace-id',
    userId: context?.userId || 'unknown-user-id',
  };
  const metadata = new Metadata();
  Object.entries(metaData).forEach(([key, value]) => {
    metadata.set(key, value);
  });
  return metadata;
};
