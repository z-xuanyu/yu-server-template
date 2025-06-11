import { Controller, Get } from '@nestjs/common';
import { WebService } from './web.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('首页')
@Controller()
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Get()
  getHello(): string {
    return this.webService.getHello();
  }
}
