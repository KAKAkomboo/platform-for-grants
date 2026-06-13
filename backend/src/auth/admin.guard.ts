import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.role === 'admin') {
      return true;
    }
    throw new ForbiddenException('Доступ дозволено тільки адміністраторам');
  }
}
