import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MyProfileResponse, RequestWithUser } from './interfaces';
import { CreateUser } from 'src/auth/interfaces';
import * as bcrypt from 'bcrypt';
import { UserUpdateChangePassword, UserUpdateDto } from './dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configServise: ConfigService,
  ) {}

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

  async deleteUser(email: string) {
    const userDelete = await this.prisma.user.deleteMany({ where: { email: email } });
    console.log(userDelete);
    return true;
  }

  async updateUser(userId: string, dto: UserUpdateDto) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User by ${userId} dont found`);
      }

      return this.prisma.user.update({
        where: { id: userId },
        data: dto,
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

  async cahngePasswordUser(userId: string, dto: UserUpdateChangePassword) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User by ${userId} dont found`);
    }
    const matchPass = await bcrypt.compare(dto.password, user.password);
    const password = this.configServise.getOrThrow<string>('PASS_FOR_REGISTER_PROVIDER');
    const matchPassProviders = await bcrypt.compare(password, user.password);

    if (!matchPass && !matchPassProviders) {
      throw new UnauthorizedException('password incorect');
    }

    const hashPass = await bcrypt.hash(dto.newPassword, 10);
    return this.prisma.user.update({ where: { id: userId }, data: { password: hashPass } });
  }

  findOwnerProfile(userId: string): Promise<MyProfileResponse> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true, role: true, id: true },
    });
  }
}
