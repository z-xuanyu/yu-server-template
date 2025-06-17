/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-06-09 11:04:59
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-06-16 15:24:37
 * @Description: 权限守卫
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';
import { ErrorEnum } from '@app/common/constants/error.constant';
import { AuthService } from '../auth.service';
import { ApiFail } from '@app/common/response/result';
// import { ApiFail } from '@app/common/response/result';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // 如果没有登录用户，直接抛出未授权异常
    if (!user) throw new ApiFail(1000, ErrorEnum.LOGIN_FIRST);

    // 演示环境，只能get请求
    // if (request.method !== 'GET') {
    //   throw new ApiFail(1002, ErrorEnum.AUTH_DEMO_NO_OPERATE);
    // }

    // 获取用户权限码
    const codes = await this.authService.getUserPermissioncodes(user.id);
    if (!codes || codes.length === 0) {
      // 如果用户没有权限码，直接抛出未授权异常
      throw new ApiFail(10011, ErrorEnum.NO_PERMISSION);
    }
    // 如果用户没有权限码，直接抛出未授权异常
    const hasPermissions = requiredPermissions.some((permission) =>
      codes?.includes(permission),
    );
    if (!hasPermissions) {
      throw new ApiFail(10011, ErrorEnum.NO_PERMISSION);
    }
    return hasPermissions;
  }
}
