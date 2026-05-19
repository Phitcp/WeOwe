import { join } from 'path';

const PROTO_ARRAY = [
  {
    package: 'grpc.health.v1',
    protoPath: 'libs/proto/health.proto',
  },
];

export const buildProtoOptions = (
): { package: string[]; protoPath: string[] } => {
  return {
    package: PROTO_ARRAY.map((p) => p.package),
    protoPath: PROTO_ARRAY.map((p) => join(process.cwd(), p.protoPath)),
  };
};
