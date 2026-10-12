import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Skip for public endpoints or platform admins without org context
    if (!user) {
      return next.handle();
    }

    // For non-platform-admin users, organizationId is required
    if (!user.isPlatformAdmin && !user.organizationId) {
      throw new BadRequestException(
        'Organization context is required for this operation',
      );
    }

    // Inject organizationId into request body for create/update operations
    if (user.organizationId) {
      if (request.body && typeof request.body === 'object') {
        request.body.organizationId = user.organizationId;
      }

      // Also add to query params for filtering
      request.query = request.query || {};
      request.query.organizationId = user.organizationId;
    }

    return next.handle();
  }
}
