import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { DbModule } from '@app/db';

@Global()
@Module({
  imports: [DbModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
