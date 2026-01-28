import { Prisma } from '@prisma/client';
import { SONG_FULL_SELECT } from '../common/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { SongFindsParamKeys } from '../common/types';

export type SongWithTags = Prisma.SongGetPayload<{
  select: typeof SONG_FULL_SELECT;
}>;

export interface ISongSearchStrategy<T = any> {
  find(prisma: PrismaService, value: T): Promise<SongWithTags[]>;
}

export class TagSearchStrategy implements ISongSearchStrategy<number[]> {
  async find(prisma: PrismaService, value: number[]): Promise<SongWithTags[]> {
    return prisma.song.findMany({
      where: { tags: { some: { id: { in: value } } } },
      select: SONG_FULL_SELECT,
    });
  }
}

export class DefaultSearchStrategy implements ISongSearchStrategy<string | number> {
  constructor(private readonly key: string) {}
  async find(prisma: PrismaService, value: string | number): Promise<SongWithTags[]> {
    return prisma.song.findMany({ where: { [this.key]: value }, select: SONG_FULL_SELECT });
  }
}

export class SongSearchFactory {
  static getStrategy(key: SongFindsParamKeys): ISongSearchStrategy {
    if (key == 'tags') {
      return new TagSearchStrategy();
    }
    return new DefaultSearchStrategy(key);
  }
}
