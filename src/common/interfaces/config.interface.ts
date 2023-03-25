export interface IDatabaseConfig {
  host: string;
  port: number;
  dbName: string;
  endPoint: string;
}

export interface ILogConfig {
  format: string;
  logDir: string;
}

export interface ICorsConfig {
  origin: string;
  credentials: boolean;
}

export interface IAllConfig {
  env: string;
  port: number;
  database: IDatabaseConfig;
  log: ILogConfig;
  cors: ICorsConfig;
}

export enum EEnvironment {
  development = 'development',
  production = 'production',
  staging = 'staging',
}
