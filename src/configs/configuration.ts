export default () => ({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dbName: process.env.DB_DATABASE,
    endPoint: `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  },
  log: {
    format: process.env.LOG_FORMAT,
    logDir: process.env.LOG_DIR,
  },
  cors: {
    origin: process.env.ORIGIN,
    credentials: process.env.CREDENTIALS,
  },
  jwtSecret: process.env.JWT_SECRET,
});
