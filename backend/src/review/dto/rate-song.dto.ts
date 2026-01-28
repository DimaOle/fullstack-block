import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class RateSong {
  @IsInt()
  @Min(0)
  @Max(5)
  score: number;

  @IsInt()
  songId: number;

  @IsString()
  @Length(3, 200)
  @IsOptional()
  comment: string;
}
