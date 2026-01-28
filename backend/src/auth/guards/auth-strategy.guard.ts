import { BadRequestException, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthMode } from '../enums';

export function CreateAuthGuard(strategy: string): Type<IAuthGuard> {
  class MixinAuthGuard extends AuthGuard(strategy) {
    getAuthenticateOptions(ctx: ExecutionContext) {
      const req = ctx.switchToHttp().getRequest<Request>();
      const mode = req.query.mode as AuthMode;
      if (!mode || !Object.values(AuthMode).includes(mode)) {
        throw new BadRequestException('Mode dont includes or invalide');
      }
      return {
        state: mode,
      };
    }
  }
  return mixin(MixinAuthGuard);
}
