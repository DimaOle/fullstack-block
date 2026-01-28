import { RoleEnum } from '@prisma/client';

export type RequestWithUser = Request & { user: JwtUser };
interface JwtUser {
  role: RoleEnum[];
  email: string;
  password: string;
}
