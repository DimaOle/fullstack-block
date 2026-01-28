import { RoleEnum } from '@prisma/client';

export interface JwtAccesToken {
  access_token: string;
}

export interface CreateUser {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  createdAt: Date;
  tokens?: JwtAccesToken;
}

// export type CreatedUser = Prisma.UserGetPayload<{
//   select: {
//     id: true;
//     firstName: true;
//     lastName: true;
//     email: true;
//     createdAt: true;
//   };
// }>;
