import { Controller, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/guards/auth.guard';
import { Throttle } from '@nestjs/throttler';
import { Idempotence } from '@app/common/decorators/idempotence.decorator';
import { QueueService } from '@app/shared/queue/queue.service';
import * as spawn from 'cross-spawn'

@ApiTags('首页')
@Public()
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService, private readonly queueService: QueueService) { }

  @Throttle({ default: { limit: 1, ttl: 1000 } })
  @Idempotence({
    errorMessage: '请10秒后再发送验证码',
  })
  @Get()
  getHello(): string {
    const path = process.cwd();
    const child = spawn('node', ['-v'], { cwd: path });
    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code})
        `);
    });
    return this.adminService.getHello();
  }


  @Post('cancelOrder/:id')
  @ApiOperation({ summary: '创建取消订单队列' })
  @ApiParam({ name: 'id', description: '订单id' })
  async add(@Param('id') id: string) {
    return await this.queueService.createCancelOrdeQueue(id);
  }
}
