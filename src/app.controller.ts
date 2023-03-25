import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigService } from './configs/config.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, appConfigService: AppConfigService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
