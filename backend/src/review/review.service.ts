import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateSong, ScoreBySong } from './dto';
import { SONG_FULL_SELECT } from 'src/song/common/constants';
import { mapSongToResponse } from 'src/libs/common/src/utils';
import { SongResponse } from 'src/song/common/interfaces';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async rateSong(dto: RateSong, userId: string): Promise<SongResponse> {
    const { songId, score, comment } = dto;
    await this.prisma.review.upsert({
      where: { userId_songId: { userId: userId, songId: songId } },
      update: { score, comment },
      create: {
        songId,
        userId,
        score,
        comment,
      },
    });
    const stats = await this.prisma.review.aggregate({ where: { songId }, _avg: { score: true } });
    const updateScore = await this.prisma.song.update({
      where: { id: songId },
      data: { rating: stats._avg.score },
      select: SONG_FULL_SELECT,
    });

    return mapSongToResponse(updateScore);
  }

  async getScore(dto: ScoreBySong) {
    const { page, ...dataFromDto } = dto;
    const limit = 2;
    const offset = dto.page ? (dto.page - 1) * limit : 0;
    const [total, data] = await Promise.all([
      this.prisma.review.count(),
      this.prisma.review.findMany({
        take: limit,
        skip: offset,
        where: { ...dataFromDto },
        orderBy: { updateAt: 'desc' },
      }),
    ]);
    return {
      total,
      limit,
      offset,
      data,
    };
  }
}
