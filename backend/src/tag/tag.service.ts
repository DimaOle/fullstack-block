import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddTagDTO } from './dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async geatAll() {
    return await this.prisma.tag.findMany({});
  }

  async addTag(dto: AddTagDTO) {
    const tag = await this.prisma.tag.upsert({
      where: { name: dto.tagName },
      update: {},
      create: { name: dto.tagName },
    });

    return tag;
  }

  async deleteTag(id: number) {
    try {
      await this.prisma.tag.delete({ where: { id } });
      return;
    } catch (e) {
      if (e.code === 'P2025') {
        return;
      }
      throw e;
    }
  }

  async getByParam(key: 'id' | 'name', value: string | number) {
    return await this.prisma.tag.findFirst({
      where: { [key]: value },
    });
  }
}
