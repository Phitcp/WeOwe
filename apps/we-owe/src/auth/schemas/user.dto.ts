import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum GLOBAL_ROLE_ENUM {
  'Admin',
  'User',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    required: true,
  })
  email: string;

  @Prop(
    {
        required: true,
    }
  )
  passwordHash: string;

  @Prop(
    {
        required: true,
        default: GLOBAL_ROLE_ENUM.User
    }
  )
  globalRole: GLOBAL_ROLE_ENUM;
}

export const UserSchema = SchemaFactory.createForClass(User);
