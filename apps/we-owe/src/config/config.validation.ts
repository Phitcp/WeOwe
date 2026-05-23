import * as joi from 'joi';

export const envValidationSchema = joi.object({
  PORT: joi.string().required(),
  MONGO_CS: joi.string().required(),
  MONGO_DB: joi.string().optional(),
  JWT_SECRET: joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION: joi.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRATION: joi.string().default('7d'),
});