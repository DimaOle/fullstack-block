import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { AtLeastOneProperty } from 'src/libs/common/src/decorators';

@AtLeastOneProperty()
export class FindSongQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  authorSong?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    // Если пришло одиночное значение, оборачиваем в массив
    // Если уже массив (пришло несколько ?tags=5&tags=6), оставляем как есть
    return Array.isArray(value) ? value.map(Number) : [Number(value)];
  })
  @IsArray()
  @IsInt({ each: true })
  tags: number[];
}
