import { Prisma } from '@prisma/client';

export const SONG_FULL_SELECT: Prisma.SongSelect = {
  id: true,
  title: true,
  content: true,
  userId: true,
  authorSong: true,
  rating: true,
  tags: { select: { name: true } },
};
