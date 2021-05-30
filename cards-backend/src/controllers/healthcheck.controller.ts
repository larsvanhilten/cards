import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthcheckController {
  @Get()
  public healthcheck(): string {
    return;
  }
}
