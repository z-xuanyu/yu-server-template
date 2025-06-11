import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CommonModule } from '@app/common';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [CommonModule, AuthModule, AccountModule, RoleModule, MenuModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AdminModule { }
