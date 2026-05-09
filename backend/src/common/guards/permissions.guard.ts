import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/index';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (user?.role === 'SUPER_ADMIN') return true;

    const perms: string[] = user?.permissions || [];
    if (!required.every((p) => perms.includes(p))) {
      throw new ForbiddenException(`Required permissions: ${required.join(', ')}`);
    }
    return true;
  }
}
