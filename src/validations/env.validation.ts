import * as Joi from 'joi';

const ENV_VALIDATION = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production', 'test').default('development'),
  PORT: Joi.number(),
  JWT_SECRET: Joi.number().default(9000),
  LOG_FORMAT: Joi.string().default('dev'),
  LOG_DIR: Joi.string().default('../logs'),
  ORIGIN: Joi.string().default('*'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(27017),
  DB_DATABASE: Joi.string().default('dev'),
});

export default ENV_VALIDATION;
