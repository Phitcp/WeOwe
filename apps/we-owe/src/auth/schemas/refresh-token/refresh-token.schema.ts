import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export enum GLOBAL_ROLE_ENUM {
  'Admin',
  'User',
}

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema()
export class RefreshToken {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  tokenHash: string;

  @Prop({
    required: true,
  })
  familyId: string;

  @Prop({
    required: true,
    default: false,
  })
  isRevoked: boolean;

  @Prop({ 
    required: true,
   })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
