import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type UserReqType = 'user' | 'userId' | 'role';

export const UserFromReq = createParamDecorator(
  (data: UserReqType | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.user) {
      return {};
    }

    return data ? req.user[data] : req.user;
  },
);
