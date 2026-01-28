import { SongResponse } from 'src/song/common/interfaces';
import { SongWithTags } from 'src/song/strategies';

export const mapSongToResponse = (song: SongWithTags): SongResponse => {
  return {
    ...song,
    tags: song.tags.map((t) => t.name),
  };
};
