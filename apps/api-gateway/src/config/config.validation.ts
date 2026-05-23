import * as joi from 'joi';

const JWT_CONFIG_OBJECT = {
  JWT_SECRET: joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION: joi.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRATION: joi.string().default('7d'),
};

export const envValidationSchema = joi.object({
  PORT: joi.number().required(),
  ...JWT_CONFIG_OBJECT,
});
