import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/exeption.filter';
import { AppConfigService } from './configs/config.service';
import helmet from 'helmet';
import * as morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import { EEnvironment } from './common/interfaces/config.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  const appConfig: AppConfigService = app.get(AppConfigService);
  initialMiddleware(app, appConfig);
  // init error interceptor
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  // listen with port
  await app.listen(appConfig.port);

  console.info('Server listening with port', appConfig.port);
}

const initialMiddleware = (app, appConfig) => {
  // init config
  // apply middleware
  app.enableCors({
    origin: function (origin, callback) {
      if (appConfig.cors.origin === '*') return callback(null, true);
      if (!origin || !appConfig.cors.origin || appConfig.cors.origin === '*') return callback(null, true);
      const allowedDomains = appConfig.cors.origin.split(',');

      if (!allowedDomains.includes(origin)) {
        const msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: appConfig.cors.credentials,
  });

  if (appConfig.env === EEnvironment.development) {
    app.use(morgan(appConfig.log.format));
  } else {
    const accessLogStream = createStream('access.log', {
      interval: '1d', // rotate daily
      path: appConfig.log.logDir,
    });

    app.use(
      morgan(appConfig.log.format, {
        stream: accessLogStream,
      }),
    );
  }

  app.use(helmet());
};
bootstrap();
