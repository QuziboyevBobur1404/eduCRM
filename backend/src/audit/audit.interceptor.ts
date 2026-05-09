import {
  CallHandler, ExecutionContext, Injectable, NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, ip, headers } = request;

    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (response) => {
        if (!user?.id) return;
        const parts = url.split('/').filter(Boolean);
        const entityType = parts[1]
          ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1, -1)
          : 'Unknown';
        const entityId = response?.id || parts[2] || 'unknown';
        const actionMap: Record<string, string> = {
          POST: `${entityType.toLowerCase()}.create`,
          PATCH: `${entityType.toLowerCase()}.update`,
          PUT: `${entityType.toLowerCase()}.update`,
          DELETE: `${entityType.toLowerCase()}.delete`,
        };
        await this.auditService.log({
          userId: user.id,
          tenantId: user.tenantId,
          action: actionMap[method] || method.toLowerCase(),
          entityType,
          entityId,
          ipAddress: ip,
          userAgent: headers['user-agent'],
        });
      }),
    );
  }
}
