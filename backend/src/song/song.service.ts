import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSongDTO, UpdateSongDTO } from './dto';
import { SongFindsParamKeys, SongFindsParamValues } from './common/types';
import { SongResponse } from './common/interfaces';
import { SongSearchFactory } from './strategies';
import { SONG_FULL_SELECT } from './common/constants';
import { mapSongToResponse } from 'src/libs/common/src/utils';

@Injectable()
export class SongService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSongs(): Promise<SongResponse[]> {
    const song = await this.prisma.song.findMany({ where: {}, select: SONG_FULL_SELECT });
    return song.map(mapSongToResponse);
  }

  async addSong(dto: AddSongDTO): Promise<SongResponse> {
    const { userId, tagsId, ...data } = dto;
    const findSong = await this.findSongByParms('title', dto.title);

    if (Array.isArray(findSong) && findSong.length > 0) {
      throw new BadRequestException('song alredy added');
    }
    const song = await this.prisma.song.create({
      data: {
        ...data,
        author: { connect: { id: userId } },
        tags: { connect: tagsId.map((id) => ({ id })) },
      },
      select: {
        id: true,
        title: true,
        content: true,
        userId: true,
        authorSong: true,
        tags: { select: { name: true } },
      },
    });

    return { ...song, tags: song.tags.map((el) => el.name) };
  }

  async findSongByParms(
    key: SongFindsParamKeys,
    value: SongFindsParamValues,
  ): Promise<SongResponse[]> {
    const findStrategy = SongSearchFactory.getStrategy(key);
    const song = await findStrategy.find(this.prisma, value);
    return song.map(mapSongToResponse);
  }

  async deleteSongById(id: number) {
    try {
      return await this.prisma.song.delete({ where: { id } });
    } catch (e) {
      if (e.code === 'P2025') {
        return;
      }
      throw e;
    }
  }

  async updateSong(id: number, dto: UpdateSongDTO) {
    try {
      const { tags, ...data } = dto;

      const songUpdated = await this.prisma.song.update({
        where: { id },
        data: { ...data, ...(tags && { tags: { set: tags.map((el) => ({ id: el })) } }) },
        select: SONG_FULL_SELECT,
      });
      return mapSongToResponse(songUpdated);
    } catch (e) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Song with ID ${id} not found or access denied`);
      }
      throw e;
    }
  }
}
