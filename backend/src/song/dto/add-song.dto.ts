import { IsArray, IsInt, IsString, IsUUID } from 'class-validator';

export class AddSongDTO {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsUUID()
  userId: string;

  @IsArray()
  @IsInt({ each: true })
  tagsId: number[];

  @IsString()
  authorSong: string;
}
