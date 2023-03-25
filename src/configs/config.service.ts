import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICorsConfig, IDatabaseConfig, ILogConfig } from 'src/common/interfaces/config.interface';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('env');
  }
  get port(): number {
    return Number(this.configService.get<number>('port'));
  }
  get database(): IDatabaseConfig {
    return this.configService.get<IDatabaseConfig>('database');
  }
  get log(): ILogConfig {
    return this.configService.get<ILogConfig>('log');
  }
  get cors(): ICorsConfig {
    return this.configService.get<ICorsConfig>('cors');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('jwtSecret');
  }
}
