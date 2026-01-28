import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class ScoreBySong {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Type(() => Number)
  score?: number;

  @IsInt()
  @Type(() => Number)
  songId: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?;
}
