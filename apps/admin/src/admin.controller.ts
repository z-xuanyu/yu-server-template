import { Controller, Get, Version } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth/auth.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('首页')
@Public()
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Throttle({ default: { limit: 3, ttl: 1000 } })
  @Get()
  getHello(): string {
    return this.adminService.getHello();
  }
}
