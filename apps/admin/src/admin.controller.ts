import { Controller, Get, Version } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/auth.guard';
import { Throttle } from '@nestjs/throttler';
import { Idempotence } from '@app/common/decorators/idempotence.decorator';

@ApiTags('首页')
@Public()
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Throttle({ default: { limit: 1, ttl: 1000 } })
  @Idempotence({
    errorMessage: '请10秒后再发送验证码',
  })
  @Get()
  getHello(): string {
    return this.adminService.getHello();
  }
}
