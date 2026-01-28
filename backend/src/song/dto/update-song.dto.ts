import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { AtLeastOneProperty } from 'src/libs/common/src/decorators';

@AtLeastOneProperty()
export class UpdateSongDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  authorSong?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];
}
