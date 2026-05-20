import * as joi from 'joi';

export const envValidationSchema = joi.object({
  PORT: joi.number().required(),
});