/*
 * @Author: 阿宇 969718197@qq.com
 * @Date: 2025-06-09 11:04:59
 * @LastEditors: 阿宇 969718197@qq.com
 * @LastEditTime: 2025-06-09 11:06:36
 * @Description:
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return requiredPermissions.some((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
