import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user.role) {
      throw new ForbiddenException(`don't have access`);
    }
    const superAdmin = user.role.some((el) => el === 'SUPERADMIN');

    if (superAdmin) {
      return true;
    }
    const id = +req.params.id;
    if (!id) {
      throw new BadRequestException('params ID not found');
    }
    const findSong = await this.prisma.song.findFirst({
      where: { id },
      select: { id: true, author: { select: { email: true } } },
    });

    if (!findSong || user.user !== findSong.author.email) {
      throw new ForbiddenException(`don't have access`);
    }
    return true;
  }
}
