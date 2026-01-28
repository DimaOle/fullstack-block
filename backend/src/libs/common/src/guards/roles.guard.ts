import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@prisma/client';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user.role && !Array.isArray(user.role)) {
      throw new UnauthorizedException('dont have roles');
    }

    return this.mathRoles(requiredRoles, user.role);
  }

  private mathRoles(roles: string[], userRoles: string[]): boolean {
    let result = false;
    for (let i = 0; i < roles.length; i++) {
      const accept = userRoles.some((el) => el == roles[i]);
      if (accept) {
        result = true;
        break;
      }
    }
    if (!result) {
      throw new UnauthorizedException('dont have roles');
    }
    return true;
  }
}
