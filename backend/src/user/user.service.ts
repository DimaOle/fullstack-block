import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RequestWithUser } from './interfaces';
import { CreateUser } from 'src/auth/interfaces';
import { UpdateUserDTO } from './dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string): Promise<CreateUser | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email },
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
      });
      return user;
    } catch (e) {
      console.log(`Prisma: ${e}`);
      throw new InternalServerErrorException('Database error');
    }
  }

  async getUserById(userId: string): Promise<CreateUser | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
        select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
      });
      return user;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Database error');
    }
  }

  async deleteUser(req: RequestWithUser, email: string) {
    const emailJwt = req.user.email;
    if (emailJwt === email) {
      const userDelete = await this.prisma.user.deleteMany();
    }
    return true;
  }

  async updateUser(userId, dto: UpdateUserDTO) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User by ${userId} dont found`);
      }

      if (dto.password !== dto.repeatPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      const { repeatPassword, ...data } = dto;
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      return this.prisma.user.update({
        where: { id: userId },
        data,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          updateAt: true,
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
