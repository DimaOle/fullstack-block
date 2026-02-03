import { RoleEnum } from '@prisma/client';

export type RequestWithUser = Request & { user: JwtUser };
interface JwtUser {
  role: RoleEnum[];
  user: string;
  password: string;
}
