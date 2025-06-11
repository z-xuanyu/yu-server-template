import { Module } from '@nestjs/common';
import { WebController } from './web.controller';
import { WebService } from './web.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [CommonModule, AuthModule, UserModule],
  controllers: [WebController],
  providers: [
    WebService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class WebModule { }
